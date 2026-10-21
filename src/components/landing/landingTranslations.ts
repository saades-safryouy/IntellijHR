export type LandingLanguage = "en" | "fr" | "ar";
export type LandingTheme = "light" | "dark";

interface TitledItem {
  title: string;
  desc: string;
}

export interface LandingDictionary {
  nav: {
    home: string;
    features: string;
    modules: string;
    how: string;
    analytics: string;
    contact: string;
    signIn: string;
    getStarted: string;
    language: string;
    toggleTheme: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    primary: string;
    secondary: string;
    benefits: [string, string, string];
    totalEmployees: string;
    vsLastQuarter: string;
    workforceGrowth: string;
    departments: string;
    onboarding: string;
    onboardingOf: string;
    live: string;
    activity: [string, string, string];
    statusApproved: string;
    statusPending: string;
  };
  overview: {
    eyebrow: string;
    title1: string;
    title2: string;
    desc: string;
    features: TitledItem[];
  };
  analytics: {
    eyebrow: string;
    title1: string;
    title2: string;
    title3: string;
    desc: string;
    demo: string;
    growth: string;
    dept: string;
    leave: string;
    status: string;
    onboarding: string;
    total: string;
    active: string;
    onLeave: string;
    newHires: string;
    annual: string;
    sick: string;
    other: string;
    completed: string;
    inProgress: string;
    notStarted: string;
    employees: string;
  };
  depts: Record<"engineering" | "sales" | "hr" | "finance" | "operations", string>;
  lifecycle: {
    eyebrow: string;
    title1: string;
    title2: string;
    desc: string;
    step: string;
    stages: (TitledItem & { points: [string, string, string] })[];
  };
  eflow: {
    eyebrow: string;
    title1: string;
    title2: string;
    desc: string;
    nodes: TitledItem[];
    sequential: string;
    parallel: string;
    history: string;
    tracking: string;
    replay: string;
    approved: string;
    pending: string;
    inReview: string;
    waiting: string;
    requestTitle: string;
    requestMeta: string;
    historyItems: [string, string, string, string];
    parallelItems: [string, string, string];
    notification: string;
  };
  org: {
    eyebrow: string;
    title: string;
    desc: string;
    zoomIn: string;
    zoomOut: string;
    reset: string;
    reports: string;
    toggle: string;
    roles: Record<"ceo" | "cto" | "cso" | "chro" | "cfo" | "engineer" | "designer" | "account" | "recruiter" | "analyst", string>;
  };
  portal: {
    eyebrow: string;
    title: string;
    desc: string;
    hello: string;
    welcome: string;
    leaveBalance: string;
    days: string;
    annual: string;
    sick: string;
    requests: string;
    profile: string;
    profileHint: string;
    holidays: string;
    notifications: string;
    tasks: string;
    taskItems: [string, string, string, string];
    holidayItems: [string, string, string];
    notificationItems: [string, string, string];
    requestItems: [string, string, string];
    approved: string;
    pending: string;
    newRequest: string;
  };
  benefits: {
    eyebrow: string;
    title: string;
    desc: string;
    items: TitledItem[];
  };
  cta: {
    title1: string;
    title2: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  footer: {
    desc: string;
    product: string;
    modules: string;
    contact: string;
    rights: string;
    address: string;
    email: string;
    phone: string;
  };
}

const en: LandingDictionary = {
  nav: {
    home: "Home",
    features: "Features",
    modules: "Modules",
    how: "How It Works",
    analytics: "Analytics",
    contact: "Contact",
    signIn: "Sign In",
    getStarted: "Get Started",
    language: "Language",
    toggleTheme: "Toggle theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    badge: "The future of human resources",
    title1: "Human Resources.",
    title2: "Reimagined.",
    subtitle:
      "One intelligent platform to manage your people, streamline HR operations, automate approvals, and transform workforce insights into better decisions.",
    primary: "Get Started",
    secondary: "Explore Platform",
    benefits: ["Centralized HR Management", "Intelligent Workflows", "Real-Time Analytics"],
    totalEmployees: "Total employees",
    vsLastQuarter: "vs last quarter",
    workforceGrowth: "Workforce growth",
    departments: "Departments",
    onboarding: "Onboarding",
    onboardingOf: "tasks done",
    live: "Live",
    activity: ["Leave request approved", "New hire joined Engineering", "Contract awaiting HR validation"],
    statusApproved: "Approved",
    statusPending: "Pending",
  },
  overview: {
    eyebrow: "Platform",
    title1: "Everything HR needs.",
    title2: "One intelligent workspace.",
    desc: "IntelligenceHR centralizes employee records, HR operations, organizational structure, approvals and workforce analytics — so your team works from a single source of truth.",
    features: [
      { title: "People Management", desc: "Employee profiles, departments, positions, and lifecycle management." },
      { title: "Leave Management", desc: "Leave requests, balances, approvals, and tracking." },
      { title: "Onboarding & Offboarding", desc: "Structured employee journeys and task management." },
      { title: "E-Flow", desc: "Intelligent electronic workflow management." },
      { title: "E-Validation", desc: "Multi-step approval and validation processes." },
      { title: "Organigram", desc: "Interactive organizational hierarchy." },
      { title: "Roles & Permissions", desc: "Controlled access and centralized authorization." },
      { title: "HR Analytics", desc: "Dynamic insights and workforce reporting." },
    ],
  },
  analytics: {
    eyebrow: "Analytics",
    title1: "Your workforce.",
    title2: "Your insights.",
    title3: "In real time.",
    desc: "Track headcount, leave and onboarding in one live view. Switch the period to see every chart update.",
    demo: "Demo Analytics",
    growth: "Workforce growth",
    dept: "Department distribution",
    leave: "Leave analytics",
    status: "Employee status",
    onboarding: "Onboarding progress",
    total: "Total",
    active: "Active",
    onLeave: "On leave",
    newHires: "New hires",
    annual: "Annual",
    sick: "Sick",
    other: "Other",
    completed: "Completed",
    inProgress: "In progress",
    notStarted: "Not started",
    employees: "employees",
  },
  depts: { engineering: "Engineering", sales: "Sales", hr: "Human Resources", finance: "Finance", operations: "Operations" },
  lifecycle: {
    eyebrow: "How it works",
    title1: "From the first day",
    title2: "to every milestone.",
    desc: "Every stage of the employee journey, connected in one continuous flow.",
    step: "Step",
    stages: [
      { title: "Recruitment", desc: "Source, evaluate and hire the right talent.", points: ["Job requisitions", "Candidate pipeline", "Offer letters"] },
      { title: "Onboarding", desc: "Welcome new hires with structured journeys.", points: ["Checklists", "Document collection", "Buddy assignment"] },
      { title: "Employee Management", desc: "Keep every profile complete and current.", points: ["Profiles & contracts", "Positions", "Department moves"] },
      { title: "Performance", desc: "Align goals and track growth.", points: ["Objectives", "Reviews", "Feedback"] },
      { title: "Leave & Development", desc: "Balance time off and learning.", points: ["Leave balances", "Trainings", "Certifications"] },
      { title: "Offboarding", desc: "Close every departure cleanly.", points: ["Exit tasks", "Access revocation", "Final documents"] },
    ],
  },
  eflow: {
    eyebrow: "E-Flow & E-Validation",
    title1: "Approvals that move",
    title2: "at the speed of your business.",
    desc: "Design sequential or parallel validation circuits, notify the right people automatically and keep a full audit trail.",
    nodes: [
      { title: "Employee Request", desc: "Submitted by Sara M." },
      { title: "Manager Review", desc: "Youssef A. — Team lead" },
      { title: "HR Validation", desc: "HR & Finance in parallel" },
      { title: "Final Decision", desc: "Automatically notified" },
    ],
    sequential: "Sequential",
    parallel: "Parallel",
    history: "Workflow history",
    tracking: "Approval tracking",
    replay: "Replay workflow",
    approved: "Approved",
    pending: "Pending",
    inReview: "In review",
    waiting: "Waiting",
    requestTitle: "Annual leave — 5 days",
    requestMeta: "REQ-2048 · Engineering",
    historyItems: ["Request submitted", "Manager approved", "HR & Finance validated", "Decision sent to employee"],
    parallelItems: ["HR Department", "Finance", "Payroll"],
    notification: "Sara M. was notified: request approved",
  },
  org: {
    eyebrow: "Organigram",
    title: "See how your organization connects.",
    desc: "Navigate managers, departments and teams. Expand a branch to reveal who reports to whom.",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reset: "Reset zoom",
    reports: "reports",
    toggle: "Show or hide team",
    roles: {
      ceo: "Chief Executive Officer",
      cto: "Head of Engineering",
      cso: "Head of Sales",
      chro: "HR Director",
      cfo: "Finance Director",
      engineer: "Software Engineer",
      designer: "Product Designer",
      account: "Account Executive",
      recruiter: "Talent Recruiter",
      analyst: "Financial Analyst",
    },
  },
  portal: {
    eyebrow: "Self-service",
    title: "Empower every employee.",
    desc: "A personal space where employees request leave, follow approvals, complete tasks and stay informed — without emailing HR.",
    hello: "Good morning, Sara",
    welcome: "Here is what's happening today.",
    leaveBalance: "Leave balance",
    days: "days",
    annual: "Annual",
    sick: "Sick",
    requests: "My requests",
    profile: "Profile completion",
    profileHint: "Add your emergency contact",
    holidays: "Upcoming holidays",
    notifications: "Notifications",
    tasks: "Onboarding tasks",
    taskItems: ["Sign employment contract", "Upload ID document", "Complete security training", "Meet your HR partner"],
    holidayItems: ["Green March Day", "Independence Day", "New Year's Day"],
    notificationItems: ["Your leave request was approved", "New policy: remote work", "Payslip for October available"],
    requestItems: ["Annual leave · 5 days", "Remote work · 2 days", "Training · 1 day"],
    approved: "Approved",
    pending: "Pending",
    newRequest: "New request",
  },
  benefits: {
    eyebrow: "Why IntelligenceHR",
    title: "Less admin. More people.",
    desc: "Built to remove friction from every HR process.",
    items: [
      { title: "Centralized information", desc: "All employee data in one secure place." },
      { title: "Reduced admin workload", desc: "Automate repetitive tasks and paperwork." },
      { title: "Better workforce visibility", desc: "Live insights for confident decisions." },
      { title: "Structured processes", desc: "Consistent journeys for every employee." },
      { title: "Secure role-based access", desc: "Everyone sees exactly what they should." },
      { title: "Faster approvals", desc: "From days to minutes with E-Flow." },
      { title: "Better employee experience", desc: "Self-service that people enjoy using." },
    ],
  },
  cta: {
    title1: "Build a smarter",
    title2: "workplace today.",
    subtitle: "Bring your people, processes, and insights together with IntelligenceHR.",
    primary: "Get Started",
    secondary: "Explore Features",
  },
  footer: {
    desc: "The intelligent HR platform for people, processes and insights.",
    product: "Product",
    modules: "Modules",
    contact: "Contact",
    rights: "All rights reserved.",
    address: "Casablanca, Morocco",
    email: "hello@intelligencehr.com",
    phone: "+212 5 00 00 00 00",
  },
};

const fr: LandingDictionary = {
  nav: {
    home: "Accueil",
    features: "Fonctionnalités",
    modules: "Modules",
    how: "Fonctionnement",
    analytics: "Analyses",
    contact: "Contact",
    signIn: "Connexion",
    getStarted: "Commencer",
    language: "Langue",
    toggleTheme: "Changer de thème",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  hero: {
    badge: "L'avenir des ressources humaines",
    title1: "Ressources Humaines.",
    title2: "Réinventées.",
    subtitle:
      "Une plateforme intelligente pour gérer vos collaborateurs, simplifier les opérations RH, automatiser les validations et transformer les données en meilleures décisions.",
    primary: "Commencer",
    secondary: "Découvrir la plateforme",
    benefits: ["Gestion RH centralisée", "Workflows intelligents", "Analyses en temps réel"],
    totalEmployees: "Effectif total",
    vsLastQuarter: "vs trimestre précédent",
    workforceGrowth: "Croissance de l'effectif",
    departments: "Départements",
    onboarding: "Intégration",
    onboardingOf: "tâches terminées",
    live: "En direct",
    activity: ["Demande de congé approuvée", "Nouvelle recrue en Ingénierie", "Contrat en attente de validation RH"],
    statusApproved: "Approuvé",
    statusPending: "En attente",
  },
  overview: {
    eyebrow: "Plateforme",
    title1: "Tout ce dont les RH ont besoin.",
    title2: "Un espace de travail intelligent.",
    desc: "IntelligenceHR centralise les dossiers des collaborateurs, les opérations RH, la structure organisationnelle, les validations et les analyses — une source unique de vérité.",
    features: [
      { title: "Gestion des collaborateurs", desc: "Profils, départements, postes et cycle de vie." },
      { title: "Gestion des congés", desc: "Demandes, soldes, validations et suivi." },
      { title: "Intégration & Départ", desc: "Parcours structurés et gestion des tâches." },
      { title: "E-Flow", desc: "Gestion intelligente des workflows électroniques." },
      { title: "E-Validation", desc: "Processus de validation en plusieurs étapes." },
      { title: "Organigramme", desc: "Hiérarchie organisationnelle interactive." },
      { title: "Rôles & Permissions", desc: "Accès contrôlés et autorisations centralisées." },
      { title: "Analyses RH", desc: "Indicateurs dynamiques et reporting." },
    ],
  },
  analytics: {
    eyebrow: "Analyses",
    title1: "Vos équipes.",
    title2: "Vos indicateurs.",
    title3: "En temps réel.",
    desc: "Suivez l'effectif, les congés et l'intégration dans une vue unique. Changez la période pour voir chaque graphique se mettre à jour.",
    demo: "Analyses démo",
    growth: "Croissance de l'effectif",
    dept: "Répartition par département",
    leave: "Analyse des congés",
    status: "Statut des collaborateurs",
    onboarding: "Progression de l'intégration",
    total: "Total",
    active: "Actifs",
    onLeave: "En congé",
    newHires: "Recrues",
    annual: "Annuel",
    sick: "Maladie",
    other: "Autre",
    completed: "Terminé",
    inProgress: "En cours",
    notStarted: "Non commencé",
    employees: "collaborateurs",
  },
  depts: { engineering: "Ingénierie", sales: "Ventes", hr: "Ressources humaines", finance: "Finance", operations: "Opérations" },
  lifecycle: {
    eyebrow: "Fonctionnement",
    title1: "Du premier jour",
    title2: "à chaque étape clé.",
    desc: "Chaque étape du parcours collaborateur, reliée dans un flux continu.",
    step: "Étape",
    stages: [
      { title: "Recrutement", desc: "Attirer, évaluer et recruter les bons talents.", points: ["Demandes de poste", "Pipeline candidats", "Lettres d'offre"] },
      { title: "Intégration", desc: "Accueillir avec des parcours structurés.", points: ["Checklists", "Collecte de documents", "Parrainage"] },
      { title: "Gestion des collaborateurs", desc: "Des profils complets et à jour.", points: ["Profils & contrats", "Postes", "Mobilités"] },
      { title: "Performance", desc: "Aligner les objectifs et suivre la progression.", points: ["Objectifs", "Entretiens", "Feedback"] },
      { title: "Congés & Développement", desc: "Équilibrer repos et formation.", points: ["Soldes de congés", "Formations", "Certifications"] },
      { title: "Départ", desc: "Clôturer chaque départ proprement.", points: ["Tâches de sortie", "Révocation des accès", "Documents finaux"] },
    ],
  },
  eflow: {
    eyebrow: "E-Flow & E-Validation",
    title1: "Des validations qui avancent",
    title2: "au rythme de votre entreprise.",
    desc: "Concevez des circuits séquentiels ou parallèles, notifiez automatiquement les bonnes personnes et conservez un historique complet.",
    nodes: [
      { title: "Demande collaborateur", desc: "Soumise par Sara M." },
      { title: "Revue du manager", desc: "Youssef A. — Chef d'équipe" },
      { title: "Validation RH", desc: "RH & Finance en parallèle" },
      { title: "Décision finale", desc: "Notification automatique" },
    ],
    sequential: "Séquentiel",
    parallel: "Parallèle",
    history: "Historique du workflow",
    tracking: "Suivi des validations",
    replay: "Rejouer le workflow",
    approved: "Approuvé",
    pending: "En attente",
    inReview: "En revue",
    waiting: "En file",
    requestTitle: "Congé annuel — 5 jours",
    requestMeta: "REQ-2048 · Ingénierie",
    historyItems: ["Demande soumise", "Manager a approuvé", "RH & Finance ont validé", "Décision envoyée"],
    parallelItems: ["Département RH", "Finance", "Paie"],
    notification: "Sara M. a été notifiée : demande approuvée",
  },
  org: {
    eyebrow: "Organigramme",
    title: "Visualisez les liens de votre organisation.",
    desc: "Parcourez managers, départements et équipes. Dépliez une branche pour voir qui rapporte à qui.",
    zoomIn: "Zoom avant",
    zoomOut: "Zoom arrière",
    reset: "Réinitialiser",
    reports: "rattachés",
    toggle: "Afficher ou masquer l'équipe",
    roles: {
      ceo: "Directrice générale",
      cto: "Directeur technique",
      cso: "Directrice commerciale",
      chro: "Directrice RH",
      cfo: "Directeur financier",
      engineer: "Ingénieur logiciel",
      designer: "Designer produit",
      account: "Chargé de comptes",
      recruiter: "Recruteuse",
      analyst: "Analyste financier",
    },
  },
  portal: {
    eyebrow: "Libre-service",
    title: "Donnez le pouvoir à chaque collaborateur.",
    desc: "Un espace personnel pour demander des congés, suivre les validations, réaliser ses tâches et rester informé — sans écrire aux RH.",
    hello: "Bonjour, Sara",
    welcome: "Voici ce qui se passe aujourd'hui.",
    leaveBalance: "Solde de congés",
    days: "jours",
    annual: "Annuel",
    sick: "Maladie",
    requests: "Mes demandes",
    profile: "Profil complété",
    profileHint: "Ajoutez un contact d'urgence",
    holidays: "Jours fériés à venir",
    notifications: "Notifications",
    tasks: "Tâches d'intégration",
    taskItems: ["Signer le contrat", "Téléverser la pièce d'identité", "Formation sécurité", "Rencontrer votre RH"],
    holidayItems: ["Marche Verte", "Fête de l'Indépendance", "Nouvel An"],
    notificationItems: ["Votre congé a été approuvé", "Nouvelle politique : télétravail", "Bulletin d'octobre disponible"],
    requestItems: ["Congé annuel · 5 jours", "Télétravail · 2 jours", "Formation · 1 jour"],
    approved: "Approuvé",
    pending: "En attente",
    newRequest: "Nouvelle demande",
  },
  benefits: {
    eyebrow: "Pourquoi IntelligenceHR",
    title: "Moins d'administratif. Plus d'humain.",
    desc: "Conçu pour supprimer les frictions de chaque processus RH.",
    items: [
      { title: "Information centralisée", desc: "Toutes les données au même endroit, en sécurité." },
      { title: "Moins de charge administrative", desc: "Automatisez les tâches répétitives." },
      { title: "Meilleure visibilité", desc: "Des indicateurs en direct pour décider sereinement." },
      { title: "Processus structurés", desc: "Des parcours cohérents pour tous." },
      { title: "Accès sécurisé par rôle", desc: "Chacun voit exactement ce qu'il doit voir." },
      { title: "Validations plus rapides", desc: "De quelques jours à quelques minutes." },
      { title: "Expérience collaborateur", desc: "Un libre-service agréable à utiliser." },
    ],
  },
  cta: {
    title1: "Construisez un lieu de travail",
    title2: "plus intelligent dès aujourd'hui.",
    subtitle: "Réunissez vos collaborateurs, processus et indicateurs avec IntelligenceHR.",
    primary: "Commencer",
    secondary: "Voir les fonctionnalités",
  },
  footer: {
    desc: "La plateforme RH intelligente pour les personnes, les processus et les données.",
    product: "Produit",
    modules: "Modules",
    contact: "Contact",
    rights: "Tous droits réservés.",
    address: "Casablanca, Maroc",
    email: "hello@intelligencehr.com",
    phone: "+212 5 00 00 00 00",
  },
};

const ar: LandingDictionary = {
  nav: {
    home: "الرئيسية",
    features: "المميزات",
    modules: "الوحدات",
    how: "كيف يعمل",
    analytics: "التحليلات",
    contact: "اتصل بنا",
    signIn: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    language: "اللغة",
    toggleTheme: "تبديل المظهر",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
  },
  hero: {
    badge: "مستقبل الموارد البشرية",
    title1: "الموارد البشرية.",
    title2: "برؤية جديدة.",
    subtitle:
      "منصة ذكية واحدة لإدارة موظفيك، وتبسيط عمليات الموارد البشرية، وأتمتة الموافقات، وتحويل بيانات القوى العاملة إلى قرارات أفضل.",
    primary: "ابدأ الآن",
    secondary: "استكشف المنصة",
    benefits: ["إدارة مركزية للموارد البشرية", "سير عمل ذكي", "تحليلات فورية"],
    totalEmployees: "إجمالي الموظفين",
    vsLastQuarter: "مقارنة بالربع السابق",
    workforceGrowth: "نمو القوى العاملة",
    departments: "الأقسام",
    onboarding: "الإدماج",
    onboardingOf: "مهام منجزة",
    live: "مباشر",
    activity: ["تمت الموافقة على طلب إجازة", "موظف جديد في قسم الهندسة", "عقد بانتظار مصادقة الموارد البشرية"],
    statusApproved: "مقبول",
    statusPending: "قيد الانتظار",
  },
  overview: {
    eyebrow: "المنصة",
    title1: "كل ما تحتاجه الموارد البشرية.",
    title2: "في مساحة عمل ذكية واحدة.",
    desc: "تجمع IntelligenceHR ملفات الموظفين وعمليات الموارد البشرية والهيكل التنظيمي والموافقات والتحليلات في مصدر واحد موثوق.",
    features: [
      { title: "إدارة الموظفين", desc: "الملفات الشخصية والأقسام والمناصب ودورة الحياة." },
      { title: "إدارة الإجازات", desc: "الطلبات والأرصدة والموافقات والمتابعة." },
      { title: "الإدماج والمغادرة", desc: "مسارات منظمة وإدارة المهام." },
      { title: "E-Flow", desc: "إدارة ذكية لسير العمل الإلكتروني." },
      { title: "E-Validation", desc: "مسارات موافقة ومصادقة متعددة المراحل." },
      { title: "الهيكل التنظيمي", desc: "تسلسل هرمي تفاعلي للمؤسسة." },
      { title: "الأدوار والصلاحيات", desc: "وصول مضبوط وتفويض مركزي." },
      { title: "تحليلات الموارد البشرية", desc: "مؤشرات ديناميكية وتقارير." },
    ],
  },
  analytics: {
    eyebrow: "التحليلات",
    title1: "فريقك.",
    title2: "مؤشراتك.",
    title3: "في الوقت الفعلي.",
    desc: "تابع عدد الموظفين والإجازات والإدماج في عرض واحد. غيّر الفترة لترى تحديث كل الرسوم.",
    demo: "تحليلات تجريبية",
    growth: "نمو القوى العاملة",
    dept: "التوزيع حسب القسم",
    leave: "تحليل الإجازات",
    status: "حالة الموظفين",
    onboarding: "تقدم الإدماج",
    total: "الإجمالي",
    active: "نشط",
    onLeave: "في إجازة",
    newHires: "توظيفات جديدة",
    annual: "سنوية",
    sick: "مرضية",
    other: "أخرى",
    completed: "مكتمل",
    inProgress: "قيد التنفيذ",
    notStarted: "لم يبدأ",
    employees: "موظف",
  },
  depts: { engineering: "الهندسة", sales: "المبيعات", hr: "الموارد البشرية", finance: "المالية", operations: "العمليات" },
  lifecycle: {
    eyebrow: "كيف يعمل",
    title1: "من اليوم الأول",
    title2: "إلى كل محطة مهمة.",
    desc: "كل مرحلة من رحلة الموظف مترابطة في مسار واحد متواصل.",
    step: "المرحلة",
    stages: [
      { title: "التوظيف", desc: "استقطاب وتقييم وتوظيف المواهب المناسبة.", points: ["طلبات المناصب", "مسار المرشحين", "عروض العمل"] },
      { title: "الإدماج", desc: "استقبال الموظفين الجدد بمسارات منظمة.", points: ["قوائم المهام", "جمع الوثائق", "تعيين مرافق"] },
      { title: "إدارة الموظفين", desc: "ملفات كاملة ومحدثة دائماً.", points: ["الملفات والعقود", "المناصب", "التنقلات"] },
      { title: "الأداء", desc: "مواءمة الأهداف ومتابعة التطور.", points: ["الأهداف", "التقييمات", "الملاحظات"] },
      { title: "الإجازات والتطوير", desc: "توازن بين الراحة والتعلم.", points: ["أرصدة الإجازات", "التكوين", "الشهادات"] },
      { title: "المغادرة", desc: "إنهاء كل مغادرة بشكل سليم.", points: ["مهام المغادرة", "إلغاء الصلاحيات", "الوثائق النهائية"] },
    ],
  },
  eflow: {
    eyebrow: "E-Flow و E-Validation",
    title1: "موافقات تتحرك",
    title2: "بسرعة أعمالك.",
    desc: "صمّم مسارات مصادقة متسلسلة أو متوازية، وأبلغ الأشخاص المعنيين تلقائياً، واحتفظ بسجل كامل.",
    nodes: [
      { title: "طلب الموظف", desc: "مقدم من سارة م." },
      { title: "مراجعة المدير", desc: "يوسف أ. — قائد الفريق" },
      { title: "مصادقة الموارد البشرية", desc: "الموارد البشرية والمالية بالتوازي" },
      { title: "القرار النهائي", desc: "إشعار تلقائي" },
    ],
    sequential: "متسلسل",
    parallel: "متوازي",
    history: "سجل سير العمل",
    tracking: "تتبع الموافقات",
    replay: "إعادة تشغيل المسار",
    approved: "مقبول",
    pending: "قيد الانتظار",
    inReview: "قيد المراجعة",
    waiting: "في الانتظار",
    requestTitle: "إجازة سنوية — 5 أيام",
    requestMeta: "REQ-2048 · الهندسة",
    historyItems: ["تم تقديم الطلب", "وافق المدير", "صادقت الموارد البشرية والمالية", "أُرسل القرار للموظف"],
    parallelItems: ["قسم الموارد البشرية", "المالية", "الأجور"],
    notification: "تم إشعار سارة م.: الطلب مقبول",
  },
  org: {
    eyebrow: "الهيكل التنظيمي",
    title: "اكتشف كيف تترابط مؤسستك.",
    desc: "تصفح المدراء والأقسام والفرق. وسّع أي فرع لترى من يتبع لمن.",
    zoomIn: "تكبير",
    zoomOut: "تصغير",
    reset: "إعادة الضبط",
    reports: "تابعين",
    toggle: "إظهار أو إخفاء الفريق",
    roles: {
      ceo: "المديرة العامة",
      cto: "رئيس الهندسة",
      cso: "رئيسة المبيعات",
      chro: "مديرة الموارد البشرية",
      cfo: "المدير المالي",
      engineer: "مهندس برمجيات",
      designer: "مصمم منتجات",
      account: "مسؤول حسابات",
      recruiter: "مسؤولة توظيف",
      analyst: "محلل مالي",
    },
  },
  portal: {
    eyebrow: "الخدمة الذاتية",
    title: "مكّن كل موظف.",
    desc: "مساحة شخصية لطلب الإجازات ومتابعة الموافقات وإنجاز المهام والبقاء على اطلاع — دون مراسلة الموارد البشرية.",
    hello: "صباح الخير، سارة",
    welcome: "إليك ما يحدث اليوم.",
    leaveBalance: "رصيد الإجازات",
    days: "أيام",
    annual: "سنوية",
    sick: "مرضية",
    requests: "طلباتي",
    profile: "اكتمال الملف",
    profileHint: "أضف جهة اتصال للطوارئ",
    holidays: "العطل القادمة",
    notifications: "الإشعارات",
    tasks: "مهام الإدماج",
    taskItems: ["توقيع عقد العمل", "رفع بطاقة الهوية", "إكمال تدريب السلامة", "لقاء مسؤول الموارد البشرية"],
    holidayItems: ["ذكرى المسيرة الخضراء", "عيد الاستقلال", "رأس السنة الميلادية"],
    notificationItems: ["تمت الموافقة على إجازتك", "سياسة جديدة: العمل عن بعد", "كشف راتب أكتوبر متاح"],
    requestItems: ["إجازة سنوية · 5 أيام", "عمل عن بعد · يومان", "تكوين · يوم واحد"],
    approved: "مقبول",
    pending: "قيد الانتظار",
    newRequest: "طلب جديد",
  },
  benefits: {
    eyebrow: "لماذا IntelligenceHR",
    title: "إدارة أقل. اهتمام أكبر بالناس.",
    desc: "صُممت لإزالة التعقيد من كل عملية في الموارد البشرية.",
    items: [
      { title: "معلومات مركزية", desc: "كل بيانات الموظفين في مكان واحد آمن." },
      { title: "عبء إداري أقل", desc: "أتمتة المهام المتكررة والأوراق." },
      { title: "رؤية أوضح للقوى العاملة", desc: "مؤشرات فورية لقرارات واثقة." },
      { title: "عمليات منظمة", desc: "مسارات متسقة لكل موظف." },
      { title: "وصول آمن حسب الدور", desc: "كل شخص يرى ما يخصه فقط." },
      { title: "موافقات أسرع", desc: "من أيام إلى دقائق مع E-Flow." },
      { title: "تجربة موظف أفضل", desc: "خدمة ذاتية سهلة وممتعة." },
    ],
  },
  cta: {
    title1: "ابنِ بيئة عمل",
    title2: "أذكى اليوم.",
    subtitle: "اجمع موظفيك وعملياتك ومؤشراتك مع IntelligenceHR.",
    primary: "ابدأ الآن",
    secondary: "استكشف المميزات",
  },
  footer: {
    desc: "منصة الموارد البشرية الذكية للأشخاص والعمليات والبيانات.",
    product: "المنتج",
    modules: "الوحدات",
    contact: "اتصل بنا",
    rights: "جميع الحقوق محفوظة.",
    address: "الدار البيضاء، المغرب",
    email: "hello@intelligencehr.com",
    phone: "+212 5 00 00 00 00",
  },
};

export const landingTranslations: Record<LandingLanguage, LandingDictionary> = { en, fr, ar };

export const languageLabels: Record<LandingLanguage, string> = { en: "EN", fr: "FR", ar: "AR" };
