import { motion } from "framer-motion";
import { ContentCard, CardTitle, CardDescription, CardBody, CardMeta } from "@/components/deck/ContentCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PhotoUpload } from "@/components/editing/PhotoUpload";
import type { ExecutiveSummary, Goal, AgendaItem } from "@/hooks/useDeckData";
import { Users, Mail, Clock, Target, CheckCircle2, Circle, Loader2, Clipboard, DollarSign, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
const fadeInUp = {
  initial: {
    opacity: 0,
    y: 30
  },
  animate: {
    opacity: 1,
    y: 0
  },
  transition: {
    duration: 0.6
  }
};

// Key Statistics Card Data
const keyStatistics = [{
  label: "Define Specifications",
  sublabel: "We aggregate multi-year buyer commitments against agreed credit specifications",
  icon: Clipboard
}, {
  label: "Secure Funding",
  sublabel: "We secure pre-committed implementation finance",
  icon: DollarSign
}, {
  label: "Run Quarterly",
  sublabel: "We run quarterly diligence with outsourced partners",
  icon: CalendarCheck
}];

// Value Proposition Data
const valuePropositions = [{
  title: "Buyers",
  points: ["Define the specifications you want", "Eliminate slow, expensive diligence", "Minimise reputational risk through diversification"]
}, {
  title: "Developers",
  points: ["Increase pace through quarterly cycles", "Access multiple buyers on equal terms", "Secure offtakes and financing at the same time"]
}, {
  title: "Capital Providers",
  points: ["Define the specifications you fund", "Accelerate diligence to build scale", "Minimise delivery risk through diversification"]
}];

// Executive Summary Section
export function ExecutiveSummarySection({
  data
}: {
  data: ExecutiveSummary | null;
}) {
  if (!data) {
    return <PlaceholderSection title="Executive Summary" />;
  }
  return <motion.div {...fadeInUp} className="space-y-8 max-w-5xl mx-auto">
      {/* Section Eyebrow */}
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        EXECUTIVE SUMMARY
      </span>

      {/* Main Heading - 56px serif, two-line layout */}
      <h1 className="font-serif-display text-4xl sm:text-5xl md:text-[56px] font-medium leading-tight tracking-tight">
        Catalysing Capital<br />
        <span className="italic text-primary">for Carbon</span>
      </h1>

      {/* Subheading - serif font */}
      <p className="max-w-[800px] font-serif-display text-lg sm:text-xl leading-relaxed text-foreground/80">
        Hurdle replaces fragmented bilateral processes with a shared operating system that builds buyer confidence, accelerates capital flows, and maximises project-level impact.
      </p>

      {/* What we do - Section Title */}
      <h2 className="font-serif-display text-2xl font-medium text-foreground">
        What we do
      </h2>

      {/* Key Statistics Cards - 3-column grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {keyStatistics.map((stat, index) => <motion.div key={stat.label} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2 + index * 0.1,
        duration: 0.5
      }}>
            <div className="glass-card-sm p-6 h-full">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif-display font-medium text-lg">
                    {stat.label}
                  </h3>
                  <p className="font-serif-display text-sm text-muted-foreground leading-relaxed">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>)}
      </div>

      {/* Why it matters - Section Title */}
      <h2 className="font-serif-display text-2xl font-medium text-foreground">
        Why it matters
      </h2>

      {/* Value Proposition Highlights - 3-column grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {valuePropositions.map((prop, index) => <motion.div key={prop.title} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4 + index * 0.1,
        duration: 0.5
      }}>
            <div className="glass-card-sm p-6 h-full">
              <h3 className="font-serif-display font-medium text-lg mb-4 text-primary">
                {prop.title}
              </h3>
              <ul className="space-y-3">
                {prop.points.map((point, i) => <li key={i} className="flex items-start gap-3 font-serif-display text-sm text-muted-foreground">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    {point}
                  </li>)}
              </ul>
            </div>
          </motion.div>)}
      </div>
    </motion.div>;
}


// Goals Section
export function GoalsSection({
  goals
}: {
  goals: Goal[];
}) {
  if (goals.length === 0) {
    return <PlaceholderSection title="Goals" />;
  }
  return <motion.div {...fadeInUp} className="space-y-6">
      <div className="mb-6">
        <span className="label-text text-primary block mb-2">Objectives</span>
        <h2 className="section-title">Strategic Goals</h2>
      </div>
      
      <div className="grid gap-4">
        {goals.map((goal, i) => <motion.div key={goal.id} initial={{
        opacity: 0,
        x: -30
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: i * 0.1,
        duration: 0.5
      }}>
            <GoalCard goal={goal} />
          </motion.div>)}
      </div>
    </motion.div>;
}
function GoalCard({
  goal
}: {
  goal: Goal;
}) {
  const status = (goal.status || "not-started") as "completed" | "in-progress" | "not-started";
  const statusConfig = {
    "completed": {
      icon: CheckCircle2,
      color: "text-deck-completed",
      bgColor: "bg-deck-completed/10",
      label: "Complete"
    },
    "in-progress": {
      icon: Loader2,
      color: "text-primary",
      bgColor: "bg-primary/10",
      label: "In Progress"
    },
    "not-started": {
      icon: Circle,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      label: "Not Started"
    }
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  const progress = goal.progress_percent || 0;
  return <ContentCard size="md">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl", config.bgColor)}>
          <Icon className={cn("h-5 w-5", config.color, status === "in-progress" && "animate-spin")} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif-display font-medium text-lg">{goal.title}</h4>
            <Badge variant="secondary" className={cn("font-sans-ui text-xs", status === "completed" && "bg-deck-completed/20 text-deck-completed", status === "in-progress" && "bg-primary/20 text-primary")}>
              {progress}%
            </Badge>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
        </div>
      </div>
    </ContentCard>;
}

// Agenda Section (for Next Meeting view)
export function AgendaSection({
  items
}: {
  items: AgendaItem[];
}) {
  if (items.length === 0) {
    return <PlaceholderSection title="Agenda" />;
  }
  const totalDuration = items.reduce((acc, item) => acc + (item.duration || 0), 0);
  return <motion.div {...fadeInUp} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="label-text text-primary block mb-2">Schedule</span>
          <h2 className="section-title flex items-center gap-3">
            <Target className="h-7 w-7 text-primary" />
            Meeting Agenda
          </h2>
        </div>
        <Badge variant="outline" className="font-sans-ui text-sm px-4 py-2 rounded-xl">
          <Clock className="h-4 w-4 mr-2" />
          {totalDuration} min total
        </Badge>
      </div>
      
      <div className="space-y-3">
        {items.map((item, i) => <motion.div key={item.id} initial={{
        opacity: 0,
        x: -30
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: i * 0.08,
        duration: 0.5
      }}>
            <ContentCard size="md" className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background font-sans-ui text-sm font-medium">
                  {item.display_order || i + 1}
                </span>
                <span className="font-serif-display font-medium">{item.title}</span>
              </div>
              <Badge variant="secondary" className="font-sans-ui text-xs">
                {item.duration || 5} min
              </Badge>
            </ContentCard>
          </motion.div>)}
      </div>
    </motion.div>;
}

// Placeholder section for empty states
export function PlaceholderSection({
  title
}: {
  title: string;
}) {
  return <motion.div {...fadeInUp}>
      <ContentCard size="lg" interactive={false} className="text-center">
        <div className="py-16">
          <span className="label-text text-muted-foreground block mb-4">No Data</span>
          <h3 className="font-serif-display text-2xl text-muted-foreground mb-3">{title}</h3>
          <CardDescription className="max-w-md mx-auto">
            No content available for this section yet. Add some data to get started.
          </CardDescription>
        </div>
      </ContentCard>
    </motion.div>;
}