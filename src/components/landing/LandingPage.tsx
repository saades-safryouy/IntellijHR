import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { LandingHeader } from "./LandingHeader";
import { HeroSection } from "./HeroSection";
import { PlatformOverview } from "./PlatformOverview";
import { EmployeeLifecycle } from "./EmployeeLifecycle";
import { EFlowShowcase } from "./EFlowShowcase";
import { OrganigramPreview } from "./OrganigramPreview";
import { EmployeePortalPreview } from "./EmployeePortalPreview";
import { BenefitsSection } from "./BenefitsSection";
import { FinalCTA } from "./FinalCTA";
import { LandingFooter } from "./LandingFooter";
import { LandingProvider, cx } from "./LandingPrimitives";
import { landingTranslations, type LandingLanguage, type LandingTheme } from "./landingTranslations";

const AnalyticsShowcase = lazy(() => import("./AnalyticsShowcase"));

export interface LandingPageProps {
  /** Controlled language. When omitted, the page manages it internally. */
  language?: LandingLanguage;
  /** Controlled theme. When omitted, the page manages it internally (defaults to dark). */
  theme?: LandingTheme;
  onLogin?: () => void;
  onGetStarted?: () => void;
  /** Called when the user picks a language — wire to your i18n context. */
  onLanguageChange?: (lang: LandingLanguage) => void;
  /** Called when the user toggles the theme — wire to your theme context. */
  onThemeChange?: (theme: LandingTheme) => void;
  className?: string;
}

export function LandingPage({
  language,
  theme,
  onLogin,
  onGetStarted,
  onLanguageChange,
  onThemeChange,
  className,
}: LandingPageProps) {
  const [innerLang, setInnerLang] = useState<LandingLanguage>(language ?? "en");
  const [innerTheme, setInnerTheme] = useState<LandingTheme>(theme ?? "dark");

  useEffect(() => {
    if (language) setInnerLang(language);
  }, [language]);
  useEffect(() => {
    if (theme) setInnerTheme(theme);
  }, [theme]);

  const lang = language ?? innerLang;
  const currentTheme = theme ?? innerTheme;
  const isRtl = lang === "ar";
  const ctx = useMemo(() => ({ t: landingTranslations[lang], lang, isRtl }), [lang, isRtl]);

  const changeLang = (l: LandingLanguage) => {
    setInnerLang(l);
    onLanguageChange?.(l);
  };
  const toggleTheme = () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    setInnerTheme(next);
    onThemeChange?.(next);
  };

  return (
    <LandingProvider value={ctx}>
      <div
        lang={lang}
        dir={isRtl ? "rtl" : "ltr"}
        className={cx("ihr min-h-screen overflow-x-clip antialiased", currentTheme === "dark" && "dark", className)}
      >
        <LandingHeader
          theme={currentTheme}
          onThemeToggle={toggleTheme}
          onLanguageChange={changeLang}
          onLogin={onLogin}
          onGetStarted={onGetStarted}
        />
        <main>
          <HeroSection onGetStarted={onGetStarted} />
          <PlatformOverview />
          <EmployeeLifecycle />
          <Suspense fallback={<div id="analytics" className="min-h-[600px]" />}>
            <AnalyticsShowcase />
          </Suspense>
          <EFlowShowcase />
          <OrganigramPreview />
          <EmployeePortalPreview />
          <BenefitsSection />
          <FinalCTA onGetStarted={onGetStarted} />
        </main>
        <LandingFooter />
      </div>
    </LandingProvider>
  );
}

export default LandingPage;
