import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Minus, Plus, RotateCcw } from "lucide-react";
import { deptColors, initials, orgTree, type OrgNode } from "./landingData";
import { Reveal, Section, SectionHeading, cx, useLanding } from "./LandingPrimitives";

const colorOf = (n: OrgNode) => (n.dept === "executive" ? "var(--ihr-primary)" : deptColors[n.dept]);

function PersonCard({ node, expanded, onToggle }: { node: OrgNode; expanded?: boolean; onToggle?: () => void }) {
  const { t } = useLanding();
  const count = node.children?.length ?? 0;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full overflow-hidden rounded-2xl p-3 ihr-card"
    >
      <span className="absolute inset-y-0 start-0 w-1" style={{ background: colorOf(node) }} aria-hidden />
      <div className="flex items-center gap-3">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold text-ihr-on-primary"
          style={{ background: colorOf(node) }}
        >
          {initials(node.name)}
        </span>
        <div className="min-w-0 flex-1 text-start">
          <p className="truncate text-sm font-semibold text-ihr-fg">{node.name}</p>
          <p className="truncate text-xs text-ihr-muted">{t.org.roles[node.role]}</p>
        </div>
        {count > 0 && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={t.org.toggle}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ihr-card-2 px-2 py-1 text-[11px] font-semibold text-ihr-fg hover:bg-ihr-border"
          >
            {count}
            <ChevronDown className={cx("size-3.5 transition-transform", expanded && "rotate-180")} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function OrganigramPreview() {
  const { t } = useLanding();
  const [open, setOpen] = useState<Record<string, boolean>>({ cto: true, chro: true });
  const [zoom, setZoom] = useState(1);
  const managers = orgTree.children ?? [];

  return (
    <Section id="organigram">
      <SectionHeading eyebrow={t.org.eyebrow} lines={[t.org.title]} desc={t.org.desc} highlightLast={false} />
      <Reveal className="mt-14">
        <div className="relative overflow-hidden rounded-[2rem] p-4 sm:p-8 ihr-glass">
          <div className="pointer-events-none absolute inset-0 ihr-grid" aria-hidden />
          <div className="relative mb-6 flex justify-end gap-1.5">
            {[
              { label: t.org.zoomOut, icon: Minus, fn: () => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2))) },
              { label: t.org.reset, icon: RotateCcw, fn: () => setZoom(1) },
              { label: t.org.zoomIn, icon: Plus, fn: () => setZoom((z) => Math.min(1.15, +(z + 0.1).toFixed(2))) },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                aria-label={b.label}
                onClick={b.fn}
                className="grid size-9 place-items-center rounded-full border border-ihr-border bg-ihr-card text-ihr-fg hover:bg-ihr-card-2"
              >
                <b.icon className="size-4" />
              </button>
            ))}
          </div>

          <motion.div animate={{ scale: zoom }} style={{ transformOrigin: "top center" }} className="relative">
            <div className="mx-auto max-w-xs">
              <PersonCard node={orgTree} />
            </div>
            <div className="mx-auto h-8 w-0.5 bg-ihr-border" aria-hidden />
            <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <span className="absolute inset-x-[12.5%] -top-0 hidden h-0.5 bg-ihr-border lg:block" aria-hidden />
              {managers.map((m) => (
                <div key={m.id} className="relative flex flex-col items-stretch lg:pt-6">
                  <span className="absolute start-1/2 top-0 hidden h-6 w-0.5 bg-ihr-border lg:block" aria-hidden />
                  <PersonCard node={m} expanded={!!open[m.id]} onToggle={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))} />
                  <AnimatePresence initial={false}>
                    {open[m.id] && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ms-5 space-y-2 overflow-hidden border-s-2 border-dashed border-ihr-border ps-4 pt-3"
                      >
                        {m.children?.map((c) => (
                          <li key={c.id}>
                            <PersonCard node={c} />
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative mt-8 flex flex-wrap justify-center gap-4 text-xs text-ihr-muted">
            {(["engineering", "sales", "hr", "finance"] as const).map((d) => (
              <span key={d} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: deptColors[d] }} />
                {t.depts[d]}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
