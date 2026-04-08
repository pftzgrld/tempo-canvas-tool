import { motion } from "framer-motion";
import { ContentCard, CardBody } from "@/components/deck/ContentCard";
import { FolderKanban, Calendar } from "lucide-react";
import type { Program } from "@/hooks/useDeckData";
import { PlaceholderSection } from "./SectionComponents";
import { format } from "date-fns";
import { StatusBadge } from "@/components/presentation/StatusBadge";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

interface ProgramsSectionProps {
  programs: Program[];
}

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  if (programs.length === 0) {
    return <PlaceholderSection title="Programs" />;
  }

  return (
    <motion.div {...fadeInUp} className="space-y-6">
      <div className="mb-6">
        <span className="label-text text-primary block mb-2">Initiatives</span>
        <h2 className="section-title flex items-center gap-3">
          <FolderKanban className="h-7 w-7 text-primary" />
          Programs
        </h2>
      </div>

      <div className="grid gap-4">
        {programs.map((program, i) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <ProgramCard program={program} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ProgramCard({ program }: { program: Program }) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <ContentCard size="md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-serif-display font-medium text-lg">{program.title}</h4>
          {(program.start_date || program.end_date) && (
            <div className="flex items-center gap-1.5 mt-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-sans-ui text-muted-foreground">
                {formatDate(program.start_date)}
                {program.end_date && ` → ${formatDate(program.end_date)}`}
              </span>
            </div>
          )}
        </div>
        <StatusBadge status={program.status} />
      </div>
      {program.description && (
        <CardBody>{program.description}</CardBody>
      )}
    </ContentCard>
  );
}
