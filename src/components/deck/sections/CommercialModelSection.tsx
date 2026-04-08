import { motion } from "framer-motion";
import { Layers, BarChart3, PiggyBank, TrendingUp, ArrowRight } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Fee structure data
const feeStructure = [
  {
    percentage: "3%",
    label: "Annual fee on committed capital",
    explanation: "Covers centralised diligence, and lean team. Predictable revenue enables scalable operations.",
    icon: Layers,
  },
  {
    percentage: "1%",
    label: "Fee on credits\ndelivered",
    explanation: "Aligns Hurdle's success with actual deployment. Only earned when projects deliver and buyers receive credits.",
    icon: BarChart3,
  },
  {
    percentage: "20%",
    label: "Of savings below target prices",
    explanation: "Rewards for efficient coordination and scale discounts that buyers could not otherwise achieve.",
    icon: PiggyBank,
  },
];

// Comparison data
const traditionalModel = [
  "High per-credit margin",
  "Hidden in price spread",
  "No alignment with efficiency",
  "Materially reduces capital flows to projects",
];

const hurdleModel = [
  "Transparent & low fee structure",
  "Spread across multiple buyers",
  "Aligned with cost reduction",
  "Maximises impact on the ground",
];

function FeeCard({ fee, index }: { fee: typeof feeStructure[0]; index: number }) {
  const Icon = fee.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
      className="glass-card-sm p-6 h-full flex flex-col"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-serif-display text-4xl font-medium text-primary">
            {fee.percentage}
          </p>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-1 whitespace-pre-line">
            {fee.label}
          </p>
        </div>
      </div>
      <p className="font-serif-display text-sm text-foreground/80 leading-relaxed">
        {fee.explanation}
      </p>
    </motion.div>
  );
}

function ComparisonSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="grid gap-6 md:grid-cols-2"
    >
      {/* Traditional Model */}
      <div className="glass-card-sm p-6">
        <h3 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">
          Traditional Broker Model
        </h3>
        <ul className="space-y-3">
          {traditionalModel.map((item, i) => (
            <li key={i} className="font-serif-display text-sm text-foreground/60 flex items-start gap-2">
              <span className="text-muted-foreground mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Hurdle Model */}
      <div className="glass-card-sm p-6 bg-primary/15 border-primary/30 ring-1 ring-primary/20">
        <h3 className="text-xs uppercase tracking-[0.15em] text-primary mb-4">
          Hurdle Model
        </h3>
        <ul className="space-y-3">
          {hurdleModel.map((item, i) => (
            <li key={i} className="font-serif-display text-sm text-foreground/90 flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function CommercialModelSection() {
  return (
    <motion.div {...fadeInUp} className="space-y-8 max-w-5xl mx-auto">
      {/* Section Eyebrow */}
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        BUSINESS MODEL
      </span>

      {/* Main Heading */}
      <h1 className="font-serif-display text-3xl sm:text-4xl md:text-[48px] font-medium leading-tight tracking-tight">
        Lean Fees, Maximum Impact
      </h1>

      {/* Subtitle */}
      <p className="font-serif-display text-lg sm:text-xl leading-relaxed text-foreground/80">
        Hurdle charges fees on committed capital plus performance fees based on price and volumetric targets. This funds professional infrastructure while maximising capital flows to projects.
      </p>

      {/* Fee Structure Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {feeStructure.map((fee, index) => (
          <FeeCard key={fee.label} fee={fee} index={index} />
        ))}
      </div>

      {/* Benefits Subheader */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="font-serif-display text-2xl sm:text-3xl font-medium text-foreground pt-4"
      >
        The Benefits
      </motion.h2>

      {/* Value Distribution Comparison */}
      <ComparisonSection />

      {/* Results Subheader */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="font-serif-display text-2xl sm:text-3xl font-medium text-foreground pt-4"
      >
        The Results
      </motion.h2>

      {/* Results Cards - Row of 3 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* More Capital to Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glass-card-sm p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif-display text-xl font-medium text-foreground">
                More Capital to Projects
              </h3>
              <p className="font-serif-display text-sm text-foreground/80 leading-relaxed">
                By charging fees on committed capital rather than extracting margins from each credit, we eliminate traditional intermediary markup.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Commercial Discipline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="glass-card-sm p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-foreground/10">
              <ArrowRight className="h-6 w-6 text-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif-display text-xl font-medium text-foreground">
                Commercial Discipline
              </h3>
              <p className="font-serif-display text-sm text-foreground/80 leading-relaxed">
                Unlike nonprofit mechanisms dependent on philanthropic funding cycles, committed revenue enables rapid scaling, consistent quarterly deployment, and operational certainty.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Built for Scale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="glass-card-sm p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-primary/20">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif-display text-xl font-medium text-foreground">
                Built for Scale
              </h3>
              <p className="font-serif-display text-sm text-foreground/80 leading-relaxed">
                Hurdle is built to scale the market by expanding in two dimensions. First, by expanding into new specifications. Second, by increasing participation in each specification.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
