import { motion } from "framer-motion";
import { ContentCard } from "@/components/deck/ContentCard";
import { Target, Calendar, Plus, Trash2 } from "lucide-react";
import type { Priority } from "@/hooks/useDeckData";
import { cn } from "@/lib/utils";
import { format, isToday, isPast } from "date-fns";
import { SlideHeader, TwoColumnLayout } from "../SlideLayouts";
import { EditableText } from "@/components/editing";
import { StatusBadge, StatusIcon, getStatusOptions } from "../StatusBadge";
import type { useDeckMutations } from "@/hooks/useDeckMutations";

interface PrioritiesSlideProps {
  priorities: Priority[];
  isEditMode?: boolean;
  mutations?: ReturnType<typeof useDeckMutations>;
}

export function PrioritiesSlide({ priorities, isEditMode, mutations }: PrioritiesSlideProps) {
  const internalPriorities = priorities.filter(p => p.owner_type === "internal");
  const customerPriorities = priorities.filter(p => p.owner_type === "customer");

  const handleUpdatePriority = async (id: string, updates: Partial<Priority>) => {
    if (mutations) {
      await mutations.updatePriority.mutateAsync({ id, ...updates });
    }
  };

  const handleDeletePriority = async (id: string) => {
    if (mutations) {
      await mutations.deletePriority.mutateAsync(id);
    }
  };

  const handleAddPriority = async (ownerType: "internal" | "customer") => {
    if (mutations) {
      await mutations.addPriority.mutateAsync({
        title: "New Priority",
        status: "planned",
        owner_type: ownerType,
      });
    }
  };

  const renderPriorityCard = (priority: Priority, onUpdate: (updates: Partial<Priority>) => void, onDelete: () => void) => (
    <PrioritySlideCard
      priority={priority}
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );

  const renderAddButton = (ownerType: "internal" | "customer") => (
    <button
      onClick={() => handleAddPriority(ownerType)}
      className="w-full mt-3 p-3 border-2 border-dashed border-muted-foreground/30 rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm"
    >
      <Plus className="h-4 w-4" />
      Add Priority
    </button>
  );

  return (
    <div className="w-full h-full overflow-y-auto md:overflow-hidden">
      <div className="min-h-full flex flex-col justify-start md:justify-center items-center p-6 pb-24 md:p-12 lg:p-16">
        <div className="w-full max-w-5xl">
        <SlideHeader 
          title="Business Outcomes" 
          icon={<Target className="h-10 w-10" />}
        />

        <TwoColumnLayout
          left={
            <div>
              <h3 className="font-serif-display text-lg font-medium mb-4 text-muted-foreground">
                Our Priorities
              </h3>
              <div className="space-y-3">
                {internalPriorities.map((priority, i) => (
                  <motion.div
                    key={priority.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  >
                    {renderPriorityCard(
                      priority,
                      (updates) => handleUpdatePriority(priority.id, updates),
                      () => handleDeletePriority(priority.id)
                    )}
                  </motion.div>
                ))}
                {internalPriorities.length === 0 && !isEditMode && (
                  <p className="text-muted-foreground text-sm font-serif-body italic">
                    No priorities defined
                  </p>
                )}
              </div>
              {isEditMode && renderAddButton("internal")}
            </div>
          }
          right={
            <div>
              <h3 className="font-serif-display text-lg font-medium mb-4 text-muted-foreground">
                Customer Priorities
              </h3>
              <div className="space-y-3">
                {customerPriorities.map((priority, i) => (
                  <motion.div
                    key={priority.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  >
                    {renderPriorityCard(
                      priority,
                      (updates) => handleUpdatePriority(priority.id, updates),
                      () => handleDeletePriority(priority.id)
                    )}
                  </motion.div>
                ))}
                {customerPriorities.length === 0 && !isEditMode && (
                  <p className="text-muted-foreground text-sm font-serif-body italic">
                    No priorities defined
                  </p>
                )}
              </div>
              {isEditMode && renderAddButton("customer")}
            </div>
          }
          gap="lg"
        />
        </div>
      </div>
    </div>
  );
}

interface PrioritySlideCardProps {
  priority: Priority;
  isEditMode?: boolean;
  onUpdate?: (updates: Partial<Priority>) => void;
  onDelete?: () => void;
}

function PrioritySlideCard({ priority, isEditMode, onUpdate, onDelete }: PrioritySlideCardProps) {
  const statusOptions = getStatusOptions("default");

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
    <ContentCard size="sm" className="group">
      <div className="flex items-center gap-3">
        {isEditMode ? (
          <select
            value={priority.status || "planned"}
            onChange={(e) => onUpdate?.({ status: e.target.value })}
            className="p-2 rounded-xl text-xs appearance-none cursor-pointer bg-muted border-0"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <StatusIcon status={priority.status} size="sm" />
        )}
        <div className="flex-1 min-w-0">
          {isEditMode ? (
            <EditableText
              value={priority.title}
              onSave={(value) => onUpdate?.({ title: value })}
              isEditable={isEditMode}
              variant="title"
              placeholder="Priority title..."
              className="text-base"
            />
          ) : (
            <h4 className="font-serif-display font-medium truncate">{priority.title}</h4>
          )}
          {priority.due_date && !isEditMode && (
            <p className={cn(
              "text-xs font-sans-ui flex items-center gap-1 mt-0.5",
              isOverdue ? "text-destructive" : "text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              {formatDate(priority.due_date)}
              {isOverdue && " (Overdue)"}
            </p>
          )}
          {isEditMode && (
            <input
              type="date"
              value={priority.due_date || ""}
              onChange={(e) => onUpdate?.({ due_date: e.target.value || null })}
              className="text-xs mt-1 px-2 py-1 border rounded bg-background"
            />
          )}
        </div>
        {isEditMode ? (
          <button
            onClick={onDelete}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : (
          <StatusBadge status={priority.status} />
        )}
      </div>
    </ContentCard>
  );
}
