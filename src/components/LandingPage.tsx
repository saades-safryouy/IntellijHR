import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import $ from 'jquery'
import { ArrowRight, BriefcaseBusiness, CalendarDays, Check, ChevronRight, ClipboardCheck, GraduationCap, Layers3, LogOut, Menu, Moon, Network, ShieldCheck, Sun, Users, X } from 'lucide-react'
import './LandingPage.css'
import logo from '../assets/IAgency_logo.png'
import lightLogo from '../assets/IAgency_light_logo.png'
type Language = 'en' | 'fr' | 'ar'
type Theme = 'dark' | 'light'

type Copy = {
  introTitle:string; introSubtitle:string ;agency: string; ecosystem: string; home: string; ecosystemNav: string; hr: string; features: string; about: string; signIn: string; exploreHr: string; discoverAgency: string; heroTitle: string; heroText: string; hrLabel: string; hrText: string; agencyTitle: string; agencyText: string; logistics: string; school: string; business: string; humanResources: string; logisticsLabel: string; education: string; businessLabel: string; agencySection: string; hrTitle: string; hrTextLong: string; lifecycleTitle: string; people: string; onboarding: string; offboarding: string; leave: string; holidays: string; profile: string; featureTitle: string; featureIntro: string; fromTitle: string; previewTitle: string; previewText: string; benefitsTitle: string; benefit1: string; benefit2: string; benefit3: string; benefit4: string; benefit5: string; benefit6: string; ctaTitle: string; ctaText: string; enter: string; footerText: string; products: string; links: string; noDetails: string; directory: string; requests: string; approvals: string; calendar: string; connected: string; active: string; complete: string
}

const copy: Record<Language, Copy> = {
  en: { introTitle: 'Introducing IntillegenceHR', introSubtitle: 'The people operations foundation of the IntillegenceAgency ' ,agency: 'IntillegenceAgency', ecosystem: 'An integrated ecosystem of business solutions', home: 'Home', ecosystemNav: 'Ecosystem', hr: 'IntillegenceHR', features: 'Features', about: 'About', signIn: 'Sign in', exploreHr: 'Explore IntillegenceHR', discoverAgency: 'Discover IntillegenceAgency', heroTitle: 'One ecosystem. Multiple business solutions.', heroText: 'IntillegenceAgency brings together specialized digital solutions designed to simplify and centralize the way organizations manage their operations.', hrLabel: 'IntillegenceHR · Human Resources Management', hrText: 'Centralize employee information and streamline the employee lifecycle with a modern HR management platform.', agencyTitle: 'An ecosystem built around your organization', agencyText: 'IntillegenceAgency connects specialized products around the realities of how organizations work. IntillegenceHR is the people operations foundation.', logistics: 'IntillegenceLogistique', school: 'IntillegenceSchool', business: 'IntillegenceBusiness', humanResources: 'Human Resources', logisticsLabel: 'Logistics', education: 'Education', businessLabel: 'Business', agencySection: 'THE IntillegenceAGENCY ECOSYSTEM', hrTitle: 'Human Resources, simplified.', hrTextLong: 'IntillegenceHR centralizes employee information and key HR processes in one structured platform, helping organizations manage the employee lifecycle more efficiently.', lifecycleTitle: 'A clear path through the employee lifecycle', people: 'People Profile', onboarding: 'Onboarding', offboarding: 'Offboarding', leave: 'Leave Management', holidays: 'Holidays', profile: 'People Profile', featureTitle: 'The HR essentials, in one operating layer.', featureIntro: 'Focused modules for the processes that keep people operations moving.', fromTitle: 'From onboarding to offboarding', previewTitle: 'A real workspace for real HR work.', previewText: 'A focused view of your workforce, requests, workflows and employee activity.', benefitsTitle: 'Why IntillegenceHR?', benefit1: 'Centralized employee information', benefit2: 'Structured employee lifecycle management', benefit3: 'Simplified HR workflows', benefit4: 'Role-based access', benefit5: 'Multi-language support', benefit6: 'Clear and organized HR operations', ctaTitle: 'Ready to manage your HR operations differently?', ctaText: 'Discover IntillegenceHR and explore a more structured approach to employee lifecycle management.', enter: 'Enter IntillegenceHR', footerText: 'An ecosystem of specialized digital business solutions.', products: 'Products', links: 'Links', noDetails: 'A specialized solution within IntillegenceAgency.', directory: 'Employee directory', requests: 'Leave requests', approvals: 'Onboarding workflow', calendar: 'Company calendar', connected: 'Connected', active: 'Active', complete: 'Complete' },
  fr: { introTitle: 'Découvrez IntillegenceRH', introSubtitle: 'Le socle des opérations RH de l’écosystèmeagency', agency:'IntillegenceAgency', ecosystem: 'Un écosystème intégré de solutions métiers', home: 'Accueil', ecosystemNav: 'Écosystème', hr: 'IntillegenceRH', features: 'Fonctionnalités', about: 'À propos', signIn: 'Se connecter', exploreHr: 'Découvrir IntillegenceRH', discoverAgency: 'Découvrir IntillegenceAgency', heroTitle: 'Un écosystème. Plusieurs solutions métiers.', heroText: 'IntillegenceAgency réunit des solutions numériques spécialisées pour simplifier et centraliser la gestion des opérations des organisations.', hrLabel: 'IntillegenceHR · Gestion des ressources humaines', hrText: 'Centralisez les informations collaborateurs et fluidifiez le cycle de vie des employés avec une plateforme RH moderne.', agencyTitle: 'Un écosystème construit autour de votre organisation', agencyText: 'IntillegenceAgency relie des produits spécialisés aux réalités opérationnelles des organisations. IntillegenceHR en est le socle humain.', logistics: 'IntillegenceLogistique', school: 'IntillegenceSchool', business: 'IntillegenceBusiness', humanResources: 'Ressources humaines', logisticsLabel: 'Logistique', education: 'Éducation', businessLabel: 'Entreprise', agencySection: "L'ÉCOSYSTÈME IntillegenceAGENCY", hrTitle: 'Les ressources humaines, simplifiées.', hrTextLong: 'IntillegenceHR centralise les informations collaborateurs et les processus RH essentiels dans une plateforme structurée.', lifecycleTitle: 'Un parcours clair pour chaque collaborateur', people: 'Profil collaborateur', onboarding: 'Intégration', offboarding: 'Départ', leave: 'Gestion des congés', holidays: 'Jours fériés', profile: 'Profil collaborateur', featureTitle: 'Les essentiels RH, dans une seule couche opérationnelle.', featureIntro: 'Des modules ciblés pour les processus qui font avancer les opérations RH.', fromTitle: "De l'intégration au départ", previewTitle: 'Un espace de travail pour le vrai travail RH.', previewText: 'Une vue claire de vos collaborateurs, demandes, workflows et activités.', benefitsTitle: 'Pourquoi IntillegenceHR ?', benefit1: 'Informations collaborateurs centralisées', benefit2: 'Gestion structurée du cycle de vie', benefit3: 'Processus RH simplifiés', benefit4: 'Accès basé sur les rôles', benefit5: 'Support multilingue', benefit6: 'Opérations RH claires et organisées', ctaTitle: 'Prêt à gérer vos opérations RH autrement ?', ctaText: 'Découvrez IntillegenceHR et une approche plus structurée du cycle de vie collaborateur.', enter: 'Entrer dans IntillegenceHR', footerText: 'Un écosystème de solutions numériques métiers spécialisées.', products: 'Produits', links: 'Liens', noDetails: 'Une solution spécialisée au sein d’IntillegenceAgency.', directory: 'Annuaire collaborateurs', requests: 'Demandes de congé', approvals: 'Workflow intégration', calendar: 'Calendrier entreprise', connected: 'Connecté', active: 'Actif', complete: 'Terminé' },
  ar: { introTitle: 'تعرف على IntillegenceHR', introSubtitle: 'أساس عمليات الأفراد في منظومة IntillegenceAgency.',agency: 'IntillegenceAgency', ecosystem: 'منظومة متكاملة من حلول الأعمال', home: 'الرئيسية', ecosystemNav: 'المنظومة', hr: 'IntillegenceHR', features: 'الميزات', about: 'حول المنصة', signIn: 'تسجيل الدخول', exploreHr: 'اكتشف IntillegenceHR', discoverAgency: 'اكتشف IntillegenceAgency', heroTitle: 'منظومة واحدة. حلول أعمال متعددة.', heroText: 'تجمع IntillegenceAgency حلولاً رقمية متخصصة لتبسيط وإدارة عمليات المؤسسات من مكان واحد.', hrLabel: 'IntillegenceHR · إدارة الموارد البشرية', hrText: 'اجمع معلومات الموظفين وسهّل دورة حياة الموظف عبر منصة حديثة لإدارة الموارد البشرية.', agencyTitle: 'منظومة مبنية حول مؤسستك', agencyText: 'تربط IntillegenceAgency منتجات متخصصة باحتياجات المؤسسات. وتمثل IntillegenceHR طبقة عمليات الأفراد.', logistics: 'IntillegenceLogistique', school: 'IntillegenceSchool', business: 'IntillegenceBusiness', humanResources: 'الموارد البشرية', logisticsLabel: 'الخدمات اللوجستية', education: 'التعليم', businessLabel: 'الأعمال', agencySection: 'منظومة IntillegenceAGENCY', hrTitle: 'الموارد البشرية، ببساطة.', hrTextLong: 'تجمع IntillegenceHR معلومات الموظفين وعمليات الموارد البشرية الأساسية في منصة منظمة تساعد المؤسسات على إدارة دورة حياة الموظف بكفاءة.', lifecycleTitle: 'مسار واضح خلال دورة حياة الموظف', people: 'ملف الموظف', onboarding: 'التهيئة', offboarding: 'المغادرة', leave: 'إدارة الإجازات', holidays: 'العطل', profile: 'ملف الموظف', featureTitle: 'أساسيات الموارد البشرية في طبقة تشغيل واحدة.', featureIntro: 'وحدات مركزة للعمليات التي تحافظ على استمرارية عمل الموارد البشرية.', fromTitle: 'من التهيئة إلى المغادرة', previewTitle: 'مساحة عمل حقيقية لعمل الموارد البشرية.', previewText: 'رؤية واضحة للموظفين والطلبات ومسارات العمل والأنشطة.', benefitsTitle: 'لماذا IntillegenceHR؟', benefit1: 'معلومات موظفين مركزية', benefit2: 'إدارة منظمة لدورة حياة الموظف', benefit3: 'مسارات عمل مبسطة', benefit4: 'صلاحيات مبنية على الأدوار', benefit5: 'دعم متعدد اللغات', benefit6: 'عمليات موارد بشرية واضحة ومنظمة', ctaTitle: 'هل أنت مستعد لإدارة عمليات الموارد البشرية بطريقة مختلفة؟', ctaText: 'اكتشف IntillegenceHR ونهجاً أكثر تنظيماً لإدارة دورة حياة الموظف.', enter: 'الدخول إلى IntillegenceHR', footerText: 'منظومة من حلول الأعمال الرقمية المتخصصة.', products: 'المنتجات', links: 'الروابط', noDetails: 'حل متخصص ضمن IntillegenceAgency.', directory: 'دليل الموظفين', requests: 'طلبات الإجازة', approvals: 'مسار التهيئة', calendar: 'تقويم المؤسسة', connected: 'متصل', active: 'نشط', complete: 'مكتمل' },
}

const products = [
  { key: 'hr', icon: Users, accent: true },
  { key: 'logistics', icon: Network, accent: false },
  { key: 'school', icon: GraduationCap, accent: false },
  { key: 'business', icon: BriefcaseBusiness, accent: false },
] as const

const featureIcons = [Users, ClipboardCheck, LogOut, CalendarDays, CalendarDays]

export default function LandingPage({ language, onLanguageChange, onThemeChange, theme, onNavigate }: { language: Language; onLanguageChange: (language: Language) => void; onThemeChange: (theme: Theme) => void; theme: Theme; onNavigate: (path: string) => void }) {
  const t = copy[language]
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const $root = rootRef.current ? $(rootRef.current) : $()
    if (!$root.length) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      $root.find('.landing-kicker, .landing-hero h1, .landing-hero-copy > p, .landing-hero-product, .landing-hero-actions, .hero-orbit-center, .hero-orbit-node, [data-reveal]').css({ opacity: 1, marginTop: 0, marginLeft: 0, marginRight: 0, zoom: 1 })
      return
    }

    const $heroItems = $root.find('.landing-kicker, .landing-hero h1, .landing-hero-copy > p, .landing-hero-product, .landing-hero-actions')
    $heroItems.each(function (this: HTMLElement, index: number) {
      const $item = $(this)
      $item.css({ opacity: 0, marginTop: 18 })
      $item.stop(true, true).delay(index * 110).animate({ opacity: 1, marginTop: 0 }, { duration: 550, queue: false, easing: 'swing' })
    })

    const $orbitNodes = $root.find('.hero-orbit-node, .hero-orbit-center')
    $orbitNodes.each(function (this: HTMLElement, index: number) {
      const $node = $(this)
      $node.css({ opacity: 0, zoom: 0.86 })
      $node.stop(true, true).delay(250 + index * 110).animate({ opacity: 1, zoom: 1 }, { duration: 520, queue: false, easing: 'swing' })
    })

    const $nav = $root.find('.landing-navbar')
    const handleNavbarScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0
      $nav.toggleClass('scrolled', scrollTop > 24)
    }

    const revealItems = () => {
      $root.find('[data-reveal]').each(function (this: HTMLElement) {
        const $item = $(this)
        if ($item.data('revealed')) return

        const rect = this.getBoundingClientRect()
        const inView = rect.top < window.innerHeight * 0.82 && rect.bottom > 0
        if (!inView) return

        const revealType = String($item.attr('data-reveal') || 'fade-up')
        const animationProps: Record<string, number | string> = { opacity: 1 }

        if (revealType === 'fade-up') animationProps.marginTop = 0
        if (revealType === 'fade-left') animationProps.marginLeft = 0
        if (revealType === 'fade-right') animationProps.marginRight = 0
        if (revealType === 'scale') animationProps.zoom = 1

        $item.css({ opacity: 0, marginTop: revealType === 'fade-up' ? 18 : 0, marginLeft: revealType === 'fade-left' ? 24 : 0, marginRight: revealType === 'fade-right' ? 24 : 0, zoom: revealType === 'scale' ? 0.9 : 1 })
        $item.stop(true, true).animate(animationProps, { duration: 620, queue: false, easing: 'swing' })
        $item.data('revealed', true)
      })
    }

    handleNavbarScroll()
    revealItems()
    $(window).on('scroll.jqueryLanding resize.jqueryLanding', handleNavbarScroll)
    $(window).on('scroll.jqueryReveal resize.jqueryReveal', revealItems)

    return () => {
      $(window).off('.jqueryLanding')
      $(window).off('.jqueryReveal')
      $root.find('.landing-kicker, .landing-hero h1, .landing-hero-copy > p, .landing-hero-product, .landing-hero-actions, .hero-orbit-center, .hero-orbit-node, [data-reveal]').stop(true, true)
    }
  }, [])

  useEffect(() => {
    const $root = rootRef.current ? $(rootRef.current) : $()
    if (!$root.length) return
    const $nav = $root.find('.landing-navbar nav')
    const isMobile = window.matchMedia('(max-width: 760px)').matches

    if (isMobile) {
      if (menuOpen) {
        $nav.stop(true, true).slideDown(220)
      } else {
        $nav.stop(true, true).slideUp(220)
      }
    } else {
      $nav.stop(true, true).css({ display: 'flex', height: 'auto' })
    }

    return () => {
      $nav.stop(true, true)
    }
  }, [menuOpen])

  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
  return <div className="landing-page" ref={rootRef}>
    <header className="landing-navbar"><button className="landing-brand" onClick={() => scrollTo('top')}><span className="agency-mark"> <img
          src={theme === 'light' ? logo : lightLogo}
          alt="IntilljHR"
        />
      </span><span><strong>{t.hr}</strong><small>{t.ecosystem}</small></span></button><nav className={menuOpen ? 'open' : ''}>{[['top', t.home], ['ecosystem', t.ecosystemNav], ['hr-intro', t.hr], ['features', t.features], ['about', t.about]].map(([id, label]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}<button className="mobile-sign-in" onClick={() => onNavigate('/login')}>{t.signIn}</button></nav><div className="landing-actions"><div className="landing-language"><button className={language === 'en' ? 'active' : ''} onClick={() => onLanguageChange('en')}>EN</button><button className={language === 'fr' ? 'active' : ''} onClick={() => onLanguageChange('fr')}>FR</button><button className={language === 'ar' ? 'active' : ''} onClick={() => onLanguageChange('ar')}>ع</button></div><button className="landing-theme" onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button><button className="landing-signin" onClick={() => onNavigate('/login')}>{t.signIn}</button><button className="landing-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div></header>
    <main id="top">
      <section className="hr-hero-intro" id="hr-hero">
  <div className="hr-hero-intro-copy">
    <span className="landing-kicker"><Users size={15} /> {t.hrLabel}</span>
    <h1>{t.introTitle}</h1>
    <p>{t.introSubtitle}</p>
    <div className="landing-hero-actions">
      <button className="landing-button primary" onClick={() => onNavigate('/login')}>{t.exploreHr}<ArrowRight size={16} /></button>
      <button className="landing-button secondary" onClick={() => scrollTo('features')}>{t.features}<ChevronRight size={16} /></button>
    </div>
    <div className="hr-hero-stats">
      <div className="hr-hero-stat"><strong>248</strong><span>{t.people}</span></div>
      <div className="hr-hero-stat"><strong>12</strong><span>{t.requests}</span></div>
      <div className="hr-hero-stat"><strong>18</strong><span>{t.calendar}</span></div>
    </div>
  </div>
  <div className="hr-hero-orbit-wrap">
    <div className="hr-hero-orbit">
      <div className="hr-hero-glow" />
      <div className="hr-hero-ring ring-1" />
      <div className="hr-hero-ring ring-2" />
      <div className="hr-hero-core"><Users size={26} /></div>
      <div className="hr-hero-node node-onboarding"><ClipboardCheck size={16} /></div>
      <div className="hr-hero-node node-leave"><CalendarDays size={16} /></div>
      <div className="hr-hero-node node-offboarding"><LogOut size={16} /></div>
      <div className="hr-hero-node node-shield"><ShieldCheck size={16} /></div>
    </div>
  </div>
</section>
      
      <section className="landing-section hr-introduction" id="hr-intro"><div className="hr-intro-copy"><SectionLabel>{t.hr}</SectionLabel><h2>{t.hrTitle}</h2><p>{t.hrTextLong}</p><div className="hr-proof"><ShieldCheck size={18} /><span>{t.connected}</span><span /><Check size={17} /><span>{t.active}</span></div></div><div className="mini-lifecycle"><div className="mini-lifecycle-node active" data-reveal="scale"><Users size={17} /><span>{t.people}</span></div><ArrowRight size={16} /><div className="mini-lifecycle-node" data-reveal="scale"><ClipboardCheck size={17} /><span>{t.onboarding}</span></div><ArrowRight size={16} /><div className="mini-lifecycle-node" data-reveal="scale"><CalendarDays size={17} /><span>{t.leave}</span></div><ArrowRight size={16} /><div className="mini-lifecycle-node" data-reveal="scale"><LogOut size={17} /><span>{t.offboarding}</span></div></div></section>
      <section className="landing-section feature-section" id="features"><SectionLabel>{t.hr}</SectionLabel><div className="landing-section-heading"><h2>{t.featureTitle}</h2><p>{t.featureIntro}</p></div><div className="landing-feature-grid">{[t.people, t.onboarding, t.offboarding, t.leave, t.holidays].map((title, index) => { const Icon = featureIcons[index]; const descriptions = [t.profile, t.hrText, t.hrText, t.hrText, t.hrText]; return <article className="landing-feature-card" data-reveal="fade-up" key={title}><div className="feature-card-top"><span>0{index + 1}</span><Icon size={22} /></div><h3>{title}</h3><p>{descriptions[index]}</p><ArrowRight size={16} /></article> })}</div></section>
      <section className="landing-section lifecycle-section" id="about"><SectionLabel>{t.fromTitle}</SectionLabel><div className="landing-section-heading"><h2>{t.lifecycleTitle}</h2></div><div className="lifecycle-track"><div className="lifecycle-line" data-reveal="scale" /><div className="lifecycle-item active" data-reveal="fade-up"><span>{String(1).padStart(2, '0')}</span><div><ClipboardCheck size={18} /><strong>{t.onboarding}</strong></div></div><div className="lifecycle-item" data-reveal="fade-up"><span>{String(2).padStart(2, '0')}</span><div><Users size={18} /><strong>{t.people}</strong></div></div><div className="lifecycle-item" data-reveal="fade-up"><span>{String(3).padStart(2, '0')}</span><div><CalendarDays size={18} /><strong>{t.leave}</strong></div></div><div className="lifecycle-item" data-reveal="fade-up"><span>{String(4).padStart(2, '0')}</span><div><CalendarDays size={18} /><strong>{t.holidays}</strong></div></div><div className="lifecycle-item" data-reveal="fade-up"><span>{String(5).padStart(2, '0')}</span><div><LogOut size={18} /><strong>{t.offboarding}</strong></div></div></div></section>
      <section className="landing-preview-section"><div className="preview-copy" data-reveal="fade-up"><SectionLabel>{t.hr}</SectionLabel><h2>{t.previewTitle}</h2><p>{t.previewText}</p><button className="landing-button primary" onClick={() => onNavigate('/login')}>{t.enter}<ArrowRight size={16} /></button></div><div data-reveal="fade-left"><ProductPreviewPanel t={t} /></div></section>
      <section className="landing-section benefits-section"><SectionLabel>{t.hr}</SectionLabel><div className="landing-section-heading"><h2>{t.benefitsTitle}</h2></div><div className="benefit-grid">{[t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5, t.benefit6].map((benefit, index) => <div className="benefit-item" data-reveal="fade-up" key={benefit}><span>0{index + 1}</span><Check size={16} /><strong>{benefit}</strong></div>)}</div></section>
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="landing-kicker">
            <Layers3 size={15} /> {t.agency} · {t.ecosystem}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="landing-hero-product">
              <span className="product-kicker">{t.hrLabel}</span>
              <p>{t.hrText}</p>
              </div>
              <div className="landing-hero-actions">
                <button className="landing-button primary" onClick={() => onNavigate('/login')}>{t.exploreHr}<ArrowRight size={16} /></button>
                <button className="landing-button secondary" onClick={() => scrollTo('ecosystem')}>{t.discoverAgency}<ChevronRight size={16} /></button>
                </div>
                </div>
                <div className="hero-ecosystem">
                  <div className="hero-orbit-lines">
                    <span /><span />
                    <span />
                    </div>
                    <div className="hero-orbit-center">
                      <span className="agency-mark large">
                           <img
                            src={theme === 'light' ? logo : lightLogo}
                            alt="IntillegenceHR"
                          />
                        </span>
                        <strong>{t.agency}</strong>
                        <small>{t.ecosystem}</small>
                        </div>
                        <div className="hero-orbit-node hero-orbit-node-hr">
                          <Users size={17} />
                          <strong>IntillegenceHR</strong>
                          <small>{t.humanResources}</small>
                        </div>
                        <div className="hero-orbit-node hero-orbit-node-logistics">
                            <Network size={17} />
                            <strong>{t.logistics}</strong>
                            <small>{t.logisticsLabel}</small>
                        </div>
                        <div className="hero-orbit-node hero-orbit-node-school">
                          <GraduationCap size={17} />
                          <strong>{t.school}</strong>
                          <small>{t.education}</small>
                        </div>
                        <div className="hero-orbit-node hero-orbit-node-business">
                          <BriefcaseBusiness size={17} />
                          <strong>{t.business}</strong>
                          <small>{t.businessLabel}</small>
                        </div>
                    </div>
      </section>
      <section className="landing-section agency-overview" id="ecosystem"><SectionLabel>{t.agencySection}</SectionLabel><div className="landing-section-heading"><h2>{t.agencyTitle}</h2><p>{t.agencyText}</p></div><div className="agency-product-grid">{products.map(({ key, icon: Icon, accent }) => { const name = t[key]; const label = key === 'hr' ? t.humanResources : key === 'logistics' ? t.logisticsLabel : key === 'school' ? t.education : t.businessLabel; return <article className={`agency-product-card ${accent ? 'featured' : ''}`} data-reveal="fade-up" key={key}><div className="product-card-icon"><Icon size={21} /></div><span className="product-card-index">0{products.findIndex((item) => item.key === key) + 1}</span><h3>{name}</h3><span>{label}</span><p>{accent ? t.hrText : t.noDetails}</p><ChevronRight size={17} /></article> })}</div></section>

      <section className="landing-section ecosystem-diagram"><SectionLabel>{t.agencySection}</SectionLabel><h2>{t.agency}</h2><p>{t.ecosystem}</p><div className="ecosystem-branches">{products.map(({ key, icon: Icon, accent }) => <div className={`ecosystem-branch ${accent ? 'featured' : ''}`} data-reveal="fade-up" key={key}><span className="branch-line" /><Icon size={18} /><div><strong>{t[key]}</strong><small>{key === 'hr' ? t.humanResources : key === 'logistics' ? t.logisticsLabel : key === 'school' ? t.education : t.businessLabel}</small></div></div>)}</div></section>
      <section className="landing-cta"><SectionLabel>{t.hr}</SectionLabel><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p><button className="landing-button primary" onClick={() => onNavigate('/login')}>{t.enter}<ArrowRight size={16} /></button></section>
    </main><footer className="landing-footer"><div className="footer-brand"><button className="landing-brand" onClick={() => scrollTo('top')}><span className="agency-mark"> <img
          src={theme === 'light' ? logo : lightLogo}
          alt="IntilljHR"
        />
  </span><span><strong>{t.hr}</strong><small>{t.ecosystem}</small></span></button><p>{t.footerText}</p></div><FooterColumn title={t.products} items={[t.hr, t.logistics, t.school, t.business]} /><FooterColumn title={t.hr} items={[t.people, t.onboarding, t.offboarding, t.leave, t.holidays]} /><FooterColumn title={t.links} items={[t.home, t.ecosystemNav, t.features, t.signIn]} /><div className="footer-bottom">© 2026 IntillegenceAgency <span>{language.toUpperCase()}</span></div></footer>
  </div>
}

function SectionLabel({ children }: { children: ReactNode }) { return <span className="landing-section-label">{children}</span> }
function FooterColumn({ title, items }: { title: string; items: string[] }) { return <div className="footer-column"><strong>{title}</strong>{items.map((item) => <span key={item}>{item}</span>)}</div> }
function ProductPreviewPanel({ t }: { t: Copy }) { return <div className="landing-product-preview"><div className="preview-window-bar"><span /><span /><span /><small>IntillegenceHR · {t.directory}</small></div><div className="preview-window-body"><aside><div className="preview-window-logo">I</div><i /><i /><i /><i /></aside><div className="preview-window-content"><div className="preview-window-header"><div><small>{t.hr}</small><strong>{t.directory}</strong></div><div className="preview-window-user">SE</div></div><div className="preview-window-stats"><span><small>{t.people}</small><strong>248</strong><em>+4.2%</em></span><span><small>{t.requests}</small><strong>12</strong><em>{t.active}</em></span><span><small>{t.calendar}</small><strong>18</strong><em>{t.complete}</em></span></div><div className="preview-window-table"><div><span /><b>{t.directory}</b><em>{t.active}</em></div><div><span /><b>{t.requests}</b><em>{t.active}</em></div><div><span /><b>{t.approvals}</b><em>{t.complete}</em></div></div></div></div></div> }
