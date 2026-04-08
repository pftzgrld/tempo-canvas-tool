import { motion } from "framer-motion";
import { ContentCard } from "@/components/deck/ContentCard";
import { 
  CheckCircle, 
  Clock, 
  CircleDashed, 
  Rocket, 
  AlertTriangle,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

type MilestoneStatus = "complete" | "in-progress" | "pending";

interface MilestoneData {
  id: string;
  date: string;
  title: string;
  status: MilestoneStatus;
  icon: React.ComponentType<{ className?: string }>;
}

const MILESTONES: MilestoneData[] = [
  {
    id: "1",
    date: "Jan 2026",
    title: "Technical Partner Commitments",
    status: "complete",
    icon: CheckCircle,
  },
  {
    id: "2",
    date: "Jan 2026",
    title: "Developer Appetite Confirmed",
    status: "complete",
    icon: CheckCircle,
  },
  {
    id: "3",
    date: "Q1 2026",
    title: "Anchor Buyer Commitments",
    status: "in-progress",
    icon: Clock,
  },
  {
    id: "4",
    date: "Q1 2026",
    title: "Capital Provider Pre-Commitments",
    status: "in-progress",
    icon: Clock,
  },
  {
    id: "5",
    date: "Q2 2026",
    title: "First Quarterly Cycle Opens",
    status: "pending",
    icon: CircleDashed,
  },
  {
    id: "6",
    date: "Q2 2026",
    title: "V1 Deployment",
    status: "pending",
    icon: Rocket,
  },
];

const RISKS = [
  {
    risk: "Buyer commitment delays",
    mitigation: "Multiple simultaneous conversations; supplementary customer sourcing through technical partners, developers, and capital providers",
  },
  {
    risk: "Technical partner bandwidth",
    mitigation: "Multiple technical partners in each segment confirmed",
  },
  {
    risk: "Developer pipeline quality",
    mitigation: "Marquee buyers will attract wide pool of developers",
  },
  {
    risk: "Capital provider pushback",
    mitigation: "Secure initial partner with wide discretion; expand to larger, less flexible partners once model scales",
  },
];

export function MilestonesSection() {
  return (
    <motion.div {...fadeInUp} className="space-y-10">
      {/* Header */}
      <div className="mb-6">
        <span className="label-text text-muted-foreground block mb-2">TIMELINE</span>
        <h2 className="section-title">Milestones</h2>
        <p className="body-large text-muted-foreground mt-4 max-w-3xl">
          Aggressive but achievable timeline based on secured commitments and clear dependencies.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-foreground/10" />

        <div className="space-y-4">
          {MILESTONES.map((milestone, i) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <MilestoneCard milestone={milestone} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risks & Mitigations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="space-y-4"
      >
        <h3 className="font-serif-display text-xl font-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Risks & Mitigations
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {RISKS.map((item, i) => (
            <ContentCard key={i} size="sm">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <span className="font-serif-display font-medium">{item.risk}</span>
                </div>
                <div className="flex items-start gap-2 pl-6">
                  <Shield className="h-4 w-4 text-deck-completed mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground font-sans-ui">{item.mitigation}</span>
                </div>
              </div>
            </ContentCard>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface MilestoneCardProps {
  milestone: MilestoneData;
}

function MilestoneCard({ milestone }: MilestoneCardProps) {
  const Icon = milestone.icon;
  
  const statusConfig = {
    complete: {
      badge: "COMPLETE",
      badgeClass: "bg-deck-completed/20 text-deck-completed border-deck-completed/30",
      iconClass: "text-deck-completed",
      dotClass: "bg-deck-completed",
    },
    "in-progress": {
      badge: "IN PROGRESS",
      badgeClass: "bg-primary/20 text-primary border-primary/30",
      iconClass: "text-primary",
      dotClass: "bg-primary",
    },
    pending: {
      badge: "PENDING",
      badgeClass: "bg-muted text-muted-foreground border-muted-foreground/30",
      iconClass: "text-muted-foreground",
      dotClass: "bg-muted-foreground",
    },
  };

  const config = statusConfig[milestone.status];

  return (
    <div className="relative pl-10">
      {/* Timeline dot */}
      <div className={cn(
        "absolute left-2.5 top-5 w-3 h-3 rounded-full ring-4 ring-background",
        config.dotClass
      )} />

      <ContentCard size="md">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.iconClass)} />
            <div>
              <h4 className="font-serif-display font-medium text-lg">{milestone.title}</h4>
              <p className="text-sm font-sans-ui mt-1 text-muted-foreground">
                {milestone.date}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-xs shrink-0", config.badgeClass)}>
            {config.badge}
          </Badge>
        </div>
      </ContentCard>
    </div>
  );
}
