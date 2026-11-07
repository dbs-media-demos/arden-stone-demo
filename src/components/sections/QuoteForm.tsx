"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Arrow } from "@/components/ui/Button";
import { useBiz } from "@/components/preview/BizContext";
import { L } from "@/lib/biz-core";

const TYPES: [string, string][] = [
  ["Whole home", "Cela kuća"],
  ["Kitchen", "Kuhinja"],
  ["Primary bath", "Kupatilo"],
  ["Addition", "Dogradnja"],
  ["Outdoor living", "Spoljni prostor"],
  ["Interiors", "Enterijer"],
  ["Historic restoration", "Obnova stare kuće"],
  ["Not sure yet", "Još ne znam"],
];

/** Fired by PreviewGuard when a preview's "/contact?project=…" link lands on this form instead. */
export const QUOTE_PREFILL = "as-quote-prefill";

/** The short form that closes the phone homepage. Concept site: it validates and confirms, nothing is sent. */
export function QuoteForm() {
  const biz = useBiz();
  const id = useId();
  const [d, setD] = useState({ name: "", phone: "", project: "", details: "" });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefill = (e: Event) => {
      const q = new URLSearchParams((e as CustomEvent<string>).detail);
      const project = q.get("project");
      if (!project) return;
      const type = TYPES.find(([en]) => en.toLowerCase() === project.toLowerCase());
      setD((c) => ({
        ...c,
        project: type ? L(biz, type[0], type[1]) : c.project,
        details: `From the estimator: ${project}, about ${q.get("size")} sq ft, ${q.get("finish")} finish, estimated ${q.get("range")}.`,
      }));
    };
    window.addEventListener(QUOTE_PREFILL, prefill);
    return () => window.removeEventListener(QUOTE_PREFILL, prefill);
  }, [biz]);

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e: typeof errors = {};
    if (d.name.trim().length < 2) e.name = L(biz, "Please enter your name.", "Unesite ime.");
    if (d.phone.replace(/\D/g, "").length < 6) e.phone = L(biz, "Please enter a phone number we can call.", "Unesite broj telefona na koji možemo da vas pozovemo.");
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) return document.getElementById(`${id}-${first}`)?.focus();
    setDone(true);
  };

  if (done) {
    return (
      <div className="mt-5 rounded-sm bg-ink p-6 text-ivory" role="status">
        <svg viewBox="0 0 52 52" className="h-11 w-11 text-bronze-light" aria-hidden>
          <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M15 27l7 7 15-16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="40" strokeDashoffset="0" className="[animation:draw-check_1s_var(--ease-out-expo)_both]" />
        </svg>
        <p className="display-m mt-4">
          {L(biz, "Thank you", "Hvala")}, {d.name.trim().split(" ")[0]}.
        </p>
        <p className="mt-2 text-[0.9375rem] leading-[1.45] text-ivory/75">{L(biz, "We call you within one working day to arrange a free home visit.", "Pozvaćemo vas u roku od jednog radnog dana da dogovorimo besplatnu posetu.")}</p>
        <p className="label mt-4 text-ivory/50">{biz.preview ? L(biz, "Preview: this form doesn’t send anything.", "Pregled: ovaj obrazac ništa ne šalje.") : "Concept site: this form doesn’t send anything."}</p>
      </div>
    );
  }

  const err = (k: "name" | "phone") =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} role="alert" className="mt-1.5 text-sm text-[#a2341f]">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: "name" | "phone") => ({ id: `${id}-${k}`, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined });

  return (
    <form noValidate onSubmit={submit} className="mt-3 grid gap-2.5">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="min-w-0">
          <label htmlFor={`${id}-name`} className="label text-faint">
            {L(biz, "Name", "Ime")}
          </label>
          <input {...a11y("name")} value={d.name} onChange={(e) => setD((c) => ({ ...c, name: e.target.value }))} autoComplete="name" className="field" />
          {err("name")}
        </div>
        <div className="min-w-0">
          <label htmlFor={`${id}-phone`} className="label text-faint">
            {L(biz, "Phone", "Telefon")}
          </label>
          <input {...a11y("phone")} type="tel" value={d.phone} onChange={(e) => setD((c) => ({ ...c, phone: e.target.value }))} autoComplete="tel" className="field" />
          {err("phone")}
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-project`} className="label text-faint">
          {L(biz, "Project", "Projekat")}
        </label>
        <select id={`${id}-project`} value={d.project} onChange={(e) => setD((c) => ({ ...c, project: e.target.value }))} className="field cursor-pointer">
          <option value="">{L(biz, "Choose one", "Izaberite")}</option>
          {TYPES.map(([en, sr]) => (
            <option key={en}>{L(biz, en, sr)}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-details`} className="label text-faint">
          {L(biz, "Tell us about the house", "Recite nam nešto o kući")}
        </label>
        <textarea id={`${id}-details`} rows={2} value={d.details} onChange={(e) => setD((c) => ({ ...c, details: e.target.value }))} className="field resize-y" />
      </div>
      <button type="submit" className="btn btn-solid w-full">
        <span>{L(biz, "Get a quote", "Zatražite ponudu")}</span>
        <Arrow />
      </button>
      <p className="text-sm text-muted">{L(biz, "The first visit is free and takes about ninety minutes.", "Prva poseta je besplatna i traje oko devedeset minuta.")}</p>
    </form>
  );
}
