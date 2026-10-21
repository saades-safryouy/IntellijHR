import { motion } from "motion/react";
import { Database, Eye, Heart, Lock, Route, Timer, Zap } from "lucide-react";
import { Reveal, Section, SectionHeading, cx, useLanding } from "./LandingPrimitives";

const icons = [Database, Timer, Eye, Route, Lock, Zap, Heart];

export function BenefitsSection() {
  const { t } = useLanding();
  return (
    <Section id="why">
      <SectionHeading eyebrow={t.benefits.eyebrow} lines={[t.benefits.title]} desc={t.benefits.desc} highlightLast={false} />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.benefits.items.map((b, i) => {
          const Icon = icons[i];
          const featured = i === 0;
          return (
            <Reveal key={b.title} delay={(i % 4) * 0.06} className={cx(featured && "sm:col-span-2 lg:row-span-2")}>
              <motion.div
                whileHover={{ y: -4 }}
                className={cx(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl p-6",
                  featured ? "ihr-btn-primary" : "ihr-card",
                )}
              >
                {featured && <div className="pointer-events-none absolute inset-0 opacity-30 ihr-grid" aria-hidden />}
                <div className="relative flex items-start justify-between gap-3">
                  <span
                    className={cx(
                      "grid size-11 place-items-center rounded-2xl",
                      featured ? "bg-ihr-on-primary/15" : "bg-ihr-primary/10 text-ihr-primary",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                </div>
                <div className="relative mt-auto pt-8">
                  <h3 className={cx("font-bold tracking-tight", featured ? "text-2xl" : "text-base text-ihr-fg")}>{b.title}</h3>
                  <p className={cx("mt-1.5 text-sm", featured ? "opacity-85" : "text-ihr-muted")}>{b.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
