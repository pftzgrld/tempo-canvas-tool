import { motion } from "framer-motion";
import { ContentCard } from "@/components/deck/ContentCard";
import { ListChecks, Calendar, User, Building2 } from "lucide-react";
import type { Priority } from "@/hooks/useDeckData";
import { PlaceholderSection } from "./SectionComponents";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";
import { StatusBadge, StatusIcon } from "@/components/presentation/StatusBadge";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

interface PrioritiesSectionProps {
  priorities: Priority[];
}

export function PrioritiesSection({ priorities }: PrioritiesSectionProps) {
  if (priorities.length === 0) {
    return <PlaceholderSection title="Business Priorities" />;
  }

  const groupedByOwner = priorities.reduce((acc, p) => {
    const owner = p.owner_type || "unassigned";
    if (!acc[owner]) acc[owner] = [];
    acc[owner].push(p);
    return acc;
  }, {} as Record<string, Priority[]>);

  return (
    <motion.div {...fadeInUp} className="space-y-8">
      <div className="mb-6">
        <span className="label-text text-primary block mb-2">Action Items</span>
        <h2 className="section-title flex items-center gap-3">
          <ListChecks className="h-7 w-7 text-primary" />
          Business Priorities
        </h2>
      </div>

      {Object.entries(groupedByOwner).map(([owner, items]) => (
        <div key={owner}>
          <h3 className="font-serif-display text-lg font-medium mb-4 flex items-center gap-2">
            {owner === "customer" ? (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            ) : owner === "internal" ? (
              <User className="h-5 w-5 text-muted-foreground" />
            ) : null}
            <span className="text-muted-foreground">
              {owner === "internal" ? "Your Team" : owner === "customer" ? "Customer" : owner}
            </span>
          </h3>
          <div className="space-y-3">
            {items.map((priority, i) => (
              <motion.div
                key={priority.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <PriorityCard priority={priority} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function PriorityCard({ priority }: { priority: Priority }) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isToday(date)) return "Today";
      return format(date, "MMM d");
    } catch {
      return dateStr;
    }
  };

  const isOverdue = priority.due_date && 
    isPast(new Date(priority.due_date)) && 
    priority.status !== "completed";

  return (
    <ContentCard size="md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon status={priority.status} size="sm" />
          <span className={cn(
            "font-serif-display font-medium",
            priority.status === "completed" && "line-through text-muted-foreground"
          )}>
            {priority.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {priority.due_date && (
            <span className={cn(
              "text-sm font-sans-ui flex items-center gap-1.5",
              isOverdue ? "text-destructive" : "text-muted-foreground"
            )}>
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(priority.due_date)}
            </span>
          )}
          <StatusBadge status={priority.status} />
        </div>
      </div>
    </ContentCard>
  );
}
