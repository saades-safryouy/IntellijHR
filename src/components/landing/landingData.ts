export type DeptKey = "engineering" | "sales" | "hr" | "finance" | "operations";
export type TimeRange = "7D" | "30D" | "90D" | "1Y";

export const TIME_RANGES: TimeRange[] = ["7D", "30D", "90D", "1Y"];

/** CSS variables used for each department (keeps colors theme-aware). */
export const deptColors: Record<DeptKey, string> = {
  engineering: "var(--ihr-primary)",
  sales: "var(--ihr-cyan)",
  hr: "var(--ihr-violet)",
  finance: "var(--ihr-success)",
  operations: "var(--ihr-warning)",
};

export const NAV_SECTIONS = [
  { id: "home", key: "home" },
  { id: "features", key: "features" },
  { id: "modules", key: "modules" },
  { id: "how-it-works", key: "how" },
  { id: "analytics", key: "analytics" },
  { id: "contact", key: "contact" },
] as const;

export const heroGrowth = [
  { m: "Jan", v: 1040 },
  { m: "Feb", v: 1068 },
  { m: "Mar", v: 1092 },
  { m: "Apr", v: 1110 },
  { m: "May", v: 1149 },
  { m: "Jun", v: 1181 },
  { m: "Jul", v: 1204 },
  { m: "Aug", v: 1248 },
];

export const heroDepartments: { key: DeptKey; value: number }[] = [
  { key: "engineering", value: 412 },
  { key: "sales", value: 286 },
  { key: "operations", value: 238 },
  { key: "finance", value: 164 },
  { key: "hr", value: 148 },
];

interface AnalyticsSet {
  growth: { label: string; headcount: number; hires: number }[];
  departments: { key: DeptKey; value: number }[];
  leave: { label: string; annual: number; sick: number; other: number }[];
  status: { total: number; active: number; onLeave: number; newHires: number };
  onboarding: { completed: number; inProgress: number; notStarted: number };
}

export const analyticsData: Record<TimeRange, AnalyticsSet> = {
  "7D": {
    growth: [
      { label: "Mon", headcount: 1236, hires: 2 },
      { label: "Tue", headcount: 1238, hires: 3 },
      { label: "Wed", headcount: 1240, hires: 1 },
      { label: "Thu", headcount: 1241, hires: 4 },
      { label: "Fri", headcount: 1245, hires: 2 },
      { label: "Sat", headcount: 1246, hires: 0 },
      { label: "Sun", headcount: 1248, hires: 1 },
    ],
    departments: [
      { key: "engineering", value: 412 },
      { key: "sales", value: 286 },
      { key: "operations", value: 238 },
      { key: "finance", value: 164 },
      { key: "hr", value: 148 },
    ],
    leave: [
      { label: "Mon", annual: 18, sick: 4, other: 2 },
      { label: "Tue", annual: 15, sick: 6, other: 1 },
      { label: "Wed", annual: 12, sick: 3, other: 3 },
      { label: "Thu", annual: 20, sick: 5, other: 2 },
      { label: "Fri", annual: 26, sick: 4, other: 4 },
    ],
    status: { total: 1248, active: 1176, onLeave: 59, newHires: 13 },
    onboarding: { completed: 9, inProgress: 3, notStarted: 1 },
  },
  "30D": {
    growth: [
      { label: "W1", headcount: 1214, hires: 9 },
      { label: "W2", headcount: 1222, hires: 11 },
      { label: "W3", headcount: 1235, hires: 14 },
      { label: "W4", headcount: 1248, hires: 13 },
    ],
    departments: [
      { key: "engineering", value: 412 },
      { key: "sales", value: 286 },
      { key: "operations", value: 238 },
      { key: "finance", value: 164 },
      { key: "hr", value: 148 },
    ],
    leave: [
      { label: "W1", annual: 64, sick: 18, other: 7 },
      { label: "W2", annual: 58, sick: 22, other: 9 },
      { label: "W3", annual: 71, sick: 15, other: 6 },
      { label: "W4", annual: 82, sick: 19, other: 11 },
    ],
    status: { total: 1248, active: 1163, onLeave: 47, newHires: 38 },
    onboarding: { completed: 26, inProgress: 9, notStarted: 3 },
  },
  "90D": {
    growth: [
      { label: "Jun", headcount: 1181, hires: 34 },
      { label: "Jul", headcount: 1204, hires: 31 },
      { label: "Aug", headcount: 1248, hires: 52 },
    ],
    departments: [
      { key: "engineering", value: 398 },
      { key: "sales", value: 279 },
      { key: "operations", value: 231 },
      { key: "finance", value: 160 },
      { key: "hr", value: 145 },
    ],
    leave: [
      { label: "Jun", annual: 210, sick: 62, other: 28 },
      { label: "Jul", annual: 318, sick: 48, other: 31 },
      { label: "Aug", annual: 356, sick: 51, other: 25 },
    ],
    status: { total: 1248, active: 1131, onLeave: 64, newHires: 117 },
    onboarding: { completed: 94, inProgress: 17, notStarted: 6 },
  },
  "1Y": {
    growth: [
      { label: "Sep", headcount: 968, hires: 22 },
      { label: "Oct", headcount: 985, hires: 25 },
      { label: "Nov", headcount: 1002, hires: 24 },
      { label: "Dec", headcount: 1011, hires: 14 },
      { label: "Jan", headcount: 1040, hires: 38 },
      { label: "Feb", headcount: 1068, hires: 33 },
      { label: "Mar", headcount: 1092, hires: 30 },
      { label: "Apr", headcount: 1110, hires: 26 },
      { label: "May", headcount: 1149, hires: 44 },
      { label: "Jun", headcount: 1181, hires: 34 },
      { label: "Jul", headcount: 1204, hires: 31 },
      { label: "Aug", headcount: 1248, hires: 52 },
    ],
    departments: [
      { key: "engineering", value: 356 },
      { key: "sales", value: 251 },
      { key: "operations", value: 214 },
      { key: "finance", value: 151 },
      { key: "hr", value: 136 },
    ],
    leave: [
      { label: "Q4", annual: 640, sick: 190, other: 74 },
      { label: "Q1", annual: 520, sick: 210, other: 66 },
      { label: "Q2", annual: 610, sick: 150, other: 81 },
      { label: "Q3", annual: 884, sick: 161, other: 84 },
    ],
    status: { total: 1248, active: 1102, onLeave: 51, newHires: 373 },
    onboarding: { completed: 341, inProgress: 24, notStarted: 8 },
  },
};

export type RoleKey =
  | "ceo"
  | "cto"
  | "cso"
  | "chro"
  | "cfo"
  | "engineer"
  | "designer"
  | "account"
  | "recruiter"
  | "analyst";

export interface OrgNode {
  id: string;
  name: string;
  role: RoleKey;
  dept: DeptKey | "executive";
  children?: OrgNode[];
}

export const orgTree: OrgNode = {
  id: "ceo",
  name: "Leila Benali",
  role: "ceo",
  dept: "executive",
  children: [
    {
      id: "cto",
      name: "Karim Haddad",
      role: "cto",
      dept: "engineering",
      children: [
        { id: "e1", name: "Youssef Amrani", role: "engineer", dept: "engineering" },
        { id: "e2", name: "Inès Morel", role: "designer", dept: "engineering" },
        { id: "e3", name: "Omar Tazi", role: "engineer", dept: "engineering" },
      ],
    },
    {
      id: "cso",
      name: "Claire Dubois",
      role: "cso",
      dept: "sales",
      children: [
        { id: "s1", name: "Mehdi Alaoui", role: "account", dept: "sales" },
        { id: "s2", name: "Nora Fassi", role: "account", dept: "sales" },
      ],
    },
    {
      id: "chro",
      name: "Sara Mansouri",
      role: "chro",
      dept: "hr",
      children: [{ id: "h1", name: "Amina Idrissi", role: "recruiter", dept: "hr" }],
    },
    {
      id: "cfo",
      name: "Hugo Laurent",
      role: "cfo",
      dept: "finance",
      children: [{ id: "f1", name: "Rachid Bennis", role: "analyst", dept: "finance" }],
    },
  ],
};

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
