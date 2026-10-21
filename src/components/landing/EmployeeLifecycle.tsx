import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, CalendarHeart, Check, LogOut, Rocket, Search, TrendingUp } from "lucide-react";
import { Reveal, Section, SectionHeading, cx, useLanding } from "./LandingPrimitives";

const icons = [Search, Rocket, Briefcase, TrendingUp, CalendarHeart, LogOut];

export function EmployeeLifecycle() {
  const { t } = useLanding();
  const [active, setActive] = useState(1);
  const stages = t.lifecycle.stages;
  const pct = (active / (stages.length - 1)) * 100;

  return (
    <Section id="how-it-works">
      <SectionHeading eyebrow={t.lifecycle.eyebrow} lines={[t.lifecycle.title1, t.lifecycle.title2]} desc={t.lifecycle.desc} />
      <Reveal className="mt-16">
        <div className="relative">
          {/* Horizontal track (desktop) */}
          <div className="absolute inset-x-[8%] top-7 hidden h-0.5 rounded-full bg-ihr-border lg:block" aria-hidden>
            <motion.div
              className="h-full rounded-full ihr-btn-primary"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {/* Vertical track (mobile) */}
          <div className="absolute start-7 top-0 bottom-0 w-0.5 rounded-full bg-ihr-border lg:hidden" aria-hidden>
            <motion.div className="w-full rounded-full ihr-btn-primary" animate={{ height: `${pct}%` }} transition={{ duration: 0.6 }} />
          </div>

          <ol className="relative grid gap-5 lg:grid-cols-6 lg:gap-3">
            {stages.map((s, i) => {
              const Icon = icons[i];
              const done = i < active;
              const isActive = i === active;
              return (
                <li key={s.title} className="flex gap-4 lg:flex-col lg:items-center lg:text-center">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-pressed={isActive}
                    aria-label={`${t.lifecycle.step} ${i + 1}: ${s.title}`}
                    className={cx(
                      "relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border transition-all duration-300",
                      isActive
                        ? "scale-110 border-transparent ihr-btn-primary"
                        : done
                          ? "border-ihr-primary/40 bg-ihr-card text-ihr-primary"
                          : "border-ihr-border bg-ihr-card text-ihr-muted",
                    )}
                  >
                    {done ? <Check className="size-5" /> : <Icon className="size-5" />}
                  </button>
                  <div className="min-w-0 flex-1 pt-1 lg:pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-ihr-primary">
                      {t.lifecycle.step} {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className={cx("mt-1 text-base font-bold", isActive ? "text-ihr-fg" : "text-ihr-fg/80")}>{s.title}</h3>
                    <p className="mt-1 text-sm text-ihr-muted">{s.desc}</p>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-1.5 overflow-hidden rounded-2xl p-3 text-start ihr-card"
                        >
                          {s.points.map((p) => (
                            <li key={p} className="flex items-center gap-2 text-xs text-ihr-fg">
                              <Check className="size-3.5 shrink-0 text-ihr-success" />
                              {p}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>
    </Section>
  );
}
