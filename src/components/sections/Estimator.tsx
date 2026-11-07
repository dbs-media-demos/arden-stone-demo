"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { estimate, EXTRAS, FINISHES, ROOMS } from "@/data/estimator";
import { commas } from "@/lib/biz-core";
import { prefersReducedMotion } from "@/lib/motion";
import { Arrow } from "@/components/ui/Button";

const money = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2).replace(/0$/, "")}M` : `$${Math.round(n / 1000)}k`);

/** Animated number that tweens between values. */
function Tween({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const cur = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = format(value);
      cur.current = value;
      return;
    }
    // expo.out over 0.9 s, on the frame clock (this tool must not pull GSAP onto phones)
    const from = cur.current;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      const v = from + (value - from) * (p === 1 ? 1 : 1 - 2 ** (-10 * p));
      el.textContent = format(v);
      cur.current = v;
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, format]);
  return <span ref={ref}>{format(value)}</span>;
}

/** Project cost estimator: room type, size and finish level give an animated range. */
export function Estimator({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [room, setRoom] = useState(ROOMS[0].id);
  const r = ROOMS.find((x) => x.id === room)!;
  const [size, setSize] = useState(r.default);
  const [finish, setFinish] = useState<string>("refined");
  const [extras, setExtras] = useState<string[]>([]);

  const result = useMemo(() => estimate(room, size, finish, extras), [room, size, finish, extras]);
  // Position of the range on a log-ish scale, for the bar.
  const scaleMax = r.rate * r.max * 1.85 * 1.35 * 1.16;
  const lowPct = Math.max(2, (result.low / scaleMax) * 100);
  const highPct = Math.min(100, (result.high / scaleMax) * 100);

  const pickRoom = (idNext: string) => {
    setRoom(idNext);
    setSize(ROOMS.find((x) => x.id === idNext)!.default);
  };

  const query = new URLSearchParams({ project: r.label, size: String(size), finish, range: `${money(result.low)}–${money(result.high)}` }).toString();

  return (
    <div className="grid grid-cols-1 gap-10 phone:gap-3 lg:grid-cols-12 lg:gap-16">
      <div className="grid min-w-0 gap-9 phone:gap-3.5 lg:col-span-7">
        <fieldset>
          <legend className="label mb-4 text-faint phone:mb-2">01 · What are we renovating?</legend>
          <div className="flex flex-wrap gap-2 phone:gap-1.5">
            {ROOMS.map((x) => (
              <label key={x.id} className="cursor-pointer">
                <input type="radio" name={`${id}-room`} value={x.id} checked={room === x.id} onChange={() => pickRoom(x.id)} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm transition-colors duration-300 phone:min-h-10 phone:px-3.5 peer-checked:border-fg peer-checked:bg-fg peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze hover:border-fg">
                  {x.label}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-3 min-h-[2.5em] text-sm text-muted phone:mt-2">{r.note}</p>
        </fieldset>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor={`${id}-size`} className="label text-faint">
              02 · Approximate size
            </label>
            <output htmlFor={`${id}-size`} className="font-display text-3xl tabular">
              {commas(size)} <span className="text-lg text-muted">sq ft</span>
            </output>
          </div>
          <input
            id={`${id}-size`}
            type="range"
            className="range mt-2 phone:mt-0"
            min={r.min}
            max={r.max}
            step={r.step}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
          <div className="label flex justify-between text-faint tabular">
            <span>{commas(r.min)}</span>
            <span>{commas(r.max)}</span>
          </div>
        </div>

        <fieldset>
          <legend className="label mb-4 text-faint phone:mb-2">03 · Finish level</legend>
          <div className="grid gap-2 phone:gap-1.5 sm:grid-cols-3 phone:grid-cols-3">
            {FINISHES.map((f) => (
              <label key={f.id} className="cursor-pointer">
                <input type="radio" name={`${id}-finish`} value={f.id} checked={finish === f.id} onChange={() => setFinish(f.id)} className="peer sr-only" />
                <span className="block h-full rounded-sm border border-line-strong p-4 transition-colors duration-300 phone:px-2 phone:py-2 phone:text-center peer-checked:border-fg peer-checked:bg-surface peer-focus-visible:outline-2 peer-focus-visible:outline-bronze hover:border-fg">
                  <span className="font-display text-2xl phone:text-xl phone:leading-tight">{f.label}</span>
                  <span className="mt-1 block text-sm text-muted phone:hidden">{f.text}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 hidden min-h-[2.5em] text-sm text-muted phone:block">{FINISHES.find((f) => f.id === finish)?.text}</p>
        </fieldset>

        {!compact && (
          <fieldset>
            <legend className="label mb-4 text-faint phone:mb-2">04 · Anything else?</legend>
            <div className="grid gap-2">
              {EXTRAS.map((x) => (
                <label key={x.id} className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={extras.includes(x.id)}
                    onChange={(e) => setExtras((cur) => (e.target.checked ? [...cur, x.id] : cur.filter((c) => c !== x.id)))}
                    className="h-4 w-4 accent-[var(--bronze)]"
                  />
                  <span>{x.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <div className="min-w-0 lg:col-span-5">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)] rounded-sm bg-ink p-7 text-ivory phone:static phone:p-5 md:p-10" aria-live="polite">
          <p className="label text-ivory/60">Estimated investment · {r.label}</p>
          <p className="mt-4 flex flex-wrap items-baseline font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tabular phone:mt-2">
            <Tween value={result.low} format={money} />
            <span className="mx-2 text-bronze-light">–</span>
            <Tween value={result.high} format={money} />
          </p>
          <div className="relative mt-8 h-px bg-ivory/15 phone:mt-4">
            <div
              className="absolute -top-[3px] h-[7px] bg-bronze-light transition-all duration-700 ease-[var(--ease-out-expo)]"
              style={{ left: `${lowPct}%`, width: `${Math.max(3, highPct - lowPct)}%` }}
            />
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ivory/15 pt-6 phone:mt-4 phone:pt-3">
            <div>
              <dt className="label text-ivory/60">On site</dt>
              <dd className="mt-1 font-display text-2xl tabular phone:text-xl">
                {result.weeks[0]}–{result.weeks[1]} weeks
              </dd>
            </div>
            <div>
              <dt className="label text-ivory/60">Design phase</dt>
              <dd className="mt-1 font-display text-2xl phone:text-xl">6–10 weeks</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-ivory/65 phone:mt-3 phone:text-[0.8125rem] phone:leading-snug">
            A guide for Dallas homes in 2026, including design, permits and our fee. Your fixed price comes after the design phase.
          </p>
          <Link href={`/contact?${query}`} className="btn btn-solid mt-8 w-full phone:mt-4 phone:px-3 phone:text-[0.6875rem] phone:tracking-[0.08em]">
            <span>Book a consultation with this</span>
            <Arrow />
          </Link>
        </div>
      </div>
    </div>
  );
}
