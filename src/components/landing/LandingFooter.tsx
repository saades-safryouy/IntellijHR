import { Mail, MapPin, Phone } from "lucide-react";
import { BrandMark, scrollToId, useLanding } from "./LandingPrimitives";
import logo from "../../assets/IAgency_light_logo.png";
import Dlogo from "../../assets/IAgency_logo.png";
import type { LandingTheme } from "./landingTranslations";


export interface LandingFooterProps {
  theme: LandingTheme;
}


export function LandingFooter( { theme }: LandingFooterProps ) {
  const { t } = useLanding();
  const product = [
    { id: "home", label: t.nav.home },
    { id: "features", label: t.nav.features },
    { id: "how-it-works", label: t.nav.how },
    { id: "analytics", label: t.nav.analytics },
  ];
  const f = t.overview.features;
  const modules = [
    { id: "modules", label: f[0].title },
    { id: "modules", label: f[1].title },
    { id: "eflow", label: f[3].title },
    { id: "organigram", label: f[5].title },
    { id: "self-service", label: t.portal.eyebrow },
  ];
  const link = (id: string, label: string) => (
    <li key={label}>
      <a
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToId(id);
        }}
        className="text-sm text-ihr-muted transition-colors hover:text-ihr-fg"
      >
        {label}
      </a>
    </li>
  );




  return (
    <footer className="border-t border-ihr-border px-4 pt-16 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-ihr-fg">
             {theme === "dark" ? (
            <img src={logo} alt="IntelligenceHR Logo" className="size-12" />
          ) : (
            <img src={Dlogo} alt="IntelligenceHR Logo" className="size-12" />
          )}
            <span>
              Intelligence<span className="text-ihr-primary">HR</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-ihr-muted">{t.footer.desc}</p>
        </div>
        <nav aria-label={t.footer.product}>
          <h3 className="text-sm font-bold text-ihr-fg">{t.footer.product}</h3>
          <ul className="mt-4 space-y-2.5">{product.map((p) => link(p.id, p.label))}</ul>
        </nav>
        <nav aria-label={t.footer.modules}>
          <h3 className="text-sm font-bold text-ihr-fg">{t.footer.modules}</h3>
          <ul className="mt-4 space-y-2.5">{modules.map((m) => link(m.id, m.label))}</ul>
        </nav>
        <div>
          <h3 className="text-sm font-bold text-ihr-fg">{t.footer.contact}</h3>
          <ul className="mt-4 space-y-3 text-sm text-ihr-muted">
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-ihr-primary" />
              <a href={`mailto:${t.footer.email}`} className="hover:text-ihr-fg">
                {t.footer.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-ihr-primary" />
              <span dir="ltr">{t.footer.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-ihr-primary" />
              {t.footer.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 max-w-7xl border-t border-ihr-border pt-6 text-center text-xs text-ihr-muted">
        © {new Date().getFullYear()} IntelligenceHR. {t.footer.rights}
      </div>
    </footer>
  );
}
