import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import type { LandingDictionary, LandingLanguage } from "./landingTranslations";

interface LandingCtx {
  t: LandingDictionary;
  lang: LandingLanguage;
  isRtl: boolean;
}

const LandingContext = createContext<LandingCtx | null>(null);

export function LandingProvider({ value, children }: { value: LandingCtx; children: ReactNode }) {
  return <LandingContext.Provider value={value}>{children}</LandingContext.Provider>;
}

export function useLanding() {
  const ctx = useContext(LandingContext);
  if (!ctx) throw new Error("useLanding must be used inside <LandingPage>");
  return ctx;
}

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ihr-border bg-ihr-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ihr-primary">
      <span className="size-1.5 rounded-full bg-ihr-primary" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  lines,
  desc,
  highlightLast = true,
}: {
  eyebrow: string;
  lines: string[];
  desc?: string;
  highlightLast?: boolean;
}) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-balance text-ihr-fg sm:text-4xl lg:text-5xl">
        {lines.map((l, i) => (
          <span key={i} className={cx("block", highlightLast && i === lines.length - 1 && lines.length > 1 && "ihr-gradient-text")}>
            {l}
          </span>
        ))}
      </h2>
      {desc && <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-ihr-muted sm:text-lg">{desc}</p>}
    </Reveal>
  );
}

export function Counter({ value, className, suffix = "" }: { value: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, inView, reduce]);

  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function Section({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cx("relative scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cx("grid size-9 place-items-center rounded-xl ihr-btn-primary", className)} aria-hidden>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="12" cy="6" r="2.5" />
        <circle cx="5.5" cy="17" r="2.5" />
        <circle cx="18.5" cy="17" r="2.5" />
        <path d="M12 8.5v3.5M12 12l-5 3M12 12l5 3" />
      </svg>
    </span>
  );
}
