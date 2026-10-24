import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Globe, Menu, Moon, Sun, X, Check } from "lucide-react";
import { NAV_SECTIONS } from "./landingData";
import { languageLabels, type LandingLanguage, type LandingTheme } from "./landingTranslations";
import { cx, scrollToId, useLanding } from "./LandingPrimitives";
import logo from "../../assets/IAgency_light_logo.png";
import Dlogo from "../../assets/IAgency_logo.png";

export interface LandingHeaderProps {
  theme: LandingTheme;
  onThemeToggle: () => void;
  onLanguageChange: (lang: LandingLanguage) => void;
  onLogin?: () => void;
  onGetStarted?: () => void;
}

function LanguageMenu({ onChange }: { onChange: (l: LandingLanguage) => void }) {
  const { lang, t } = useLanding();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t.nav.language}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ihr-border px-3 text-sm font-semibold text-ihr-fg transition-colors hover:bg-ihr-card-2 focus-visible:outline-2 focus-visible:outline-ihr-primary"
      >
        <Globe className="size-4" />
        {languageLabels[lang]}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute end-0 z-50 mt-2 w-32 overflow-hidden rounded-2xl p-1 ihr-glass"
          >
            {(Object.keys(languageLabels) as LandingLanguage[]).map((l) => (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l === lang}
                  onClick={() => {
                    onChange(l);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-ihr-fg hover:bg-ihr-card-2"
                >
                  {{ en: "English", fr: "Français", ar: "العربية" }[l]}
                  {l === lang && <Check className="size-4 text-ihr-primary" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LandingHeader({ theme, onThemeToggle, onLanguageChange, onLogin, onGetStarted }: LandingHeaderProps) {
  const { t } = useLanding();
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header
      className={cx(
        "sticky top-0 z-40 border-b transition-colors",
        scrolled ? "border-ihr-border ihr-glass shadow-none" : "border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            go("home");
          }}
          className="flex shrink-0 items-center font-extrabold tracking-tight text-ihr-fg"
        >
          {theme === "dark" ? (
            <img src={logo} alt="IntelligenceHR Logo" className="size-12" />
          ) : (
            <img src={Dlogo} alt="IntelligenceHR Logo" className="size-12" />
          )}
          <span className="text-lg">
            Intelligence<span className="text-ihr-primary">HR</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 xl:flex">
          {NAV_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(s.id);
                }}
                aria-current={active === s.id ? "true" : undefined}
                className={cx(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active === s.id ? "text-ihr-fg" : "text-ihr-muted hover:text-ihr-fg",
                )}
              >
                {active === s.id && (
                  <motion.span layoutId="ihr-nav-pill" className="absolute inset-0 -z-10 rounded-full bg-ihr-card-2" />
                )}
                {t.nav[s.key]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageMenu onChange={onLanguageChange} />
            <button
              type="button"
              aria-label={t.nav.toggleTheme}
              onClick={onThemeToggle}
              className="grid size-9 place-items-center rounded-full border border-ihr-border text-ihr-fg transition-colors hover:bg-ihr-card-2"
            >
              <ThemeIcon className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ihr-fg transition-colors hover:bg-ihr-card-2 lg:inline-flex"
          >
            {t.nav.signIn}
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="hidden rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 ihr-btn-primary md:inline-flex"
          >
            {t.nav.getStarted}
          </button>
          <button
            type="button"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-full border border-ihr-border text-ihr-fg xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ihr-border bg-ihr-bg xl:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
              {NAV_SECTIONS.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={(e) => {
                    e.preventDefault();
                    go(s.id);
                  }}
                  className={cx(
                    "block rounded-2xl px-4 py-3 text-base font-medium",
                    active === s.id ? "bg-ihr-card-2 text-ihr-fg" : "text-ihr-muted",
                  )}
                >
                  {t.nav[s.key]}
                </motion.a>
              ))}
              <div className="flex items-center gap-2 pt-3 sm:hidden">
                <LanguageMenu onChange={onLanguageChange} />
                <button
                  type="button"
                  aria-label={t.nav.toggleTheme}
                  onClick={onThemeToggle}
                  className="grid size-9 place-items-center rounded-full border border-ihr-border text-ihr-fg"
                >
                  <ThemeIcon className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onLogin?.();
                  }}
                  className="rounded-full border border-ihr-border px-4 py-3 text-sm font-semibold text-ihr-fg"
                >
                  {t.nav.signIn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onGetStarted?.();
                  }}
                  className="rounded-full px-4 py-3 text-sm font-semibold ihr-btn-primary"
                >
                  {t.nav.getStarted}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
