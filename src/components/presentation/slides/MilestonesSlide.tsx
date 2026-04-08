import { motion } from "framer-motion";
import { ContentCard } from "@/components/deck/ContentCard";
import { Flag, Plus, Trash2 } from "lucide-react";
import type { Milestone } from "@/hooks/useDeckData";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";
import { SlideHeader } from "../SlideLayouts";
import { EditableText } from "@/components/editing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, StatusIcon, getStatusOptions, normalizeStatus, STATUS_CONFIG } from "../StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MilestonesSlideProps {
  milestones: Milestone[];
  isEditMode?: boolean;
  mutations?: {
    addMilestone: { mutate: (data: { deck_id: string; title: string; status?: string }) => void };
    updateMilestone: { mutate: (data: { id: string; title?: string; status?: string; milestone_date?: string }) => void };
    deleteMilestone: { mutate: (id: string) => void };
  };
  deckId?: string;
}

export function MilestonesSlide({ milestones, isEditMode, mutations, deckId }: MilestonesSlideProps) {
  // Sort by date
  const sortedMilestones = [...milestones].sort((a, b) => {
    if (!a.milestone_date) return 1;
    if (!b.milestone_date) return -1;
    return new Date(a.milestone_date).getTime() - new Date(b.milestone_date).getTime();
  });

  const handleAddMilestone = () => {
    if (mutations && deckId) {
      mutations.addMilestone.mutate({
        deck_id: deckId,
        title: "New Milestone",
        status: "planned",
      });
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto md:overflow-hidden">
      <div className="min-h-full flex flex-col justify-start md:justify-center items-center p-6 pb-24 md:p-12 lg:p-16">
        <div className="w-full max-w-4xl">
        <SlideHeader 
          title="Milestones" 
          icon={<Flag className="h-10 w-10" />}
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-foreground/10" />

          <div className="space-y-4">
            {sortedMilestones.map((milestone, i) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              >
                <MilestoneSlideCard 
                  milestone={milestone} 
                  isEditMode={isEditMode}
                  mutations={mutations}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add button */}
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 pl-14"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={handleAddMilestone}
              className="w-full border-dashed border-2 py-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Milestone
            </Button>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}

interface MilestoneSlideCardProps {
  milestone: Milestone;
  isEditMode?: boolean;
  mutations?: {
    updateMilestone: { mutate: (data: { id: string; title?: string; status?: string; milestone_date?: string }) => void };
    deleteMilestone: { mutate: (id: string) => void };
  };
}

function MilestoneSlideCard({ milestone, isEditMode, mutations }: MilestoneSlideCardProps) {
  const normalizedStatus = normalizeStatus(milestone.status);
  const config = STATUS_CONFIG[normalizedStatus];
  const statusOptions = getStatusOptions("default");

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isToday(date)) return "Today";
      return format(date, "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const isOverdue = milestone.milestone_date && 
    isPast(new Date(milestone.milestone_date)) && 
    normalizedStatus !== "completed";

  const handleUpdate = (field: string, value: string) => {
    if (mutations) {
      mutations.updateMilestone.mutate({ id: milestone.id, [field]: value });
    }
  };

  const handleDelete = () => {
    if (mutations) {
      mutations.deleteMilestone.mutate(milestone.id);
    }
  };

  // Get timeline dot color
  const getDotColor = () => {
    switch (normalizedStatus) {
      case "completed":
        return "bg-deck-completed";
      case "in-progress":
        return "bg-primary";
      default:
        return "bg-muted-foreground";
    }
  };

  if (isEditMode && mutations) {
    return (
      <div className="relative pl-14">
        {/* Timeline dot */}
        <div className={cn(
          "absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-background ring-4 ring-background",
          getDotColor()
        )} />

        <ContentCard size="md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <StatusIcon status={milestone.status} size="sm" />
              <div className="flex-1">
                <EditableText
                  value={milestone.title}
                  onSave={(value) => handleUpdate("title", value)}
                  className="font-serif-display font-medium text-lg"
                />
                <Input
                  type="date"
                  value={milestone.milestone_date || ""}
                  onChange={(e) => handleUpdate("milestone_date", e.target.value)}
                  className="h-8 w-[160px] text-sm mt-2"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Select
                value={milestone.status || "planned"}
                onValueChange={(value) => handleUpdate("status", value)}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ContentCard>
      </div>
    );
  }

  return (
    <div className="relative pl-14">
      {/* Timeline dot */}
      <div className={cn(
        "absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-background ring-4 ring-background",
        getDotColor()
      )} />

      <ContentCard size="md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <StatusIcon status={milestone.status} size="sm" />
            <div>
              <h4 className="font-serif-display font-medium text-lg">{milestone.title}</h4>
              {milestone.milestone_date && (
                <p className={cn(
                  "text-sm font-sans-ui mt-1",
                  isOverdue ? "text-destructive" : "text-muted-foreground"
                )}>
                  {formatDate(milestone.milestone_date)}
                  {isOverdue && " (Overdue)"}
                </p>
              )}
            </div>
          </div>
          <StatusBadge status={milestone.status} />
        </div>
      </ContentCard>
    </div>
  );
}
