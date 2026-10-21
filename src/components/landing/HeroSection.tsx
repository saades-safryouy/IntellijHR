import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BarChart3, Layers, Sparkles, Workflow } from "lucide-react";
import { HeroDashboardPreview } from "./HeroDashboardPreview";
import { scrollToId, useLanding } from "./LandingPrimitives";

export function HeroSection({ onGetStarted }: { onGetStarted?: () => void }) {
  const { t, isRtl } = useLanding();
  const reduce = useReducedMotion();
  const item = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  };
  const icons = [Layers, Workflow, BarChart3];

  return (
    <section id="home" className="relative scroll-mt-24 overflow-hidden px-4 pt-12 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 ihr-grid" aria-hidden />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 start-1/2 h-[480px] w-[min(900px,140vw)] -translate-x-1/2 rounded-full ihr-glow"
        animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-ihr-border bg-ihr-card px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ihr-primary"
          >
            <Sparkles className="size-3.5" />
            {t.hero.badge}
          </motion.span>
          <motion.h1
            variants={item}
            className="mt-6 text-5xl leading-[1.02] font-extrabold tracking-tight text-ihr-fg sm:text-6xl xl:text-7xl"
          >
            <span className="block">{t.hero.title1}</span>
            <span className="block pb-2 ihr-gradient-text">{t.hero.title2}</span>
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-pretty text-ihr-muted">
            {t.hero.subtitle}
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onGetStarted}
              className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition-transform hover:-translate-y-0.5 ihr-btn-primary"
            >
              {t.hero.primary}
              <ArrowRight className={`size-4 transition-transform group-hover:translate-x-0.5 ${isRtl ? "rotate-180" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => scrollToId("features")}
              className="inline-flex items-center justify-center rounded-full border border-ihr-border bg-ihr-card px-7 py-3.5 text-base font-semibold text-ihr-fg transition-colors hover:bg-ihr-card-2"
            >
              {t.hero.secondary}
            </button>
          </motion.div>
          <motion.ul variants={item} className="mt-10 grid gap-3 sm:grid-cols-3">
            {t.hero.benefits.map((b, i) => {
              const Icon = icons[i];
              return (
                <li key={b} className="flex items-center gap-2.5 text-sm font-medium text-ihr-fg">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-ihr-card-2 text-ihr-primary">
                    <Icon className="size-4" />
                  </span>
                  {b}
                </li>
              );
            })}
          </motion.ul>
        </motion.div>
        <HeroDashboardPreview />
      </div>
    </section>
  );
}
