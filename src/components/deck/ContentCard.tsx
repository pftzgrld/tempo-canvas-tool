import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/**
 * Standardized content card for all deck sections.
 * This is the single source of truth for card styling across the app.
 * Matches the Executive Summary card styling exactly.
 */
interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional label text shown at top of card */
  label?: string;
  /** Whether to show the label in primary color */
  labelPrimary?: boolean;
  /** Size variant for padding */
  size?: "sm" | "md" | "lg";
  /** Whether this card is interactive/clickable */
  interactive?: boolean;
}

export const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
  ({ className, label, labelPrimary = true, size = "md", interactive = true, children, ...props }, ref) => {
    const paddingClass = {
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
    }[size];

    return (
      <div
        ref={ref}
        className={cn(
          // Base card styling - matches Executive Summary cards exactly
          "rounded-2xl border transition-all duration-300",
          "bg-white/90 dark:bg-white/10 border-foreground/5 shadow-xl backdrop-blur-sm",
          // Hover effects
          interactive && "hover:scale-[1.02] hover:shadow-2xl hover:bg-white dark:hover:bg-white/15",
          paddingClass,
          className
        )}
        {...props}
      >
        {label && (
          <span className={cn(
            "label-text mb-3 block",
            labelPrimary ? "text-primary" : "text-muted-foreground"
          )}>
            {label}
          </span>
        )}
        {children}
      </div>
    );
  }
);

ContentCard.displayName = "ContentCard";

/**
 * Card title - consistent across all cards
 */
export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("font-serif-display text-xl font-medium mb-3", className)}>
      {children}
    </h3>
  );
}

/**
 * Card description - consistent body text
 */
export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-serif-body text-muted-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

/**
 * Card body text - smaller than description
 */
export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm font-serif-body text-muted-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

/**
 * Card subtitle/metadata - small text
 */
export function CardMeta({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-muted-foreground font-sans-ui", className)}>
      {children}
    </p>
  );
}
