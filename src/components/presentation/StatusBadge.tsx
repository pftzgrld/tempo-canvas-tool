import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Circle, AlertTriangle, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Standardized status values used across all slides
 */
export type StandardStatus = 
  | "completed" 
  | "in-progress" 
  | "planned" 
  | "at-risk" 
  | "on-hold"
  | "stable";

/**
 * Maps various status values from the database to standardized values
 */
export function normalizeStatus(status: string | null | undefined): StandardStatus {
  const statusMap: Record<string, StandardStatus> = {
    // Completed variants
    "completed": "completed",
    "done": "completed",
    "finished": "completed",
    // In progress variants
    "in-progress": "in-progress",
    "active": "in-progress",
    "in_progress": "in-progress",
    "current": "in-progress",
    // Planned variants
    "planned": "planned",
    "not-started": "planned",
    "not_started": "planned",
    "upcoming": "planned",
    "pending": "planned",
    // At risk variants
    "at-risk": "at-risk",
    "at_risk": "at-risk",
    "off-track": "at-risk",
    "off_track": "at-risk",
    "blocked": "at-risk",
    // On hold variants
    "on-hold": "on-hold",
    "on_hold": "on-hold",
    "paused": "on-hold",
    // Stable
    "stable": "stable",
    "on-track": "stable",
    "on_track": "stable",
  };
  
  return statusMap[status?.toLowerCase() || ""] || "planned";
}

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  className: string;
  iconClassName: string;
}

/**
 * Standardized status configurations
 */
export const STATUS_CONFIG: Record<StandardStatus, StatusConfig> = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-deck-completed/15 text-deck-completed border-deck-completed/20",
    iconClassName: "text-deck-completed",
  },
  "in-progress": {
    label: "In Progress",
    icon: Loader2,
    className: "bg-primary/15 text-primary border-primary/20",
    iconClassName: "text-primary",
  },
  planned: {
    label: "Planned",
    icon: Circle,
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
    iconClassName: "text-muted-foreground",
  },
  "at-risk": {
    label: "At Risk",
    icon: AlertTriangle,
    className: "bg-destructive/15 text-destructive border-destructive/20",
    iconClassName: "text-destructive",
  },
  "on-hold": {
    label: "On Hold",
    icon: Minus,
    className: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-500 border-yellow-500/20",
    iconClassName: "text-yellow-600 dark:text-yellow-500",
  },
  stable: {
    label: "On Track",
    icon: CheckCircle2,
    className: "bg-deck-completed/15 text-deck-completed border-deck-completed/20",
    iconClassName: "text-deck-completed",
  },
};

interface StatusBadgeProps {
  status: string | null | undefined;
  showIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Standardized status badge component for consistent styling across all slides
 */
export function StatusBadge({ 
  status, 
  showIcon = false, 
  size = "sm",
  className 
}: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus];
  const Icon = config.icon;

  return (
    <Badge 
      className={cn(
        "font-sans-ui font-medium border gap-1.5",
        size === "sm" && "text-[10px] px-2.5 py-0.5",
        size === "md" && "text-xs px-3 py-1",
        config.className,
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(
          "shrink-0",
          size === "sm" && "h-3 w-3",
          size === "md" && "h-3.5 w-3.5",
          normalizedStatus === "in-progress" && "animate-spin"
        )} />
      )}
      {config.label}
    </Badge>
  );
}

interface StatusIconProps {
  status: string | null | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
  showBackground?: boolean;
}

/**
 * Standalone status icon with optional background
 */
export function StatusIcon({ 
  status, 
  size = "md", 
  className,
  showBackground = true 
}: StatusIconProps) {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus];
  const Icon = config.icon;

  const iconSize = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const bgSize = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  if (!showBackground) {
    return (
      <Icon 
        className={cn(
          iconSize[size],
          config.iconClassName,
          normalizedStatus === "in-progress" && "animate-spin",
          className
        )} 
      />
    );
  }

  return (
    <div className={cn(
      "rounded-xl shrink-0",
      bgSize[size],
      config.className,
      className
    )}>
      <Icon 
        className={cn(
          iconSize[size],
          config.iconClassName,
          normalizedStatus === "in-progress" && "animate-spin"
        )} 
      />
    </div>
  );
}

/**
 * Get status options for select dropdowns
 */
export function getStatusOptions(type: "default" | "program" | "metric" = "default") {
  const defaultOptions = [
    { value: "planned", label: "Planned" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const programOptions = [
    { value: "planned", label: "Planned" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" },
  ];

  const metricOptions = [
    { value: "stable", label: "On Track" },
    { value: "at-risk", label: "At Risk" },
  ];

  switch (type) {
    case "program":
      return programOptions;
    case "metric":
      return metricOptions;
    default:
      return defaultOptions;
  }
}
