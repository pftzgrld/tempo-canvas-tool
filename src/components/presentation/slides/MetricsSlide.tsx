import { motion } from "framer-motion";
import { ContentCard } from "@/components/deck/ContentCard";
import { BarChart3, Plus, Trash2 } from "lucide-react";
import type { Metric } from "@/hooks/useDeckData";
import { SlideHeader } from "../SlideLayouts";
import { EditableText } from "@/components/editing";
import { StatusBadge, getStatusOptions } from "../StatusBadge";
import type { useDeckMutations } from "@/hooks/useDeckMutations";

interface MetricsSlideProps {
  metrics: Metric[];
  isEditMode?: boolean;
  mutations?: ReturnType<typeof useDeckMutations>;
}

export function MetricsSlide({ metrics, isEditMode, mutations }: MetricsSlideProps) {
  // Limit to 6 metrics to prevent overflow
  const displayMetrics = metrics.slice(0, 6);

  const handleUpdateMetric = async (id: string, updates: Partial<Metric>) => {
    if (mutations) {
      await mutations.updateMetric.mutateAsync({ id, ...updates });
    }
  };

  const handleDeleteMetric = async (id: string) => {
    if (mutations) {
      await mutations.deleteMetric.mutateAsync(id);
    }
  };

  const handleAddMetric = async () => {
    if (mutations) {
      await mutations.addMetric.mutateAsync({
        title: "New Metric",
        current_value: "0",
        baseline_value: "0",
        target_value: "100",
        status: "stable",
      });
    }
  };
  
  return (
    <div className="w-full h-full overflow-y-auto md:overflow-hidden">
      <div className="min-h-full flex flex-col justify-start md:justify-center items-center p-6 pb-24 md:p-12 lg:p-16">
        <div className="w-full max-w-5xl">
          <SlideHeader 
            title="Key Metrics" 
            icon={<BarChart3 className="h-10 w-10" />}
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayMetrics.map((metric, i) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              >
                <MetricSlideCard 
                  metric={metric}
                  isEditMode={isEditMode}
                  onUpdate={(updates) => handleUpdateMetric(metric.id, updates)}
                  onDelete={() => handleDeleteMetric(metric.id)}
                />
              </motion.div>
            ))}
          </div>

          {isEditMode && metrics.length < 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <button
                onClick={handleAddMetric}
                className="w-full p-4 border-2 border-dashed border-muted-foreground/30 rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Metric
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricSlideCardProps {
  metric: Metric;
  isEditMode?: boolean;
  onUpdate?: (updates: Partial<Metric>) => void;
  onDelete?: () => void;
}

function MetricSlideCard({ metric, isEditMode, onUpdate, onDelete }: MetricSlideCardProps) {
  const statusOptions = getStatusOptions("metric");

  return (
    <ContentCard size="lg" className="h-full group">
      <div className="flex items-start justify-between mb-4">
        {isEditMode ? (
          <EditableText
            value={metric.title}
            onSave={(value) => onUpdate?.({ title: value })}
            isEditable={isEditMode}
            variant="title"
            placeholder="Metric name..."
            className="flex-1"
          />
        ) : (
          <h4 className="font-serif-display font-medium text-lg">{metric.title}</h4>
        )}
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <select
              value={metric.status || "stable"}
              onChange={(e) => onUpdate?.({ status: e.target.value })}
              className="text-xs px-2 py-1 rounded border bg-background"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : null}
          {isEditMode && (
            <button
              onClick={onDelete}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-center py-4">
          {isEditMode ? (
            <input
              type="text"
              value={metric.current_value || ""}
              onChange={(e) => onUpdate?.({ current_value: e.target.value })}
              className="text-4xl font-serif-display font-medium text-primary bg-transparent text-center w-full border-b border-dashed border-muted-foreground/30 focus:outline-none focus:border-primary"
              placeholder="Value"
            />
          ) : (
            <span className="text-4xl font-serif-display font-medium text-primary">
              {metric.current_value || "—"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="label-text">Baseline</span>
            {isEditMode ? (
              <input
                type="text"
                value={metric.baseline_value || ""}
                onChange={(e) => onUpdate?.({ baseline_value: e.target.value })}
                className="w-full font-serif-body font-medium mt-1 bg-transparent border-b border-dashed border-muted-foreground/30 focus:outline-none focus:border-primary"
                placeholder="Baseline"
              />
            ) : (
              <p className="font-serif-body font-medium mt-1">{metric.baseline_value || "—"}</p>
            )}
          </div>
          <div>
            <span className="label-text">Target</span>
            {isEditMode ? (
              <input
                type="text"
                value={metric.target_value || ""}
                onChange={(e) => onUpdate?.({ target_value: e.target.value })}
                className="w-full font-serif-body font-medium mt-1 bg-transparent border-b border-dashed border-muted-foreground/30 focus:outline-none focus:border-primary"
                placeholder="Target"
              />
            ) : (
              <p className="font-serif-body font-medium mt-1">{metric.target_value || "—"}</p>
            )}
          </div>
        </div>
      </div>

      {!isEditMode && (
        <div className="mt-4">
          <StatusBadge status={metric.status} showIcon size="sm" />
        </div>
      )}
    </ContentCard>
  );
}
