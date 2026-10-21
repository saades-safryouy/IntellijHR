import type { ReactNode } from "react";
import { motion } from "motion/react";
import { BarChart3, CalendarDays, GitBranch, KeyRound, Network, ShieldCheck, UserRoundPlus, Users } from "lucide-react";
import { Reveal, cx, useLanding } from "./LandingPrimitives";

const icons = [Users, CalendarDays, UserRoundPlus, GitBranch, ShieldCheck, Network, KeyRound, BarChart3];
const spans = [
  "md:col-span-2 lg:col-span-2 lg:row-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "md:col-span-2 lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "md:col-span-2 lg:col-span-1",
];

function PeopleArt() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-hidden>
      {["Leila B.", "Karim H.", "Inès M.", "Omar T.", "Nora F.", "Hugo L."].map((n, i) => (
        <div key={n} className="flex items-center gap-2 rounded-xl bg-ihr-card-2 p-2">
          <span
            className="grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-ihr-on-primary"
            style={{ background: ["var(--ihr-primary)", "var(--ihr-cyan)", "var(--ihr-violet)"][i % 3] }}
          >
            {n[0]}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-ihr-fg">{n}</span>
            <span className="block h-1.5 w-10 rounded-full bg-ihr-border" />
          </span>
        </div>
      ))}
    </div>
  );
}
function LeaveArt() {
  return (
    <div className="mt-5 grid grid-cols-7 gap-1" aria-hidden>
      {Array.from({ length: 21 }).map((_, i) => (
        <span
          key={i}
          className={cx(
            "aspect-square rounded-md",
            [3, 4, 5].includes(i) ? "bg-ihr-primary" : [11, 17].includes(i) ? "bg-ihr-warning/70" : "bg-ihr-card-2",
          )}
        />
      ))}
    </div>
  );
}
function JourneyArt() {
  return (
    <div className="mt-5 flex items-center gap-1.5" aria-hidden>
      {[1, 1, 1, 0, 0].map((d, i) => (
        <div key={i} className="flex flex-1 items-center gap-1.5">
          <span className={cx("size-3 shrink-0 rounded-full", d ? "bg-ihr-success" : "border-2 border-ihr-border")} />
          {i < 4 && <span className={cx("h-0.5 flex-1 rounded-full", d ? "bg-ihr-success" : "bg-ihr-border")} />}
        </div>
      ))}
    </div>
  );
}
function FlowArt() {
  return (
    <svg viewBox="0 0 320 70" className="mt-5 h-16 w-full" aria-hidden>
      <path d="M30 35 H120 M120 35 C150 35 150 15 180 15 M120 35 C150 35 150 55 180 55 M200 15 C230 15 230 35 260 35 M200 55 C230 55 230 35 260 35" stroke="var(--ihr-border)" strokeWidth="2" fill="none" />
      <motion.path
        d="M30 35 H120 C150 35 150 15 180 15 H200 C230 15 230 35 260 35 H290"
        stroke="var(--ihr-primary)"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      {[30, 120, 190, 260].map((x, i) => (
        <circle key={i} cx={x} cy={i === 2 ? 15 : 35} r="6" fill="var(--ihr-card)" stroke="var(--ihr-primary)" strokeWidth="2.5" />
      ))}
      <circle cx="190" cy="55" r="6" fill="var(--ihr-card)" stroke="var(--ihr-cyan)" strokeWidth="2.5" />
    </svg>
  );
}
function ValidationArt() {
  return (
    <div className="mt-5 space-y-1.5" aria-hidden>
      {[1, 1, 0].map((ok, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg bg-ihr-card-2 px-2 py-1.5">
          <span className={cx("size-2 rounded-full", ok ? "bg-ihr-success" : "bg-ihr-warning")} />
          <span className="h-1.5 flex-1 rounded-full bg-ihr-border" />
        </div>
      ))}
    </div>
  );
}
function OrgArt() {
  return (
    <svg viewBox="0 0 160 70" className="mt-5 h-16 w-full" aria-hidden>
      <path d="M80 16 V32 M30 32 H130 M30 32 V48 M80 32 V48 M130 32 V48" stroke="var(--ihr-border)" strokeWidth="2" fill="none" />
      <rect x="66" y="4" width="28" height="14" rx="4" fill="var(--ihr-primary)" />
      {[16, 66, 116].map((x) => (
        <rect key={x} x={x} y="48" width="28" height="14" rx="4" fill="var(--ihr-card-2)" stroke="var(--ihr-border)" />
      ))}
    </svg>
  );
}
function RolesArt() {
  return (
    <div className="mt-5 flex flex-wrap gap-1.5" aria-hidden>
      {["Admin", "HR", "Manager", "Employee"].map((r, i) => (
        <span key={r} className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold", i === 0 ? "ihr-btn-primary" : "bg-ihr-card-2 text-ihr-muted")}>
          {r}
        </span>
      ))}
    </div>
  );
}
function AnalyticsArt() {
  return (
    <div className="mt-5 flex h-16 items-end gap-1.5" aria-hidden>
      {[40, 65, 50, 80, 60, 95].map((h, i) => (
        <motion.span
          key={i}
          className="flex-1 rounded-t-md bg-ihr-primary"
          style={{ opacity: 0.4 + i * 0.1 }}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.07 }}
        />
      ))}
    </div>
  );
}

const arts: ReactNode[] = [<PeopleArt />, <LeaveArt />, <JourneyArt />, <FlowArt />, <ValidationArt />, <OrgArt />, <RolesArt />, <AnalyticsArt />];

export function FeaturesBento() {
  const { t } = useLanding();
  return (
    <div id="modules" className="mt-16 grid scroll-mt-24 auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-4">
      {t.overview.features.map((f, i) => {
        const Icon = icons[i];
        return (
          <Reveal key={f.title} delay={(i % 4) * 0.06} className={spans[i]}>
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 ihr-card"
            >
              <div className="pointer-events-none absolute -end-16 -top-16 size-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 ihr-glow" />
              <span className="grid size-11 place-items-center rounded-2xl bg-ihr-primary/10 text-ihr-primary">
                <Icon className="size-5" />
              </span>
              <h3 className={cx("mt-5 font-bold tracking-tight text-ihr-fg", i === 0 ? "text-2xl" : "text-lg")}>{f.title}</h3>
              <p className="mt-2 text-sm text-ihr-muted">{f.desc}</p>
              <div className="mt-auto">{arts[i]}</div>
            </motion.article>
          </Reveal>
        );
      })}
    </div>
  );
}
