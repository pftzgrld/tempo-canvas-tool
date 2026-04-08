import { motion, AnimatePresence } from "framer-motion";
import { ContentCard } from "@/components/deck/ContentCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EditableText, EditableList, PhotoUpload } from "@/components/editing";
import { SlideType } from "@/types/deck";
import type { 
  Deck, 
  ExecutiveSummary, 
  Goal, 
  AgendaItem,
  Metric,
  UseCase,
  Program,
  Milestone,
  Resource,
  Priority,
} from "@/hooks/useDeckData";
import { 
  Clock, 
  ArrowRight,
  Sparkles,
  Users,
  Target,
  Plus,
  Trash2,
  Mail,
  Phone,
  Linkedin,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricsSlide } from "./slides/MetricsSlide";
import { UseCasesSlide } from "./slides/UseCasesSlide";
import { ProgramsSlide } from "./slides/ProgramsSlide";
import { MilestonesSlide } from "./slides/MilestonesSlide";
import { ResourcesSlide } from "./slides/ResourcesSlide";
import { PrioritiesSlide } from "./slides/PrioritiesSlide";
import { StatusBadge, StatusIcon, getStatusOptions } from "./StatusBadge";
import type { useDeckMutations } from "@/hooks/useDeckMutations";

interface SlideProps {
  isEditMode?: boolean;
  mutations?: ReturnType<typeof useDeckMutations>;
}

const slideVariants = {
  enter: { opacity: 0, scale: 0.98 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

function SlideWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="w-full h-full overflow-y-auto"
    >
      <div className="min-h-full flex flex-col justify-center items-center p-6 pb-24 md:p-12 lg:p-16 bg-background">
        {children}
      </div>
    </motion.div>
  );
}

// Title Slide
export function TitleSlide({ deck, isEditMode }: SlideProps & { deck: Deck }) {
  return (
    <SlideWrapper>
      <div className="text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-foreground/10 bg-background/80 px-4 py-1.5 backdrop-blur mb-8">
            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-primary">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
            </span>
            <span className="label-text">Customer Kickoff</span>
          </div>
        </motion.div>
        
        <motion.h1
          className="slide-title mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {deck.title.split(" ").slice(0, 2).join(" ")} <br />
          <span className="italic text-primary">{deck.title.split(" ").slice(2).join(" ")}</span>
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl font-serif-body text-muted-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {deck.created_at ? new Date(deck.created_at).toLocaleDateString("en-US", { 
            month: "long", 
            day: "numeric", 
            year: "numeric" 
          }) : ""}
        </motion.p>
      </div>
    </SlideWrapper>
  );
}

// Agenda Slide
export function AgendaSlide({ 
  items, 
  isEditMode,
  mutations,
}: SlideProps & { items: AgendaItem[] }) {
  const totalDuration = items.reduce((acc, item) => acc + (item.duration || 0), 0);

  const handleUpdateItem = async (id: string, updates: { title?: string; duration?: number }) => {
    if (mutations) {
      await mutations.updateAgendaItem.mutateAsync({ id, ...updates });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (mutations) {
      await mutations.deleteAgendaItem.mutateAsync(id);
    }
  };

  const handleAddItem = async () => {
    if (mutations) {
      const newOrder = items.length + 1;
      await mutations.addAgendaItem.mutateAsync({ 
        title: "New agenda item", 
        duration: 5,
        display_order: newOrder,
      });
    }
  };

  return (
    <SlideWrapper>
      <div className="w-full max-w-3xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="slide-title mb-2">Today's Agenda</h2>
          <Badge 
            variant="outline" 
            className="text-[10px] px-3 py-1 font-sans-ui font-medium uppercase tracking-[0.15em] border-foreground/10 bg-background/80 backdrop-blur gap-1.5"
          >
            <Clock className="h-3 w-3" />
            {totalDuration} MIN
          </Badge>
        </motion.div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <ContentCard size="md" className="flex items-center gap-4 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-sans-ui font-semibold shrink-0">
                  {item.display_order || i + 1}
                </div>
                <div className="flex-1">
                  <EditableText
                    value={item.title}
                    onSave={(value) => handleUpdateItem(item.id, { title: value })}
                    isEditable={isEditMode}
                    variant="title"
                    placeholder="Agenda item..."
                    className="text-lg"
                  />
                </div>
                {isEditMode ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.duration || 5}
                      onChange={(e) => handleUpdateItem(item.id, { duration: parseInt(e.target.value) || 5 })}
                      className="w-16 px-2 py-1 text-sm border rounded bg-background text-center font-sans-ui"
                      min={1}
                      max={120}
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Badge variant="secondary" className="font-sans-ui shrink-0">
                    {item.duration || 5} min
                  </Badge>
                )}
              </ContentCard>
            </motion.div>
          ))}
        </div>

        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <button
              onClick={handleAddItem}
              className="w-full p-4 border-2 border-dashed border-muted-foreground/30 rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Agenda Item
            </button>
          </motion.div>
        )}
      </div>
    </SlideWrapper>
  );
}

// Executive Summary Slide
export function ExecutiveSummarySlide({ 
  data, 
  isEditMode,
  mutations,
}: SlideProps & { data: ExecutiveSummary | null }) {
  if (!data) {
    return <EmptySlide slideType="executive-summary" isEditMode={isEditMode} />;
  }

  const handleUpdate = async (field: string, value: string) => {
    if (mutations) {
      await mutations.updateExecutiveSummary.mutateAsync({ [field]: value });
    }
  };

  return (
    <SlideWrapper>
      <div className="w-full max-w-5xl">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-foreground/10 bg-background/80 px-4 py-1.5 backdrop-blur mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            <span className="label-text">Executive Summary</span>
          </div>
          <h2 className="slide-title">
            Strategic <br className="hidden md:block" />
            <span className="italic text-primary">Overview</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ContentCard size="lg" className="h-full">
              <span className="label-text text-primary block mb-3">Summary</span>
              <div className="mb-3">
                <EditableText
                  value={data.summary_title || ""}
                  onSave={(value) => handleUpdate("summary_title", value)}
                  isEditable={isEditMode}
                  variant="title"
                  placeholder="Enter summary title..."
                />
              </div>
              <EditableText
                value={data.summary_description || ""}
                onSave={(value) => handleUpdate("summary_description", value)}
                isEditable={isEditMode}
                variant="body"
                multiline
                placeholder="Enter summary description..."
              />
            </ContentCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ContentCard size="lg" className="h-full">
              <span className="label-text text-deck-completed block mb-3">Focus Area</span>
              <div className="mb-3">
                <EditableText
                  value={data.focus_title || ""}
                  onSave={(value) => handleUpdate("focus_title", value)}
                  isEditable={isEditMode}
                  variant="title"
                  placeholder="Enter focus title..."
                />
              </div>
              <EditableText
                value={data.focus_description || ""}
                onSave={(value) => handleUpdate("focus_description", value)}
                isEditable={isEditMode}
                variant="body"
                multiline
                placeholder="Enter focus description..."
              />
            </ContentCard>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  );
}


// Goals Slide
export function GoalsSlide({ goals, isEditMode, mutations }: SlideProps & { goals: Goal[] }) {
  const handleUpdateGoal = async (id: string, updates: { title?: string; status?: string; progress_percent?: number }) => {
    if (mutations) {
      await mutations.updateGoal.mutateAsync({ id, ...updates });
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (mutations) {
      await mutations.deleteGoal.mutateAsync(id);
    }
  };

  const handleAddGoal = async () => {
    if (mutations) {
      await mutations.addGoal.mutateAsync({
        title: "New Goal",
        status: "not-started",
        progress_percent: 0,
      });
    }
  };

  return (
    <SlideWrapper>
      <div className="w-full max-w-3xl">
        <motion.h2
          className="slide-title text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Target className="inline-block h-10 w-10 mr-3 text-primary" />
          Goals & Objectives
        </motion.h2>

        <div className="space-y-4">
          {goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <GoalSlideCard 
                goal={goal} 
                isEditMode={isEditMode}
                onUpdate={(updates) => handleUpdateGoal(goal.id, updates)}
                onDelete={() => handleDeleteGoal(goal.id)}
              />
            </motion.div>
          ))}
        </div>

        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <button
              onClick={handleAddGoal}
              className="w-full p-4 border-2 border-dashed border-muted-foreground/30 rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Goal
            </button>
          </motion.div>
        )}
      </div>
    </SlideWrapper>
  );
}

interface GoalSlideCardProps {
  goal: Goal;
  isEditMode?: boolean;
  onUpdate?: (updates: { title?: string; status?: string; progress_percent?: number }) => void;
  onDelete?: () => void;
}

function GoalSlideCard({ goal, isEditMode, onUpdate, onDelete }: GoalSlideCardProps) {
  const progress = goal.progress_percent || 0;
  const statusOptions = getStatusOptions("default");

  return (
    <ContentCard size="md" className="group">
      <div className="flex items-center gap-4">
        {isEditMode ? (
          <select
            value={goal.status || "planned"}
            onChange={(e) => onUpdate?.({ status: e.target.value })}
            className="h-8 w-8 rounded-full appearance-none cursor-pointer bg-muted text-center"
            title="Change status"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <StatusIcon status={goal.status} size="md" showBackground={false} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            {isEditMode ? (
              <EditableText
                value={goal.title}
                onSave={(value) => onUpdate?.({ title: value })}
                isEditable={isEditMode}
                variant="title"
                placeholder="Goal title..."
                className="flex-1"
              />
            ) : (
              <h4 className="font-serif-display font-medium truncate">{goal.title}</h4>
            )}
            {isEditMode ? (
              <div className="flex items-center gap-2 ml-2">
                <input
                  type="number"
                  value={progress}
                  onChange={(e) => onUpdate?.({ progress_percent: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                  className="w-16 px-2 py-1 text-sm border rounded bg-background text-center"
                  min={0}
                  max={100}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            ) : (
              <Badge 
                variant="secondary" 
                className="shrink-0 font-sans-ui"
              >
                {progress}%
              </Badge>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        {isEditMode && (
          <button
            onClick={onDelete}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </ContentCard>
  );
}

// Next Steps Slide
export function ClosingSlide({ 
  nextSteps, 
  isEditMode,
  mutations,
  deckId,
}: SlideProps & { nextSteps: string[]; deckId?: string }) {
  
  const handleUpdateSteps = async (newSteps: string[]) => {
    if (mutations) {
      await mutations.updateDeck.mutateAsync({ closing_next_steps: newSteps });
    }
  };

  const listItems = nextSteps.map((step, i) => ({
    id: `step-${i}`,
    value: step,
  }));

  const handleListChange = (items: { id: string; value: string }[]) => {
    const newSteps = items.map((item) => item.value);
    handleUpdateSteps(newSteps);
  };

  return (
    <SlideWrapper>
      <div className="w-full max-w-4xl">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-foreground/10 bg-background/80 px-4 py-1.5 backdrop-blur mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            <span className="label-text">Action Items</span>
          </div>
          <h2 className="slide-title">
            Next <span className="italic text-primary">Steps</span>
          </h2>
        </motion.div>

        {isEditMode ? (
          <ContentCard size="lg" className="mb-8">
            <EditableList
              items={listItems}
              onItemsChange={handleListChange}
              isEditable={isEditMode}
              placeholder="Add next step..."
              emptyPlaceholder="No next steps defined"
              showDragHandle={true}
              showDeleteButton={true}
              showAddButton={true}
            />
          </ContentCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            {nextSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <ContentCard size="md" className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shrink-0">
                      {i + 1}
                    </div>
                    <p className="font-serif-body text-foreground leading-relaxed">{step}</p>
                  </div>
                </ContentCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </SlideWrapper>
  );
}

// Thank You Slide - final slide with exit option
export function ThankYouSlide({ 
  onExitPresentation 
}: { 
  onExitPresentation?: () => void 
}) {
  return (
    <SlideWrapper>
      <div className="w-full max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <Sparkles className="h-16 w-16 text-primary mx-auto mb-8" />
          <h2 className="slide-title mb-6">
            Thank <span className="italic text-primary">You</span>
          </h2>
          <p className="text-xl md:text-2xl font-serif-body text-muted-foreground max-w-xl mx-auto">
            We appreciate your partnership and look forward to achieving great things together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ContentCard 
            size="md" 
            className="inline-flex items-center gap-3 cursor-pointer"
            onClick={onExitPresentation}
          >
            <span className="font-serif-body text-muted-foreground">Press</span>
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">ESC</kbd>
            <span className="font-serif-body text-muted-foreground">or click here to exit</span>
          </ContentCard>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// Empty Slide - shown in edit mode when no data exists
export function EmptySlide({ slideType, isEditMode }: { slideType: SlideType; isEditMode?: boolean }) {
  return (
    <SlideWrapper>
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2 capitalize">
            {slideType.replace(/-/g, " ")}
          </h2>
          <p className="text-muted-foreground">
            {isEditMode 
              ? "Click to add content to this slide" 
              : "No content available for this slide"}
          </p>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// Placeholder Slide (legacy - for unknown slide types)
export function PlaceholderSlide({ slideType }: { slideType: SlideType }) {
  return (
    <SlideWrapper>
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8"
        >
          <h2 className="slide-title text-muted-foreground mb-4 capitalize">
            {slideType.replace(/-/g, " ")}
          </h2>
          <p className="text-muted-foreground">
            Content for this slide will be loaded from the database.
          </p>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// Slide Renderer Props
export interface SlideRendererProps {
  slideType: SlideType;
  isEditMode?: boolean;
  onExitPresentation?: () => void;
  deck: Deck;
  executiveSummary: ExecutiveSummary | null;
  goals: Goal[];
  agendaItems: AgendaItem[];
  metrics: Metric[];
  useCases: UseCase[];
  programs: Program[];
  milestones: Milestone[];
  resources: Resource[];
  priorities: Priority[];
  mutations?: ReturnType<typeof import("@/hooks/useDeckMutations").useDeckMutations>;
}

// Check if a slide has content
export function slideHasContent(
  slideType: SlideType,
  props: Omit<SlideRendererProps, "slideType" | "isEditMode" | "onExitPresentation">
): boolean {
  switch (slideType) {
    case "title":
    case "closing":
    case "thank-you":
      return true; // Always show these
    case "agenda":
      return props.agendaItems.length > 0;
    case "executive-summary":
      return props.executiveSummary !== null;
    case "team-introductions":
      return false; // Team feature removed
    case "goals":
      return props.goals.length > 0;
    case "metrics":
      return props.metrics.length > 0;
    case "use-cases":
      return props.useCases.length > 0;
    case "programs":
      return props.programs.length > 0;
    case "milestones":
      return props.milestones.length > 0;
    case "resources":
      return props.resources.length > 0;
    case "priorities":
      return props.priorities.length > 0;
    default:
      return false;
  }
}

// Slide Renderer - renders the appropriate slide based on type
export function SlideRenderer({ 
  slideType, 
  isEditMode = false,
  onExitPresentation,
  deck,
  executiveSummary,
  goals,
  agendaItems,
  metrics,
  useCases,
  programs,
  milestones,
  resources,
  priorities,
  mutations,
}: SlideRendererProps) {
  const renderSlide = () => {
    switch (slideType) {
      case "title":
        return <TitleSlide deck={deck} isEditMode={isEditMode} mutations={mutations} />;
      case "agenda":
        return agendaItems.length > 0 || isEditMode
          ? <AgendaSlide items={agendaItems} isEditMode={isEditMode} mutations={mutations} />
          : <EmptySlide slideType={slideType} isEditMode={isEditMode} />;
      case "executive-summary":
        return <ExecutiveSummarySlide data={executiveSummary} isEditMode={isEditMode} mutations={mutations} />;
      case "team-introductions":
        return <EmptySlide slideType={slideType} isEditMode={isEditMode} />;
      case "goals":
        return goals.length > 0 || isEditMode
          ? <GoalsSlide goals={goals} isEditMode={isEditMode} mutations={mutations} />
          : <EmptySlide slideType={slideType} isEditMode={isEditMode} />;
      case "metrics":
        return metrics.length > 0 || isEditMode
          ? <MetricsSlide metrics={metrics} isEditMode={isEditMode} mutations={mutations} />
          : <EmptySlide slideType={slideType} isEditMode={isEditMode} />;
      case "use-cases":
        return useCases.length > 0 || isEditMode
          ? <UseCasesSlide useCases={useCases} isEditMode={isEditMode} mutations={mutations} deckId={deck.id} />
          : <EmptySlide slideType={slideType} isEditMode={isEditMode} />;
      case "programs":
        return programs.length > 0 || isEditMode
          ? <ProgramsSlide programs={programs} isEditMode={isEditMode} mutations={mutations} deckId={deck.id} />
          : <EmptySlide slideType={slideType} isEditMode={isEditMode} />;
      case "milestones":
        return milestones.length > 0 || isEditMode
          ? <MilestonesSlide milestones={milestones} isEditMode={isEditMode} mutations={mutations} deckId={deck.id} />
          : <EmptySlide slideType={slideType} isEditMode={isEditMode} />;
      case "resources":
        return resources.length > 0 || isEditMode
          ? <ResourcesSlide resources={resources} isEditMode={isEditMode} mutations={mutations} deckId={deck.id} />
          : <EmptySlide slideType={slideType} isEditMode={isEditMode} />;
      case "priorities":
        return priorities.length > 0 || isEditMode
          ? <PrioritiesSlide priorities={priorities} isEditMode={isEditMode} mutations={mutations} />
          : <EmptySlide slideType={slideType} isEditMode={isEditMode} />;
      case "closing":
        return <ClosingSlide nextSteps={deck.closing_next_steps || []} isEditMode={isEditMode} mutations={mutations} />;
      case "thank-you":
        return <ThankYouSlide onExitPresentation={onExitPresentation} />;
      default:
        return <PlaceholderSlide slideType={slideType} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <div key={slideType} className="w-full h-full bg-background relative overflow-hidden">
        {/* Ambient background blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="ambient-blob-primary -top-20 -left-20 h-96 w-96" />
          <div className="ambient-blob-muted top-1/2 -right-20 h-[500px] w-[500px]" />
        </div>
        {renderSlide()}
      </div>
    </AnimatePresence>
  );
}
