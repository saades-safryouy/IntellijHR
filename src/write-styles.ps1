@import  tailwindcss source(none);
@source ../src;
@import tw-animate-css;

@custom-variant dark (&:is(.dark *));

/*
 * IntelligenceHR Unified Design System
 * 
 * This file contains the complete design token system shared between
 * the landing page and the authenticated application.
 * 
 * All colors use oklch format for perceptual uniformity.
 * Light and dark themes are defined in :root and .dark blocks.
 */

@theme inline {
  /* Border radius scale */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
  
  /* Semantic color tokens */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  
  /* IntelligenceHR Brand Tokens - Unified Design System */
  --color-ihr-bg: var(--ihr-bg);
  --color-ihr-bg-soft: var(--ihr-bg-soft);
  --color-ihr-card: var(--ihr-card);
  --color-ihr-card-2: var(--ihr-card-2);
  --color-ihr-fg: var(--ihr-fg);
  --color-ihr-muted: var(--ihr-muted);
  --color-ihr-border: var(--ihr-border);
  --color-ihr-primary: var(--ihr-primary);
  --color-ihr-secondary: var(--ihr-secondary);
  --color-ihr-on-primary: var(--ihr-on-primary);
  --color-ihr-success: var(--ihr-success);
  --color-ihr-warning: var(--ihr-warning);
  --color-ihr-danger: var(--ihr-danger);
  --color-ihr-violet: var(--ihr-violet);
  --color-ihr-cyan: var(--ihr-cyan);
  --font-ihr: var(--font-ihr);
  --font-ihr-ar: var(--font-ihr-ar);
  --color-ihr-grid-line: var(--ihr-grid-line);
  --color-ihr-glass: var(--ihr-glass);
  --color-ihr-glow: var(--ihr-glow);
  --shadow-ihr: var(--ihr-shadow);
  --shadow-ihr-primary: var(--ihr-shadow-primary);
  
  /* Animations */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
  --animate-caret-blink: caret-blink 1.25s ease-out infinite;
  --animate-shimmer: shimmer 8s ease-in-out infinite;
  --animate-scroll: scroll var(--animation-duration, 20s) linear infinite;
}

/* ───────── Light Theme (Default) ───────── */
:root {
  /* Base radius */
  --radius: 0.75rem;
  
  /* IntelligenceHR Brand Colors - Light */
  --ihr-bg: oklch(0.985 0.003 247);
  --ihr-bg-soft: oklch(0.968 0.007 247);
  --ihr-card: oklch(1 0 0);
  --ihr-card-2: oklch(0.975 0.006 250);
  --ihr-fg: oklch(0.208 0.042 265.7);
  --ihr-muted: oklch(0.554 0.046 257.4);
  --ihr-border: oklch(0.929 0.013 255.5);
  --ihr-primary: oklch(0.546 0.215 262.9);
  --ihr-secondary: oklch(0.623 0.188 259.8);
  --ihr-on-primary: oklch(1 0 0);
  --ihr-success: oklch(0.65 0.15 160);
  --ihr-warning: oklch(0.76 0.16 70);
  --ihr-danger: oklch(0.63 0.21 25);
  --ihr-violet: oklch(0.6 0.18 285);
  --ihr-cyan: oklch(0.72 0.13 215);
  
  /* Derived semantic tokens */
  --background: var(--ihr-bg);
  --foreground: var(--ihr-fg);
  --card: var(--ihr-card);
  --card-foreground: var(--ihr-fg);
  --popover: var(--ihr-card);
  --popover-foreground: var(--ihr-fg);
  --primary: var(--ihr-primary);
  --primary-foreground: var(--ihr-on-primary);
  --secondary: var(--ihr-bg-soft);
  --secondary-foreground: var(--ihr-fg);
  --muted: var(--ihr-bg-soft);
  --muted-foreground: var(--ihr-muted);
  --accent: var(--ihr-bg-soft);
  --accent-foreground: var(--ihr-fg);
  --destructive: var(--ihr-danger);
  --destructive-foreground: var(--ihr-on-primary);
  --border: var(--ihr-border);
  --input: var(--ihr-border);
  --ring: var(--ihr-primary);
  
  /* Chart colors */
  --chart-1: var(--ihr-primary);
  --chart-2: var(--ihr-cyan);
  --chart-3: var(--ihr-success);
  --chart-4: var(--ihr-warning);
  --chart-5: var(--ihr-violet);
  
  /* Sidebar colors */
  --sidebar: var(--ihr-card);
  --sidebar-foreground: var(--ihr-fg);
  --sidebar-primary: var(--ihr-primary);
  --sidebar-primary-foreground: var(--ihr-on-primary);
  --sidebar-accent: var(--ihr-bg-soft);
  --sidebar-accent-foreground: var(--ihr-fg);
  --sidebar-border: var(--ihr-border);
  --sidebar-ring: var(--ihr-primary);
  
  /* Effects */
  --ihr-grid-line: oklch(0.208 0.042 265.7 / 0.06);
  --ihr-glass: oklch(1 0 0 / 0.72);
  --ihr-glow: oklch(0.623 0.188 259.8 / 0.25);
  --ihr-shadow: 0 1px 2px oklch(0.2 0.04 265 / 0.04), 0 12px 40px -12px oklch(0.2 0.04 265 / 0.15);
  --ihr-shadow-primary: 0 10px 30px -10px oklch(0.546 0.215 262.9 / 0.55);
  
  /* Fonts */
  --font-ihr: Figtree, Inter, ui-sans-serif, system-ui, sans-serif;
  --font-ihr-ar: Cairo, Figtree, ui-sans-serif, sans-serif;
}

/* ───────── Dark Theme ───────── */
.dark {
  --ihr-bg: oklch(0.155 0.03 258);
  --ihr-bg-soft: oklch(0.18 0.032 262);
  --ihr-card: oklch(0.185 0.03 265);
  --ihr-card-2: oklch(0.21 0.04 262);
  --ihr-fg: oklch(0.99 0 0);
  --ihr-muted: oklch(0.71 0.035 256);
  --ihr-border: oklch(1 0 0 / 0.1);
  --ihr-primary: oklch(0.546 0.215 262.9);
  --ihr-secondary: oklch(0.66 0.18 259.8);
  --ihr-on-primary: oklch(1 0 0);
  --ihr-success: oklch(0.65 0.15 160);
  --ihr-warning: oklch(0.76 0.16 70);
  --ihr-danger: oklch(0.63 0.21 25);
  --ihr-violet: oklch(0.6 0.18 285);
  --ihr-cyan: oklch(0.72 0.13 215);
  
  /* Derived semantic tokens (dark) */
  --background: var(--ihr-bg);
  --foreground: var(--ihr-fg);
  --card: var(--ihr-card);
  --card-foreground: var(--ihr-fg);
  --popover: var(--ihr-card);
  --popover-foreground: var(--ihr-fg);
  --primary: var(--ihr-primary);
  --primary-foreground: var(--ihr-on-primary);
  --secondary: var(--ihr-bg-soft);
  --secondary-foreground: var(--ihr-fg);
  --muted: var(--ihr-bg-soft);
  --muted-foreground: var(--ihr-muted);
  --accent: var(--ihr-bg-soft);
  --accent-foreground: var(--ihr-fg);
  --destructive: var(--ihr-danger);
  --destructive-foreground: var(--ihr-on-primary);
  --border: var(--ihr-border);
  --input: var(--ihr-border);
  --ring: var(--ihr-primary);
  
  /* Chart colors */
  --chart-1: var(--ihr-primary);
  --chart-2: var(--ihr-cyan);
  --chart-3: var(--ihr-success);
  --chart-4: var(--ihr-warning);
  --chart-5: var(--ihr-violet);
  
  /* Sidebar colors */
  --sidebar: var(--ihr-card);
  --sidebar-foreground: var(--ihr-fg);
  --sidebar-primary: var(--ihr-primary);
  --sidebar-primary-foreground: var(--ihr-on-primary);
  --sidebar-accent: var(--ihr-bg-soft);
  --sidebar-accent-foreground: var(--ihr-fg);
  --sidebar-border: var(--ihr-border);
  --sidebar-ring: var(--ihr-primary);
  
  /* Effects */
  --ihr-grid-line: oklch(1 0 0 / 0.05);
  --ihr-glass: oklch(0.185 0.03 265 / 0.6);
  --ihr-glow: oklch(0.546 0.215 262.9 / 0.35);
  --ihr-shadow: 0 1px 0 oklch(1 0 0 / 0.04) inset, 0 20px 50px -20px oklch(0 0 0 / 0.7);
  --ihr-shadow-primary: 0 10px 30px -10px oklch(0.546 0.215 262.9 / 0.55);
}

/* ───────── RTL Support ───────── */
[dir=rtl] {
  --font-ihr: var(--font-ihr-ar);
}

/* ───────── Global Base Styles ───────── */
* {
  box-sizing: border-box;
}

html {
  font-family: var(--font-ihr);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-ihr);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ───────── Utility Classes (from landing page) ───────── */
@utility ihr-grid {
  background-image:
    linear-gradient(to right, var(--ihr-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ihr-grid-line) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
}

@utility ihr-glass {
  background: var(--ihr-glass);
  backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid var(--ihr-border);
  box-shadow: var(--ihr-shadow);
}

@utility ihr-card {
  background: var(--ihr-card);
  border: 1px solid var(--ihr-border);
  box-shadow: var(--ihr-shadow);
}

@utility ihr-card-hover {
  background: var(--ihr-card);
  border: 1px solid var(--ihr-border);
  box-shadow: var(--ihr-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

@utility ihr-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--ihr-shadow-primary);
  border-color: var(--ihr-primary);
}

@utility ihr-gradient-text {
  background: linear-gradient(100deg, var(--ihr-primary), var(--ihr-cyan), var(--ihr-secondary), var(--ihr-primary));
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ihr-shine 8s linear infinite;
}

@utility ihr-btn-primary {
  background: linear-gradient(135deg, var(--ihr-primary), var(--ihr-secondary));
  color: var(--ihr-on-primary);
  box-shadow: var(--ihr-shadow-primary);
}

@utility ihr-glow {
  background: radial-gradient(closest-side, var(--ihr-glow), transparent);
}

@utility ihr-focus-ring {
  outline: none;
  ring: 2px;
  ring-color: var(--ihr-primary);
  ring-offset: 2px;
  ring-offset-color: var(--background);
}

/* ───────── Animations ───────── */
@keyframes ihr-shine { to { background-position: 300% 0; } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ───────── Focus Visible Styles ───────── */
:focus-visible {
  outline: 2px solid var(--ihr-primary);
  outline-offset: 2px;
}

/* ───────── Scrollbar Styles ───────── */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--ihr-bg-soft);
}

::-webkit-scrollbar-thumb {
  background: var(--ihr-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--ihr-muted);
}

