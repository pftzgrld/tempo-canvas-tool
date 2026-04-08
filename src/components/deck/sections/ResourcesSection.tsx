import { motion } from "framer-motion";
import { ContentCard } from "@/components/deck/ContentCard";
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  Video, 
  Link2, 
  FolderOpen,
  type LucideIcon 
} from "lucide-react";
import type { Resource } from "@/hooks/useDeckData";
import { PlaceholderSection } from "./SectionComponents";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

interface ResourcesSectionProps {
  resources: Resource[];
}

export function ResourcesSection({ resources }: ResourcesSectionProps) {
  if (resources.length === 0) {
    return <PlaceholderSection title="Resources" />;
  }

  const groupedByCategory = resources.reduce((acc, r) => {
    const category = r.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(r);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <motion.div {...fadeInUp} className="space-y-8">
      <div className="mb-6">
        <span className="label-text text-primary block mb-2">Documentation</span>
        <h2 className="section-title flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          Resources
        </h2>
      </div>

      {Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category}>
          <h3 className="font-serif-display text-lg font-medium mb-4 text-muted-foreground">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((resource, i) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

const iconMap: Record<string, LucideIcon> = {
  "document": FileText,
  "video": Video,
  "link": Link2,
  "folder": FolderOpen,
};

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = iconMap[resource.icon || ""] || Link2;

  const getHostname = (url: string | null) => {
    if (!url) return null;
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <a 
      href={resource.url || "#"} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group"
    >
      <ContentCard size="md" className="h-full group-hover:border-primary/30">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-serif-display font-medium truncate">{resource.title}</h4>
              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            {resource.url && (
              <p className="text-xs text-muted-foreground font-sans-ui truncate mt-1">
                {getHostname(resource.url)}
              </p>
            )}
          </div>
        </div>
      </ContentCard>
    </a>
  );
}
