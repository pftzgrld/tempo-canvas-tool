import { motion } from "framer-motion";
import { ContentCard } from "@/components/deck/ContentCard";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  ExternalLink,
  Folder,
  Plus,
  Trash2
} from "lucide-react";
import type { Resource } from "@/hooks/useDeckData";
import { SlideHeader, GridLayout } from "../SlideLayouts";
import type { LucideIcon } from "lucide-react";
import { EditableText } from "@/components/editing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResourcesSlideProps {
  resources: Resource[];
  isEditMode?: boolean;
  mutations?: {
    addResource: { mutate: (data: { deck_id: string; title: string; category?: string; icon?: string }) => void };
    updateResource: { mutate: (data: { id: string; title?: string; url?: string; category?: string; icon?: string }) => void };
    deleteResource: { mutate: (id: string) => void };
  };
  deckId?: string;
}

export function ResourcesSlide({ resources, isEditMode, mutations, deckId }: ResourcesSlideProps) {
  const groupedByCategory = resources.reduce((acc, r) => {
    const category = r.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(r);
    return acc;
  }, {} as Record<string, Resource[]>);

  const categories = Object.entries(groupedByCategory);

  const handleAddResource = () => {
    if (mutations && deckId) {
      mutations.addResource.mutate({
        deck_id: deckId,
        title: "New Resource",
        category: "General",
        icon: "link",
      });
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto md:overflow-hidden">
      <div className="min-h-full flex flex-col justify-start md:justify-center items-center p-6 pb-24 md:p-12 lg:p-16">
        <div className="w-full max-w-5xl">
        <SlideHeader 
          title="Resources" 
          icon={<BookOpen className="h-10 w-10" />}
        />

        <div className="space-y-6">
          {categories.map(([category, items], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + catIndex * 0.1, duration: 0.5 }}
            >
              <h3 className="font-serif-display text-lg font-medium mb-4 text-muted-foreground flex items-center gap-2">
                <Folder className="h-4 w-4" />
                {category}
              </h3>
              <GridLayout columns={3} gap="sm">
                {items.map((resource, i) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + catIndex * 0.1 + i * 0.08, duration: 0.5 }}
                  >
                    <ResourceSlideCard 
                      resource={resource} 
                      isEditMode={isEditMode}
                      mutations={mutations}
                    />
                  </motion.div>
                ))}
              </GridLayout>
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
                onClick={handleAddResource}
                className="w-full border-dashed border-2 py-6"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Resource
              </Button>
            </motion.div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

const iconMap: Record<string, LucideIcon> = {
  "document": FileText,
  "video": Video,
  "link": LinkIcon,
  "book": BookOpen,
};

interface ResourceSlideCardProps {
  resource: Resource;
  isEditMode?: boolean;
  mutations?: {
    updateResource: { mutate: (data: { id: string; title?: string; url?: string; category?: string; icon?: string }) => void };
    deleteResource: { mutate: (id: string) => void };
  };
}

function ResourceSlideCard({ resource, isEditMode, mutations }: ResourceSlideCardProps) {
  const Icon = iconMap[resource.icon || "link"] || LinkIcon;
  
  const getHostname = (url: string | null) => {
    if (!url) return null;
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return null;
    }
  };

  const hostname = getHostname(resource.url);

  const handleUpdate = (field: string, value: string) => {
    if (mutations) {
      mutations.updateResource.mutate({ id: resource.id, [field]: value });
    }
  };

  const handleDelete = () => {
    if (mutations) {
      mutations.deleteResource.mutate(resource.id);
    }
  };

  if (isEditMode && mutations) {
    return (
      <ContentCard size="md" className="h-full">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <EditableText
              value={resource.title}
              onSave={(value) => handleUpdate("title", value)}
              className="font-serif-display font-medium"
            />
            <Input
              value={resource.url || ""}
              onChange={(e) => handleUpdate("url", e.target.value)}
              placeholder="URL..."
              className="text-xs h-7"
            />
            <div className="flex gap-2">
              <Input
                value={resource.category || ""}
                onChange={(e) => handleUpdate("category", e.target.value)}
                placeholder="Category..."
                className="text-xs h-7 flex-1"
              />
              <Select
                value={resource.icon || "link"}
                onValueChange={(value) => handleUpdate("icon", value)}
              >
                <SelectTrigger className="w-[90px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </ContentCard>
    );
  }

  return (
    <a 
      href={resource.url || "#"} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group"
    >
      <ContentCard size="md" className="h-full group-hover:border-primary/30">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif-display font-medium truncate group-hover:text-primary transition-colors">
              {resource.title}
            </h4>
            {hostname && (
              <p className="text-xs text-muted-foreground font-sans-ui flex items-center gap-1 mt-1">
                <ExternalLink className="h-3 w-3" />
                {hostname}
              </p>
            )}
          </div>
        </div>
      </ContentCard>
    </a>
  );
}
