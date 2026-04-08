import { motion } from "framer-motion";
import { ContentCard, CardBody } from "@/components/deck/ContentCard";
import { Lightbulb, Plus, Trash2 } from "lucide-react";
import type { UseCase } from "@/hooks/useDeckData";
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

interface UseCasesSlideProps {
  useCases: UseCase[];
  isEditMode?: boolean;
  mutations?: {
    addUseCase: { mutate: (data: { deck_id: string; title: string; status?: string; category?: string }) => void };
    updateUseCase: { mutate: (data: { id: string; title?: string; description?: string; status?: string; category?: string }) => void };
    deleteUseCase: { mutate: (id: string) => void };
  };
  deckId?: string;
}

export function UseCasesSlide({ useCases, isEditMode, mutations, deckId }: UseCasesSlideProps) {
  const groupedByCategory = useCases.reduce((acc, uc) => {
    const category = uc.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(uc);
    return acc;
  }, {} as Record<string, UseCase[]>);

  const categories = Object.entries(groupedByCategory);

  const handleAddUseCase = () => {
    if (mutations && deckId) {
      mutations.addUseCase.mutate({
        deck_id: deckId,
        title: "New Use Case",
        status: "planned",
        category: "General",
      });
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto md:overflow-hidden">
      <div className="min-h-full flex flex-col justify-start md:justify-center items-center p-6 pb-24 md:p-12 lg:p-16">
        <div className="w-full max-w-5xl">
        <SlideHeader 
          title="Use Cases" 
          icon={<Lightbulb className="h-10 w-10" />}
        />

        <div className="space-y-6">
          {categories.map(([category, cases], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + catIndex * 0.1, duration: 0.5 }}
            >
              <h3 className="font-serif-display text-lg font-medium mb-4 text-muted-foreground">
                {category}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {cases.map((useCase, i) => (
                  <motion.div
                    key={useCase.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + catIndex * 0.1 + i * 0.08, duration: 0.5 }}
                  >
                    <UseCaseSlideCard 
                      useCase={useCase} 
                      isEditMode={isEditMode}
                      mutations={mutations}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Empty state / Add button */}
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddUseCase}
                className="w-full border-dashed border-2 py-6"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Use Case
              </Button>
            </motion.div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

interface UseCaseSlideCardProps {
  useCase: UseCase;
  isEditMode?: boolean;
  mutations?: {
    updateUseCase: { mutate: (data: { id: string; title?: string; description?: string; status?: string; category?: string }) => void };
    deleteUseCase: { mutate: (id: string) => void };
  };
}

function UseCaseSlideCard({ useCase, isEditMode, mutations }: UseCaseSlideCardProps) {
  const statusOptions = getStatusOptions("default");

  const handleUpdate = (field: string, value: string) => {
    if (mutations) {
      mutations.updateUseCase.mutate({ id: useCase.id, [field]: value });
    }
  };

  const handleDelete = () => {
    if (mutations) {
      mutations.deleteUseCase.mutate(useCase.id);
    }
  };

  if (isEditMode && mutations) {
    return (
      <ContentCard size="md" className="h-full">
        <div className="flex items-start justify-between gap-2 mb-2">
          <EditableText
            value={useCase.title}
            onSave={(value) => handleUpdate("title", value)}
            className="font-serif-display font-medium text-lg flex-1"
          />
          <div className="flex items-center gap-2 shrink-0">
            <Select
              value={useCase.status || "planned"}
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
          value={useCase.description || ""}
          onChange={(e) => handleUpdate("description", e.target.value)}
          placeholder="Description..."
          className="text-sm"
        />
        <Input
          value={useCase.category || ""}
          onChange={(e) => handleUpdate("category", e.target.value)}
          placeholder="Category..."
          className="text-sm mt-2"
        />
      </ContentCard>
    );
  }

  return (
    <ContentCard size="md" className="h-full">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-serif-display font-medium text-lg">{useCase.title}</h4>
        <StatusBadge status={useCase.status} />
      </div>
      {useCase.description && (
        <CardBody className="line-clamp-2">{useCase.description}</CardBody>
      )}
    </ContentCard>
  );
}
