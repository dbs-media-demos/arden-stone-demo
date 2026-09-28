"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Arrow } from "@/components/ui/Button";
import { site } from "@/lib/site";

const TYPES = ["Whole home", "Kitchen", "Primary bath", "Addition", "Outdoor living", "Interiors", "Historic restoration", "Not sure yet"];
const BUDGETS = ["Under $100k", "$100k – $250k", "$250k – $500k", "$500k – $1M", "$1M +"];
const TIMING = ["As soon as possible", "In 3–6 months", "In 6–12 months", "Just exploring"];

type Data = {
  type: string;
  budget: string;
  timing: string;
  area: string;
  details: string;
  name: string;
  email: string;
  phone: string;
  contact: string;
};

const STEPS = ["Your project", "Your home", "Your details"];

/** Three-step consultation request with inline validation and a polished (simulated) success state. Nothing is sent. */
export function ContactForm() {
  const params = useSearchParams();
  const id = useId();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const fromEstimate = params.get("range");
  const [data, setData] = useState<Data>(() => {
    // Prefill from the estimator (?project=Kitchen&size=260&finish=refined&range=$175k–$235k).
    const project = params.get("project");
    const alias: Record<string, string> = { "Secondary bath": "Primary bath" };
    const type = project ? (TYPES.find((x) => x.toLowerCase() === (alias[project] ?? project).toLowerCase()) ?? "") : "";
    return {
      type,
      budget: "",
      timing: TIMING[1],
      area: "",
      details: project ? `From the estimator: ${project}, about ${params.get("size")} sq ft, ${params.get("finish")} finish, estimated ${params.get("range")}.` : "",
      name: "",
      email: "",
      phone: "",
      contact: "Phone",
    };
  });

  // Animate each step in.
  useEffect(() => {
    if (!panel.current || prefersReducedMotion()) return;
    gsap.fromTo(panel.current.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "expo.out" });
  }, [step, done]);

  const set = (k: keyof Data) => (v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (s: number) => {
    const e: Partial<Record<keyof Data, string>> = {};
    if (s === 0) {
      if (!data.type) e.type = "Choose the kind of project.";
      if (!data.budget) e.budget = "Choose a budget range. A rough idea is fine.";
    }
    if (s === 1) {
      if (data.area.trim().length < 2) e.area = "Tell us the neighborhood or ZIP code.";
      if (data.details.trim().length < 10) e.details = "A sentence or two about the house and what you'd like to change.";
    }
    if (s === 2) {
      if (data.name.trim().length < 2) e.name = "Please enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) e.email = "Please enter a valid email address.";
      if (data.phone.replace(/\D/g, "").length < 10) e.phone = "Please enter a 10-digit phone number.";
    }
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) requestAnimationFrame(() => document.getElementById(`${id}-${first}`)?.focus());
    return !first;
  };

  const next = () => validate(step) && setStep((s) => s + 1);

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (step < 2) return next();
    if (!validate(2)) return;
    setSending(true);
    // Demo: simulate a round trip. No data leaves the browser.
    window.setTimeout(() => {
      setSending(false);
      setDone(true);
    }, 1300);
  };

  const err = (k: keyof Data) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} role="alert" className="mt-2 text-sm text-[#a2341f]">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof Data) => ({ id: `${id}-${k}`, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined });

  if (done) {
    return (
      <div ref={panel} className="rounded-sm bg-ink p-8 text-ivory md:p-14" role="status">
        <svg viewBox="0 0 52 52" className="h-14 w-14 text-bronze-light" aria-hidden>
          <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M15 27l7 7 15-16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="40" strokeDashoffset="0" className="[animation:draw-check_1s_var(--ease-out-expo)_both]" />
        </svg>
        <p className="display-l mt-8">
          Thank you, {data.name.split(" ")[0]}. <em className="italic text-bronze-light">We&rsquo;ll be in touch.</em>
        </p>
        <p className="mt-6 max-w-lg text-ivory/75">
          A project lead will {data.contact === "Email" ? "email" : "call"} you within one working day to arrange a visit to your {data.area} home. In the meantime, have a
          look through our recent work.
        </p>
        <ol className="mt-10 grid gap-4 border-t border-ivory/15 pt-8 sm:grid-cols-3">
          {["We call you within one working day", "A free 90-minute home visit", "A written budget range within a week"].map((s, i) => (
            <li key={s} className="text-sm text-ivory/80">
              <span className="label block text-bronze-light">0{i + 1}</span>
              <span className="mt-2 block">{s}</span>
            </li>
          ))}
        </ol>
        <p className="label mt-10 text-ivory/50">Concept site: this form doesn&rsquo;t send anything.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-sm bg-paper p-6 md:p-10" aria-labelledby={`${id}-title`}>
      <div className="flex items-center justify-between gap-6">
        <h2 id={`${id}-title`} className="display-s">
          {STEPS[step]}
        </h2>
        <p className="label text-faint tabular" aria-live="polite">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2" aria-hidden>
        {STEPS.map((s, i) => (
          <span key={s} className="h-px overflow-hidden bg-line-strong">
            <span className={clsx("block h-full origin-left bg-ink transition-transform duration-700 ease-[var(--ease-out-expo)]", i <= step ? "scale-x-100" : "scale-x-0")} />
          </span>
        ))}
      </div>

      {fromEstimate && step === 0 && (
        <p className="mt-6 rounded-sm border border-line-strong px-4 py-3 text-sm">
          From the estimator: <strong className="font-semibold">{params.get("project")}</strong> · {fromEstimate}
        </p>
      )}

      <div ref={panel} key={step} className="mt-8 grid gap-8">
        {step === 0 && (
          <>
            <fieldset aria-describedby={errors.type ? `${id}-type-err` : undefined}>
              <legend className="label mb-3 text-faint">What are we renovating?</legend>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t, i) => (
                  <label key={t} className="cursor-pointer">
                    <input id={i === 0 ? `${id}-type` : undefined} type="radio" name="type" value={t} checked={data.type === t} onChange={() => set("type")(t)} className="peer sr-only" />
                    <span className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze hover:border-ink">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
              {err("type")}
            </fieldset>
            <fieldset aria-describedby={errors.budget ? `${id}-budget-err` : undefined}>
              <legend className="label mb-3 text-faint">Budget range</legend>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b, i) => (
                  <label key={b} className="cursor-pointer">
                    <input id={i === 0 ? `${id}-budget` : undefined} type="radio" name="budget" value={b} checked={data.budget === b} onChange={() => set("budget")(b)} className="peer sr-only" />
                    <span className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze hover:border-ink">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
              {err("budget")}
            </fieldset>
            <div>
              <label htmlFor={`${id}-timing`} className="label text-faint">
                When would you like to start?
              </label>
              <select {...a11y("timing")} value={data.timing} onChange={(e) => set("timing")(e.target.value)} className="field mt-1 cursor-pointer">
                {TIMING.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label htmlFor={`${id}-area`} className="label text-faint">
                Neighborhood or ZIP code
              </label>
              <input {...a11y("area")} value={data.area} onChange={(e) => set("area")(e.target.value)} autoComplete="postal-code" placeholder="e.g. Highland Park or 75205" className="field" />
              {err("area")}
            </div>
            <div>
              <label htmlFor={`${id}-details`} className="label text-faint">
                Tell us about the house
              </label>
              <textarea
                {...a11y("details")}
                rows={5}
                value={data.details}
                onChange={(e) => set("details")(e.target.value)}
                placeholder="Year built, what you love, what drives you mad, and what you'd like to change."
                className="field resize-y"
              />
              {err("details")}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={`${id}-name`} className="label text-faint">
                  Full name
                </label>
                <input {...a11y("name")} value={data.name} onChange={(e) => set("name")(e.target.value)} autoComplete="name" className="field" />
                {err("name")}
              </div>
              <div>
                <label htmlFor={`${id}-email`} className="label text-faint">
                  Email
                </label>
                <input {...a11y("email")} type="email" value={data.email} onChange={(e) => set("email")(e.target.value)} autoComplete="email" className="field" />
                {err("email")}
              </div>
              <div>
                <label htmlFor={`${id}-phone`} className="label text-faint">
                  Phone
                </label>
                <input {...a11y("phone")} type="tel" value={data.phone} onChange={(e) => set("phone")(e.target.value)} autoComplete="tel" placeholder="(214) 555-0100" className="field" />
                {err("phone")}
              </div>
            </div>
            <fieldset>
              <legend className="label mb-3 text-faint">Best way to reach you</legend>
              <div className="flex gap-2">
                {["Phone", "Email", "Text"].map((c) => (
                  <label key={c} className="cursor-pointer">
                    <input type="radio" name="contact" value={c} checked={data.contact === c} onChange={() => set("contact")(c)} className="peer sr-only" />
                    <span className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze">
                      {c}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="label min-h-11 link-draw">
            ← Back
          </button>
        ) : (
          <a href={site.phoneHref} className="label min-h-11 content-center link-draw">
            Or call {site.phone}
          </a>
        )}
        <button type="submit" disabled={sending} className="btn btn-solid disabled:opacity-60">
          <span>{step < 2 ? "Continue" : sending ? "Sending…" : "Request my consultation"}</span>
          <Arrow />
        </button>
      </div>
    </form>
  );
}
