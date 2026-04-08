import { motion } from "framer-motion";
import { AlertCircle, Clock, Lock, TrendingDown } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Stakeholder Problem Data
const stakeholderProblems = [
  {
    stakeholder: "Buyers",
    icon: AlertCircle,
    heading: "Distrust Drives Inaction",
    body: "Buyers distrust carbon credits and struggle to overcome their fears.",
    quote: "Inaction is easier than participation",
  },
  {
    stakeholder: "Developers",
    icon: Clock,
    heading: "Diligence Burns Capital",
    body: "Developers face sequential diligence from buyers and capital providers.",
    quote: "Diligence delays capital and impact",
  },
  {
    stakeholder: "Capital Providers",
    icon: Lock,
    heading: "Delay Stops Scale",
    body: "Funders underwrite projects one-by-one to mitigate heterogeneous risks.",
    quote: "Bespoke deals prevent scale",
  },
];

// Stakeholder Card Component
function StakeholderCard({ problem, index }: { problem: typeof stakeholderProblems[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      className="h-full"
    >
      <div className="glass-card-sm p-6 h-full flex flex-col">
        {/* Icon + Stakeholder label on same line */}
        <div className="flex items-center gap-2 mb-4">
          <problem.icon className="h-5 w-5 text-primary" />
          <span className="font-serif-display text-primary">{problem.stakeholder}</span>
        </div>

        {/* Heading */}
        <h3 className="font-serif-display font-medium text-lg text-foreground mb-2">
          {problem.heading}
        </h3>

        {/* Body */}
        <p className="font-serif-display text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
          {problem.body}
        </p>

        {/* Pull quote */}
        <div className="border-l-2 border-primary pl-3 mt-auto">
          <p className="font-serif-display text-sm italic text-foreground/80">
            {problem.quote}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Market Scale Visualization - n×m explosion
function MarketScaleVisualization() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass-card-sm p-8"
    >
      {/* Visualization Header */}
      <h3 className="font-serif-display text-xl md:text-2xl font-medium text-center mb-8">
        The Diligence & Contractual Explosion
      </h3>

      {/* Network diagram visualization */}
      <div className="relative w-full max-w-2xl mx-auto">
        <svg
          viewBox="0 0 600 240"
          className="w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Column labels - small caps sans-serif like eyebrow */}
          <text x="80" y="20" textAnchor="middle" className="text-[10px] uppercase tracking-[0.15em] fill-muted-foreground" style={{ fontFamily: 'sans-serif' }}>
            Capital Providers
          </text>
          <text x="300" y="20" textAnchor="middle" className="text-[10px] uppercase tracking-[0.15em] fill-muted-foreground" style={{ fontFamily: 'sans-serif' }}>
            Developers
          </text>
          <text x="520" y="20" textAnchor="middle" className="text-[10px] uppercase tracking-[0.15em] fill-muted-foreground" style={{ fontFamily: 'sans-serif' }}>
            Buyers
          </text>

          {/* Capital Providers column (left) - 5 circles */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={`funder-${i}`}>
              <circle
                cx="80"
                cy={50 + i * 35}
                r="12"
                fill="hsl(var(--primary))"
                opacity="0.8"
              />
            </g>
          ))}

          {/* Developers column (center) - 4 circles, centered */}
          {[0, 1, 2, 3].map((i) => (
            <g key={`developer-${i}`}>
              <circle
                cx="300"
                cy={67.5 + i * 35}
                r="12"
                fill="hsl(var(--foreground))"
                opacity="0.6"
              />
            </g>
          ))}

          {/* Buyers column (right) - 5 circles */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={`buyer-${i}`}>
              <circle
                cx="520"
                cy={50 + i * 35}
                r="12"
                fill="hsl(var(--primary))"
                opacity="0.8"
              />
            </g>
          ))}

          {/* Connection lines - Capital Providers to Developers */}
          {[0, 1, 2, 3, 4].map((f) =>
            [0, 1, 2, 3].map((d) => (
              <line
                key={`fd-${f}-${d}`}
                x1="92"
                y1={50 + f * 35}
                x2="288"
                y2={67.5 + d * 35}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.5"
                opacity="0.2"
              />
            ))
          )}
          {/* Connection lines - Developers to Buyers */}
          {[0, 1, 2, 3].map((d) =>
            [0, 1, 2, 3, 4].map((b) => (
              <line
                key={`db-${d}-${b}`}
                x1="312"
                y1={67.5 + d * 35}
                x2="508"
                y2={50 + b * 35}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.5"
                opacity="0.2"
              />
            ))
          )}
        </svg>
      </div>

      <div className="text-center mt-6 space-y-2">
        <p className="font-serif-display text-xl md:text-2xl font-medium text-foreground">
          Fears about integrity and quality have led to geometric complexity.
        </p>
        <p className="font-serif-display text-xl md:text-2xl font-medium text-primary">
          Developers bear the burden.
        </p>
        <p className="font-serif-display text-sm text-muted-foreground mt-4 px-4">
          Each relationship requires separate diligence, separate contracts, separate financing
        </p>
      </div>
    </motion.div>
  );
}

export function ProblemSection() {
  return (
    <motion.div {...fadeInUp} className="space-y-8 max-w-5xl mx-auto">
      {/* Section Eyebrow */}
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        A BROKEN STOOL
      </span>

      {/* Main Heading - 48px serif */}
      <h1 className="font-serif-display text-3xl sm:text-4xl md:text-[48px] font-medium leading-tight tracking-tight">
        Today's System is Failing Everyone
      </h1>

      {/* Subheading */}
      <p className="font-serif-display text-lg sm:text-xl leading-relaxed text-foreground/80">
        Carbon markets are failing to direct capital at the scale and speed required due to coordination failures between buyers, developers, and capital providers.
      </p>

      {/* 3-column grid of stakeholder cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {stakeholderProblems.map((problem, index) => (
          <StakeholderCard key={problem.stakeholder} problem={problem} index={index} />
        ))}
      </div>

      {/* Market Scale Visualization */}
      <MarketScaleVisualization />

      {/* The Real Cost Card - Full width, emphasized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="bg-primary/10 rounded-3xl p-8 md:p-10">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 p-4 rounded-2xl bg-primary/20">
              <TrendingDown className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-4">
              <h3 className="font-serif-display text-2xl md:text-3xl font-medium">
                The Inevitable Outcome: Gridlock
              </h3>
              <p className="font-serif-display text-lg text-foreground/80 leading-relaxed max-w-3xl">
                The market stalls under the weight of its own good intentions. Good projects are constrained not by quality, but by a failure to coordinate motivated, well-intentioned parties.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
