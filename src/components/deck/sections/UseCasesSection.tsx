import { motion } from "framer-motion";
import { ContentCard, CardBody } from "@/components/deck/ContentCard";
import { Lightbulb } from "lucide-react";
import type { UseCase } from "@/hooks/useDeckData";
import { PlaceholderSection } from "./SectionComponents";
import { StatusBadge } from "@/components/presentation/StatusBadge";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

interface UseCasesSectionProps {
  useCases: UseCase[];
}

export function UseCasesSection({ useCases }: UseCasesSectionProps) {
  if (useCases.length === 0) {
    return <PlaceholderSection title="Use Cases" />;
  }

  const groupedByCategory = useCases.reduce((acc, uc) => {
    const category = uc.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(uc);
    return acc;
  }, {} as Record<string, UseCase[]>);

  return (
    <motion.div {...fadeInUp} className="space-y-8">
      <div className="mb-6">
        <span className="label-text text-primary block mb-2">Applications</span>
        <h2 className="section-title flex items-center gap-3">
          <Lightbulb className="h-7 w-7 text-primary" />
          Use Cases
        </h2>
      </div>

      {Object.entries(groupedByCategory).map(([category, cases]) => (
        <div key={category}>
          <h3 className="font-serif-display text-lg font-medium mb-4 text-muted-foreground">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {cases.map((useCase, i) => (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <UseCaseCard useCase={useCase} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  return (
    <ContentCard size="md" className="h-full">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-serif-display font-medium text-lg">{useCase.title}</h4>
        <StatusBadge status={useCase.status} />
      </div>
      {useCase.description && (
        <CardBody>{useCase.description}</CardBody>
      )}
    </ContentCard>
  );
}
