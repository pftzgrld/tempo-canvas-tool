import { motion } from "framer-motion";
import { Target } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Competitor comparison data
const competitors = [
  {
    name: "Frontier",
    whatTheyDoWell: "Pace and dynamism for frontier technology",
    whatHurdleDoesDifferently: [
      "Expands access to mainstream corporates, not just innovators",
      "Targets proven methodologies over exploratory tech",
      "Lower per-credit prices, faster time to impact",
    ],
    positioning: "We're the deployment layer for mainstream buyers",
  },
  {
    name: "Symbiosis",
    whatTheyDoWell: "Premium quality focus and high standards",
    whatHurdleDoesDifferently: [
      "Acts as final diligence step, not initial hurdle",
      "Faster quarterly cycles vs. prolonged assessment",
      "Centralised for both buyers and capital providers",
    ],
    positioning: "We're the execution layer, not the screening layer",
  },
  {
    name: "NextGen",
    whatTheyDoWell: "Expanding buyer participation beyond Frontier",
    whatHurdleDoesDifferently: [
      "Includes capital provider coordination from day one",
      "Proven methodologies with deployment speed",
      "Quarterly predictability vs. annual cohorts",
    ],
    positioning: "We're aligned on buyer expansion, more complete on infrastructure",
  },
];

// Competitor card component
function CompetitorCard({ competitor, index }: { competitor: typeof competitors[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
      className="glass-card-sm p-6 h-full flex flex-col"
    >
      {/* Competitor name */}
      <h3 className="font-serif-display text-xl font-medium text-primary mb-4">
        vs. {competitor.name}
      </h3>

      {/* What they do well */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
          What They Do Well
        </p>
        <p className="font-serif-display text-sm text-foreground/80">
          {competitor.whatTheyDoWell}
        </p>
      </div>

      {/* What Hurdle does differently */}
      <div className="mb-4 flex-1">
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
          What Hurdle Does Differently
        </p>
        <ul className="space-y-2">
          {competitor.whatHurdleDoesDifferently.map((item, i) => (
            <li key={i} className="font-serif-display text-sm text-foreground/80 flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Positioning statement */}
      <div className="pt-4 border-t border-border/50">
        <p className="font-serif-display text-sm italic text-primary">
          {competitor.positioning}
        </p>
      </div>
    </motion.div>
  );
}


export function HowDifferentSection() {
  return (
    <motion.div {...fadeInUp} className="space-y-8 max-w-5xl mx-auto">
      {/* Section Eyebrow */}
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        COMPETITIVE POSITIONING
      </span>

      {/* Main Heading */}
      <h1 className="font-serif-display text-3xl sm:text-4xl md:text-[48px] font-medium leading-tight tracking-tight">
        Building on Success, Not Replicating It
      </h1>

      {/* Subtitle */}
      <p className="font-serif-display text-lg sm:text-xl leading-relaxed text-foreground/80">
        Hurdle learns from existing mechanisms while serving different segments and solving different bottlenecks.
      </p>

      {/* Comparison Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {competitors.map((competitor, index) => (
          <CompetitorCard key={competitor.name} competitor={competitor} index={index} />
        ))}
      </div>

      {/* Key Differentiator Callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass-card-sm p-8 bg-primary/10"
      >
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 p-4 rounded-full bg-primary/20">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-4">
            <h3 className="font-serif-display text-2xl font-medium text-foreground">
              The Hurdle Difference
            </h3>
            <p className="font-serif-display text-base text-foreground/80 leading-relaxed">
              We're not choosing between quality and speed, or between buyers and capital. We're solving the coordination problem that prevents all three stakeholders from operating efficiently.
            </p>
            <p className="font-serif-display text-base text-foreground/80 leading-relaxed">
              Frontier focuses on technology innovation. Symbiosis focuses on quality verification. NextGen focuses on buyer expansion. <span className="text-primary font-medium">Hurdle focuses on coordination to drive impact.</span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
