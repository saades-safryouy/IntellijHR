import { useEffect, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Bell, CheckCircle2, Clock, FileText, Gavel, RotateCcw, ShieldCheck, UserCheck } from "lucide-react";
import { Reveal, Section, SectionHeading, cx, useLanding } from "./LandingPrimitives";

const nodeIcons = [FileText, UserCheck, ShieldCheck, Gavel];

export function EFlowShowcase() {
  const { t } = useLanding();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [step, setStep] = useState(reduce ? 4 : 0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    setStep(0);
    const timers = [1, 2, 3, 4].map((s) => setTimeout(() => setStep(s), s * 1100));
    return () => timers.forEach(clearTimeout);
  }, [inView, run, reduce]);

  const status = (i: number) => (i < step ? "approved" : i === step ? "review" : "waiting");

  return (
    <Section id="eflow" className="bg-ihr-bg-soft">
      <SectionHeading eyebrow={t.eflow.eyebrow} lines={[t.eflow.title1, t.eflow.title2]} desc={t.eflow.desc} />
      <div ref={ref} className="mt-16 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="h-full rounded-3xl p-5 sm:p-7 ihr-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-ihr-fg">{t.eflow.requestTitle}</p>
                <p className="text-xs text-ihr-muted">{t.eflow.requestMeta}</p>
              </div>
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-ihr-border px-3 py-1.5 text-xs font-semibold text-ihr-fg hover:bg-ihr-card-2"
              >
                <RotateCcw className="size-3.5" />
                {t.eflow.replay}
              </button>
            </div>

            <ol className="mt-8 space-y-0">
              {t.eflow.nodes.map((n, i) => {
                const Icon = nodeIcons[i];
                const st = status(i);
                return (
                  <li key={n.title} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < 3 && (
                      <span className="absolute start-6 top-12 bottom-0 w-0.5 -translate-x-1/2 bg-ihr-border rtl:translate-x-1/2" aria-hidden>
                        <motion.span
                          className="block w-full bg-ihr-primary"
                          animate={{ height: i < step ? "100%" : "0%" }}
                          transition={{ duration: 0.8 }}
                        />
                      </span>
                    )}
                    <span
                      className={cx(
                        "relative grid size-12 shrink-0 place-items-center rounded-2xl border transition-colors duration-500",
                        st === "approved" && "border-transparent ihr-btn-primary",
                        st === "review" && "border-ihr-primary bg-ihr-primary/10 text-ihr-primary",
                        st === "waiting" && "border-ihr-border bg-ihr-card-2 text-ihr-muted",
                      )}
                    >
                      {st === "review" && !reduce && (
                        <span className="absolute inset-0 animate-ping rounded-2xl border border-ihr-primary/50" aria-hidden />
                      )}
                      <Icon className="size-5" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2 pt-1">
                      <div className="min-w-0">
                        <p className="font-semibold text-ihr-fg">{n.title}</p>
                        <p className="text-sm text-ihr-muted">{n.desc}</p>
                        {i === 2 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {t.eflow.parallelItems.map((p, j) => (
                              <span
                                key={p}
                                className={cx(
                                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                                  step > 2 || (step === 2 && j === 0)
                                    ? "bg-ihr-success/15 text-ihr-success"
                                    : "bg-ihr-card-2 text-ihr-muted",
                                )}
                              >
                                {step > 2 || (step === 2 && j === 0) ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span
                        className={cx(
                          "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold",
                          st === "approved" && "bg-ihr-success/15 text-ihr-success",
                          st === "review" && "bg-ihr-primary/15 text-ihr-primary",
                          st === "waiting" && "bg-ihr-card-2 text-ihr-muted",
                        )}
                      >
                        {st === "approved" ? t.eflow.approved : st === "review" ? t.eflow.inReview : t.eflow.waiting}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>

        <div className="flex flex-col gap-5">
          <Reveal delay={0.1}>
            <div className="rounded-3xl p-5 ihr-card">
              <p className="text-sm font-semibold text-ihr-fg">{t.eflow.tracking}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[t.eflow.sequential, t.eflow.parallel].map((m, i) => (
                  <div key={m} className="rounded-2xl bg-ihr-card-2 p-3">
                    <svg viewBox="0 0 100 36" className="h-9 w-full" aria-hidden>
                      {i === 0 ? (
                        <>
                          <path d="M10 18 H90" stroke="var(--ihr-primary)" strokeWidth="2" />
                          {[10, 50, 90].map((x) => (
                            <circle key={x} cx={x} cy="18" r="6" fill="var(--ihr-card)" stroke="var(--ihr-primary)" strokeWidth="2" />
                          ))}
                        </>
                      ) : (
                        <>
                          <path d="M10 18 C30 18 30 6 50 6 M10 18 C30 18 30 30 50 30 M50 6 C70 6 70 18 90 18 M50 30 C70 30 70 18 90 18" stroke="var(--ihr-cyan)" strokeWidth="2" fill="none" />
                          {[[10, 18], [50, 6], [50, 30], [90, 18]].map(([x, y]) => (
                            <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill="var(--ihr-card)" stroke="var(--ihr-cyan)" strokeWidth="2" />
                          ))}
                        </>
                      )}
                    </svg>
                    <p className="mt-2 text-center text-xs font-semibold text-ihr-fg">{m}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-ihr-muted">
                  <span>{step}/4</span>
                  <span>{step * 25}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ihr-card-2">
                  <motion.div className="h-full rounded-full ihr-btn-primary" animate={{ width: `${step * 25}%` }} transition={{ duration: 0.6 }} />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="flex-1">
            <div className="h-full rounded-3xl p-5 ihr-card">
              <p className="text-sm font-semibold text-ihr-fg">{t.eflow.history}</p>
              <ul className="mt-4 space-y-3">
                {t.eflow.historyItems.map((h, i) => (
                  <li key={h} className={cx("flex items-center gap-3 text-sm transition-opacity duration-500", i < step ? "opacity-100" : "opacity-35")}>
                    <CheckCircle2 className={cx("size-4 shrink-0", i < step ? "text-ihr-success" : "text-ihr-muted")} />
                    <span className="min-w-0 flex-1 truncate text-ihr-fg">{h}</span>
                    <span className="shrink-0 text-xs text-ihr-muted tabular-nums">09:{String(12 + i * 7).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
              <AnimatePresence>
                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 flex items-center gap-3 rounded-2xl bg-ihr-success/10 p-3"
                  >
                    <Bell className="size-4 shrink-0 text-ihr-success" />
                    <span className="text-xs font-medium text-ihr-fg">{t.eflow.notification}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
