import { useState } from "react";
import { motion } from "motion/react";
import { Bell, CalendarDays, Check, ClipboardList, Plus, Sun, UserCircle2 } from "lucide-react";
import { Reveal, Section, SectionHeading, cx, useLanding } from "./LandingPrimitives";

function Ring({ value, color, size = 64 }: { value: number; color: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="-rotate-90" aria-hidden>
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--ihr-card-2)" strokeWidth="12" />
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: value }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

export function EmployeePortalPreview() {
  const { t } = useLanding();
  const [tasks, setTasks] = useState([true, true, false, false]);
  const done = tasks.filter(Boolean).length;
  const dates = ["06 Nov", "18 Nov", "01 Jan"];

  return (
    <Section id="self-service" className="bg-ihr-bg-soft">
      <SectionHeading eyebrow={t.portal.eyebrow} lines={[t.portal.title]} desc={t.portal.desc} highlightLast={false} />
      <Reveal className="mt-14">
        <div className="rounded-[2rem] p-3 sm:p-5 ihr-glass">
          <div className="flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between ihr-card">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full text-sm font-bold ihr-btn-primary">SM</span>
              <div>
                <p className="flex items-center gap-2 text-lg font-bold text-ihr-fg">
                  {t.portal.hello} <Sun className="size-4 text-ihr-warning" />
                </p>
                <p className="text-sm text-ihr-muted">{t.portal.welcome}</p>
              </div>
            </div>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ihr-btn-primary">
              <Plus className="size-4" />
              {t.portal.newRequest}
            </button>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl p-5 ihr-card">
              <p className="flex items-center gap-2 text-sm font-semibold text-ihr-fg">
                <CalendarDays className="size-4 text-ihr-primary" />
                {t.portal.leaveBalance}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { l: t.portal.annual, v: 18, max: 26, c: "var(--ihr-primary)" },
                  { l: t.portal.sick, v: 7, max: 10, c: "var(--ihr-cyan)" },
                ].map((b) => (
                  <div key={b.l} className="flex flex-col items-center rounded-2xl bg-ihr-card-2 p-3">
                    <div className="relative">
                      <Ring value={b.v / b.max} color={b.c} size={72} />
                      <span className="absolute inset-0 grid place-items-center text-lg font-extrabold text-ihr-fg">{b.v}</span>
                    </div>
                    <p className="mt-2 text-xs text-ihr-muted">
                      {b.l} · {t.portal.days}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-5 ihr-card">
              <p className="flex items-center gap-2 text-sm font-semibold text-ihr-fg">
                <ClipboardList className="size-4 text-ihr-violet" />
                {t.portal.requests}
              </p>
              <ul className="mt-4 space-y-2">
                {t.portal.requestItems.map((r, i) => (
                  <li key={r} className="flex items-center justify-between gap-2 rounded-xl bg-ihr-card-2 px-3 py-2.5">
                    <span className="min-w-0 truncate text-sm text-ihr-fg">{r}</span>
                    <span
                      className={cx(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
                        i === 1 ? "bg-ihr-warning/15 text-ihr-warning" : "bg-ihr-success/15 text-ihr-success",
                      )}
                    >
                      {i === 1 ? t.portal.pending : t.portal.approved}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl p-5 ihr-card md:col-span-2 lg:col-span-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-ihr-fg">
                <UserCircle2 className="size-4 text-ihr-success" />
                {t.portal.profile}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative">
                  <Ring value={0.86} color="var(--ihr-success)" size={84} />
                  <span className="absolute inset-0 grid place-items-center text-lg font-extrabold text-ihr-fg">86%</span>
                </div>
                <p className="text-sm text-ihr-muted">{t.portal.profileHint}</p>
              </div>
            </div>

            <div className="rounded-3xl p-5 ihr-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ihr-fg">{t.portal.tasks}</p>
                <span className="text-xs font-bold text-ihr-primary">
                  {done}/{tasks.length}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ihr-card-2">
                <motion.div className="h-full rounded-full ihr-btn-primary" animate={{ width: `${(done / tasks.length) * 100}%` }} />
              </div>
              <ul className="mt-4 space-y-2">
                {t.portal.taskItems.map((task, i) => (
                  <li key={task}>
                    <button
                      type="button"
                      aria-pressed={tasks[i]}
                      onClick={() => setTasks((ts) => ts.map((v, j) => (j === i ? !v : v)))}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-start hover:bg-ihr-card-2"
                    >
                      <span
                        className={cx(
                          "grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                          tasks[i] ? "border-transparent ihr-btn-primary" : "border-ihr-border",
                        )}
                      >
                        {tasks[i] && <Check className="size-3.5" />}
                      </span>
                      <span className={cx("text-sm", tasks[i] ? "text-ihr-muted line-through" : "text-ihr-fg")}>{task}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl p-5 ihr-card">
              <p className="text-sm font-semibold text-ihr-fg">{t.portal.holidays}</p>
              <ul className="mt-4 space-y-2">
                {t.portal.holidayItems.map((h, i) => (
                  <li key={h} className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ihr-primary/10 text-center text-[10px] leading-tight font-bold text-ihr-primary">
                      {dates[i].split(" ").map((p) => (
                        <span key={p} className="block">
                          {p}
                        </span>
                      ))}
                    </span>
                    <span className="text-sm text-ihr-fg">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl p-5 ihr-card">
              <p className="flex items-center gap-2 text-sm font-semibold text-ihr-fg">
                <Bell className="size-4 text-ihr-warning" />
                {t.portal.notifications}
              </p>
              <ul className="mt-4 space-y-3">
                {t.portal.notificationItems.map((n, i) => (
                  <li key={n} className="flex gap-3">
                    <span className={cx("mt-1.5 size-2 shrink-0 rounded-full", i === 0 ? "bg-ihr-primary" : "bg-ihr-border")} />
                    <span className="text-sm text-ihr-fg">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
