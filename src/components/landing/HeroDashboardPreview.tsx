import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Bell, CheckCircle2, Clock, TrendingUp, UserPlus, Users } from "lucide-react";
import { deptColors, heroDepartments, heroGrowth } from "./landingData";
import { Counter, cx, useLanding } from "./LandingPrimitives";

export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name?: string; value?: number; color?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs ihr-glass">
      {label && <p className="mb-1 font-semibold text-ihr-fg">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-ihr-muted">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold text-ihr-fg tabular-nums">{p.value?.toLocaleString("en-US")}</span>
        </p>
      ))}
    </div>
  );
}

export function HeroDashboardPreview() {
  const { t } = useLanding();
  const reduce = useReducedMotion();
  const [activeDept, setActiveDept] = useState<number | null>(null);
  const float = (d: number) =>
    reduce ? undefined : { y: [0, -6, 0], transition: { duration: 6, delay: d, repeat: Infinity, ease: "easeInOut" as const } };

  const total = heroDepartments.reduce((a, b) => a + b.value, 0);
  const shown = activeDept === null ? null : heroDepartments[activeDept];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-xl"
      aria-label="IntelligenceHR dashboard preview"
    >
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] ihr-glow" aria-hidden />
      {/* Main panel */}
      <div className="rounded-3xl p-4 sm:p-5 ihr-glass">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-ihr-danger/70" />
            <span className="size-2.5 rounded-full bg-ihr-warning/70" />
            <span className="size-2.5 rounded-full bg-ihr-success/70" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ihr-success/15 px-2.5 py-1 text-[11px] font-semibold text-ihr-success">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-ihr-success" />
              <span className="relative size-1.5 rounded-full bg-ihr-success" />
            </span>
            {t.hero.live}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
          <motion.div animate={float(0)} className="rounded-2xl p-4 ihr-card">
            <div className="flex items-center gap-2 text-xs font-medium text-ihr-muted">
              <Users className="size-4 text-ihr-primary" />
              {t.hero.totalEmployees}
            </div>
            <div className="mt-2 flex items-end gap-2">
              <Counter value={1248} className="text-3xl font-extrabold tracking-tight text-ihr-fg" />
              <span className="mb-1 inline-flex items-center gap-0.5 rounded-full bg-ihr-success/15 px-1.5 py-0.5 text-[11px] font-bold text-ihr-success">
                <TrendingUp className="size-3" />
                +8.4%
              </span>
            </div>
            <p className="text-[11px] text-ihr-muted">{t.hero.vsLastQuarter}</p>
            <div className="mt-3 h-24" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={heroGrowth} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ihr-hero-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--ihr-primary)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--ihr-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" hide />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--ihr-border)" }} />
                  <Area
                    type="monotone"
                    dataKey="v"
                    name={t.hero.workforceGrowth}
                    stroke="var(--ihr-primary)"
                    strokeWidth={2.5}
                    fill="url(#ihr-hero-area)"
                    activeDot={{ r: 5, fill: "var(--ihr-primary)", stroke: "var(--ihr-card)", strokeWidth: 3 }}
                    animationDuration={1400}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div animate={float(1.2)} className="rounded-2xl p-4 ihr-card">
            <p className="text-xs font-medium text-ihr-muted">{t.hero.departments}</p>
            <div className="relative mx-auto mt-1 h-32 w-32" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={heroDepartments}
                    dataKey="value"
                    innerRadius={38}
                    outerRadius={56}
                    paddingAngle={3}
                    stroke="none"
                    onMouseEnter={(_, i) => setActiveDept(i)}
                    onMouseLeave={() => setActiveDept(null)}
                    animationDuration={1200}
                  >
                    {heroDepartments.map((d, i) => (
                      <Cell key={d.key} fill={deptColors[d.key]} opacity={activeDept === null || activeDept === i ? 1 : 0.35} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-lg font-extrabold text-ihr-fg tabular-nums">{shown ? shown.value : total}</p>
                  <p className="max-w-16 truncate text-[10px] text-ihr-muted">{shown ? t.depts[shown.key] : t.analytics.total}</p>
                </div>
              </div>
            </div>
            <ul className="mt-2 space-y-1">
              {heroDepartments.slice(0, 3).map((d) => (
                <li key={d.key} className="flex items-center justify-between gap-2 text-[11px] text-ihr-muted">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: deptColors[d.key] }} />
                    <span className="truncate">{t.depts[d.key]}</span>
                  </span>
                  <span className="font-semibold text-ihr-fg tabular-nums">{Math.round((d.value / total) * 100)}%</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1.2fr]">
          <motion.div animate={float(0.6)} className="rounded-2xl p-4 ihr-card">
            <div className="flex items-center justify-between text-xs font-medium text-ihr-muted">
              <span className="flex items-center gap-2">
                <UserPlus className="size-4 text-ihr-violet" />
                {t.hero.onboarding}
              </span>
              <span className="font-bold text-ihr-fg">72%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ihr-card-2">
              <motion.div
                className="h-full rounded-full ihr-btn-primary"
                initial={{ width: reduce ? "72%" : 0 }}
                animate={{ width: "72%" }}
                transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="mt-2 text-[11px] text-ihr-muted">18 / 25 {t.hero.onboardingOf}</p>
            <div className="mt-3 flex -space-x-2 rtl:space-x-reverse" aria-hidden>
              {["LB", "KH", "CD", "SM"].map((n, i) => (
                <span
                  key={n}
                  className="grid size-7 place-items-center rounded-full border-2 border-ihr-card text-[10px] font-bold text-ihr-on-primary"
                  style={{ background: Object.values(deptColors)[i] }}
                >
                  {n}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div animate={float(1.8)} className="rounded-2xl p-4 ihr-card">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-ihr-muted">
              <Bell className="size-4 text-ihr-warning" />
              {t.portal.notifications}
            </div>
            <ul className="space-y-2">
              {t.hero.activity.map((a, i) => (
                <motion.li
                  key={a}
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.25 }}
                  className="flex items-center gap-2 rounded-xl bg-ihr-card-2 px-2.5 py-2"
                >
                  {i === 2 ? (
                    <Clock className="size-4 shrink-0 text-ihr-warning" />
                  ) : (
                    <CheckCircle2 className="size-4 shrink-0 text-ihr-success" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-[11px] text-ihr-fg">{a}</span>
                  <span
                    className={cx(
                      "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                      i === 2 ? "bg-ihr-warning/15 text-ihr-warning" : "bg-ihr-success/15 text-ihr-success",
                    )}
                  >
                    {i === 2 ? t.hero.statusPending : t.hero.statusApproved}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
