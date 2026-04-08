import { motion } from "framer-motion";
import { ContentCard } from "@/components/deck/ContentCard";
import { Target } from "lucide-react";
import type { Metric } from "@/hooks/useDeckData";
import { PlaceholderSection } from "./SectionComponents";
import { StatusBadge } from "@/components/presentation/StatusBadge";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

interface MetricsSectionProps {
  metrics: Metric[];
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  if (metrics.length === 0) {
    return <PlaceholderSection title="Metrics" />;
  }

  return (
    <motion.div {...fadeInUp} className="space-y-6">
      <div className="mb-6">
        <span className="label-text text-primary block mb-2">Performance</span>
        <h2 className="section-title flex items-center gap-3">
          <Target className="h-7 w-7 text-primary" />
          Key Metrics
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <MetricCard metric={metric} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <ContentCard size="md" className="h-full">
      <div className="flex items-start justify-between mb-4">
        <h4 className="font-serif-display font-medium text-lg">{metric.title}</h4>
      </div>

      <div className="space-y-3">
        {metric.current_value && (
          <div>
            <p className="label-text">Current</p>
            <p className="text-2xl font-serif-display font-medium mt-1">{metric.current_value}</p>
          </div>
        )}

        <div className="flex gap-4">
          {metric.baseline_value && (
            <div>
              <p className="label-text">Baseline</p>
              <p className="font-serif-body font-medium mt-1">{metric.baseline_value}</p>
            </div>
          )}
          {metric.target_value && (
            <div>
              <p className="label-text">Target</p>
              <p className="font-serif-body font-medium mt-1">{metric.target_value}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <StatusBadge status={metric.status} showIcon />
      </div>
    </ContentCard>
  );
}
