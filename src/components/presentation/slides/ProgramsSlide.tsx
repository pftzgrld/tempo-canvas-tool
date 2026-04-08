import { motion } from "framer-motion";
import { ContentCard, CardBody } from "@/components/deck/ContentCard";
import { FolderKanban, Calendar, Plus, Trash2 } from "lucide-react";
import type { Program } from "@/hooks/useDeckData";
import { format } from "date-fns";
import { SlideHeader } from "../SlideLayouts";
import { EditableText } from "@/components/editing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, getStatusOptions } from "../StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProgramsSlideProps {
  programs: Program[];
  isEditMode?: boolean;
  mutations?: {
    addProgram: { mutate: (data: { deck_id: string; title: string; status?: string }) => void };
    updateProgram: { mutate: (data: { id: string; title?: string; description?: string; status?: string; start_date?: string; end_date?: string }) => void };
    deleteProgram: { mutate: (id: string) => void };
  };
  deckId?: string;
}

export function ProgramsSlide({ programs, isEditMode, mutations, deckId }: ProgramsSlideProps) {
  const handleAddProgram = () => {
    if (mutations && deckId) {
      mutations.addProgram.mutate({
        deck_id: deckId,
        title: "New Program",
        status: "planned",
      });
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto md:overflow-hidden">
      <div className="min-h-full flex flex-col justify-start md:justify-center items-center p-6 pb-24 md:p-12 lg:p-16">
        <div className="w-full max-w-4xl">
          <SlideHeader 
            title="Programs" 
            icon={<FolderKanban className="h-10 w-10" />}
          />

          <div className="space-y-4">
            {programs.map((program, i) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              >
                <ProgramSlideCard 
                  program={program} 
                  isEditMode={isEditMode}
                  mutations={mutations}
                />
              </motion.div>
            ))}

            {/* Add button */}
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddProgram}
                  className="w-full border-dashed border-2 py-6"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Program
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProgramSlideCardProps {
  program: Program;
  isEditMode?: boolean;
  mutations?: {
    updateProgram: { mutate: (data: { id: string; title?: string; description?: string; status?: string; start_date?: string; end_date?: string }) => void };
    deleteProgram: { mutate: (id: string) => void };
  };
}

function ProgramSlideCard({ program, isEditMode, mutations }: ProgramSlideCardProps) {
  const statusOptions = getStatusOptions("program");

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleUpdate = (field: string, value: string) => {
    if (mutations) {
      mutations.updateProgram.mutate({ id: program.id, [field]: value });
    }
  };

  const handleDelete = () => {
    if (mutations) {
      mutations.deleteProgram.mutate(program.id);
    }
  };

  if (isEditMode && mutations) {
    return (
      <ContentCard size="lg">
        <div className="flex items-start justify-between mb-3 gap-4">
          <div className="flex-1">
            <EditableText
              value={program.title}
              onSave={(value) => handleUpdate("title", value)}
              className="font-serif-display font-medium text-xl mb-1"
            />
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                type="date"
                value={program.start_date || ""}
                onChange={(e) => handleUpdate("start_date", e.target.value)}
                className="h-8 w-[140px] text-sm"
              />
              <span className="text-muted-foreground">→</span>
              <Input
                type="date"
                value={program.end_date || ""}
                onChange={(e) => handleUpdate("end_date", e.target.value)}
                className="h-8 w-[140px] text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Select
              value={program.status || "planned"}
              onValueChange={(value) => handleUpdate("status", value)}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Input
          value={program.description || ""}
          onChange={(e) => handleUpdate("description", e.target.value)}
          placeholder="Description..."
          className="text-sm"
        />
      </ContentCard>
    );
  }

  return (
    <ContentCard size="lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-serif-display font-medium text-xl mb-1">{program.title}</h4>
          {(program.start_date || program.end_date) && (
            <div className="flex items-center gap-1.5 mt-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-sans-ui text-muted-foreground">
                {formatDate(program.start_date)}
                {program.end_date && ` → ${formatDate(program.end_date)}`}
              </span>
            </div>
          )}
        </div>
        <StatusBadge status={program.status} size="md" />
      </div>
      {program.description && (
        <CardBody>{program.description}</CardBody>
      )}
    </ContentCard>
  );
}
