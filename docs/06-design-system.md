# PRD 06: Design System

## Overview

This document defines the visual design system for the Kickoff Deck mini app, including color tokens, typography, spacing, components, and animations.

---

## Color Tokens

### CSS Variables (index.css)

```css
@layer base {
  :root {
    /* Base colors */
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    
    /* Card surfaces */
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    
    /* Muted backgrounds */
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    
    /* Popover */
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    
    /* Primary brand color */
    --primary: 346 77% 50%;
    --primary-foreground: 0 0% 100%;
    
    /* Secondary accent */
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    
    /* Accent for highlights */
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    
    /* Destructive actions */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    
    /* Borders and inputs */
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 346 77% 50%;
    
    /* Custom deck colors */
    --deck-surface: 40 33% 96%;
    --deck-border: 40 20% 90%;
    --deck-completed: 142 71% 45%;
    --deck-current: 346 77% 50%;
    --deck-upcoming: 240 4.8% 85%;
    
    /* Radius */
    --radius: 0.5rem;
  }
  
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    
    --card: 240 10% 7%;
    --card-foreground: 0 0% 98%;
    
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    
    --primary: 346 77% 55%;
    --primary-foreground: 0 0% 100%;
    
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    
    --destructive: 0 62.8% 50.6%;
    --destructive-foreground: 0 0% 98%;
    
    --border: 240 3.7% 20%;
    --input: 240 3.7% 20%;
    --ring: 346 77% 55%;
    
    --deck-surface: 240 10% 10%;
    --deck-border: 240 3.7% 25%;
  }
}
```

### Tailwind Config

```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        deck: {
          surface: "hsl(var(--deck-surface))",
          border: "hsl(var(--deck-border))",
          completed: "hsl(var(--deck-completed))",
          current: "hsl(var(--deck-current))",
          upcoming: "hsl(var(--deck-upcoming))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## Typography

### Font Stack

```css
/* In index.css or global styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Type Scale

| Element | Class | Size | Weight | Line Height |
|---------|-------|------|--------|-------------|
| Display | `text-5xl` | 3rem | 700 | 1.2 |
| H1 | `text-4xl` | 2.25rem | 700 | 1.3 |
| H2 | `text-3xl` | 1.875rem | 600 | 1.35 |
| H3 | `text-2xl` | 1.5rem | 600 | 1.4 |
| H4 | `text-xl` | 1.25rem | 600 | 1.4 |
| Body Large | `text-lg` | 1.125rem | 400 | 1.6 |
| Body | `text-base` | 1rem | 400 | 1.6 |
| Small | `text-sm` | 0.875rem | 400 | 1.5 |
| Caption | `text-xs` | 0.75rem | 500 | 1.4 |

### Presentation Typography

```tsx
// Presentation-specific text styles
const presentationTypography = {
  slideTitle: "text-4xl md:text-5xl font-bold tracking-tight",
  slideSubtitle: "text-xl md:text-2xl text-muted-foreground font-medium",
  sectionTitle: "text-2xl md:text-3xl font-semibold",
  cardTitle: "text-lg font-semibold",
  bodyText: "text-base text-muted-foreground leading-relaxed",
  label: "text-sm font-medium text-muted-foreground uppercase tracking-wide",
};
```

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 0.25rem (4px) | Tight gaps |
| `space-2` | 0.5rem (8px) | Small gaps |
| `space-3` | 0.75rem (12px) | Component padding |
| `space-4` | 1rem (16px) | Standard gap |
| `space-6` | 1.5rem (24px) | Section spacing |
| `space-8` | 2rem (32px) | Large gaps |
| `space-12` | 3rem (48px) | Slide padding |
| `space-16` | 4rem (64px) | Major sections |

---

## Component Patterns

### Card Variants

```tsx
// src/components/ui/deck-card.tsx

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const deckCardVariants = cva(
  "rounded-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        surface: "bg-deck-surface border-deck-border",
        elevated: "bg-card border-border shadow-lg",
        interactive: "bg-card border-border hover:border-primary hover:shadow-md cursor-pointer",
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

interface DeckCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof deckCardVariants> {}

export function DeckCard({ className, variant, padding, ...props }: DeckCardProps) {
  return (
    <div
      className={cn(deckCardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}
```

### Status Badges

```tsx
// src/components/ui/status-badge.tsx

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      status: {
        completed: "bg-deck-completed/10 text-deck-completed",
        active: "bg-deck-current/10 text-deck-current",
        pending: "bg-deck-upcoming/20 text-muted-foreground",
        draft: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean;
}

export function StatusBadge({ className, status, showDot = true, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {showDot && (
        <span className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "completed" && "bg-deck-completed",
          status === "active" && "bg-deck-current",
          status === "pending" && "bg-muted-foreground",
          status === "draft" && "bg-muted-foreground"
        )} />
      )}
      {children}
    </span>
  );
}
```

---

## Animation Patterns

### Framer Motion Variants

```typescript
// src/lib/animations.ts

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const slideInFromBottom = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

// Slide transitions
export const slideTransition = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { 
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
};
```

### Usage in Components

```tsx
import { motion } from "framer-motion";
import { slideInFromBottom, staggerContainer, staggerItem } from "@/lib/animations";

function AnimatedList({ items }) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {items.map((item) => (
        <motion.li key={item.id} variants={staggerItem}>
          {item.content}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

---

## Slide Layouts

### Layout Components

```tsx
// src/components/presentation/layouts/TwoColumnLayout.tsx

interface TwoColumnLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: "equal" | "wide-left" | "wide-right";
}

export function TwoColumnLayout({ left, right, ratio = "equal" }: TwoColumnLayoutProps) {
  const gridClass = {
    equal: "grid-cols-2",
    "wide-left": "grid-cols-[1.5fr_1fr]",
    "wide-right": "grid-cols-[1fr_1.5fr]",
  }[ratio];

  return (
    <div className={`grid ${gridClass} gap-12 h-full`}>
      <div className="flex flex-col justify-center">{left}</div>
      <div className="flex flex-col justify-center">{right}</div>
    </div>
  );
}

// src/components/presentation/layouts/GridLayout.tsx

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export function GridLayout({ children, columns = 3, gap = "md" }: GridLayoutProps) {
  const gapClass = { sm: "gap-4", md: "gap-6", lg: "gap-8" }[gap];
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return <div className={`grid ${colClass} ${gapClass}`}>{children}</div>;
}
```

---

## Background Patterns

```tsx
// src/components/presentation/SlideBackground.tsx

import { cn } from "@/lib/utils";

interface SlideBackgroundProps {
  variant?: "default" | "gradient" | "dots" | "grid";
  className?: string;
}

export function SlideBackground({ variant = "default", className }: SlideBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 -z-10", className)}>
      {variant === "gradient" && (
        <>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-secondary/5 to-transparent" />
        </>
      )}
      
      {variant === "dots" && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      )}
      
      {variant === "grid" && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      )}
    </div>
  );
}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Presentation Mode Considerations

Presentations should be optimized for:
- **Primary**: 16:9 aspect ratio (1920×1080)
- **Secondary**: 4:3 aspect ratio (1024×768)

```tsx
// Responsive slide content
<div className="px-8 md:px-12 lg:px-16 py-8 md:py-12">
  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
    Slide Title
  </h1>
</div>
```

---

## Accessibility

### Focus States

```css
/* Global focus styles */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Custom focus for cards */
.deck-card:focus-visible {
  ring: 2px;
  ring-color: hsl(var(--primary));
  ring-offset: 2px;
}
```

### Color Contrast

- All text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have visible focus states
- Status colors should not rely solely on color (include icons/text)

### Screen Reader Support

```tsx
// Example: Accessible status indicator
<StatusBadge status="completed">
  <span className="sr-only">Status:</span>
  Completed
</StatusBadge>

// Example: Accessible icon button
<Button variant="ghost" size="icon" aria-label="Edit slide">
  <Pencil className="h-4 w-4" />
</Button>
```
