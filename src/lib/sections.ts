import {
  FileText,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  BookOpen,
  LucideIcon,
} from "lucide-react";

export type SectionId =
  | "executive-summary"
  | "the-problem"
  | "the-solution"
  | "how-different"
  | "commercial-model"
  | "what-we-need"
  | "timeline"
  | "deep-dive";

export interface SectionDefinition {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  description?: string;
}

export const SECTIONS: SectionDefinition[] = [
  { id: "executive-summary", label: "Exec Summary", icon: FileText, description: "Overview and key highlights" },
  { id: "the-problem", label: "Problem", icon: AlertCircle, description: "Market pain points" },
  { id: "the-solution", label: "Solution", icon: Lightbulb, description: "Our approach" },
  { id: "how-different", label: "Positioning", icon: TrendingUp, description: "Competitive advantages" },
  { id: "commercial-model", label: "Commercial Model", icon: DollarSign, description: "Revenue and pricing" },
  { id: "what-we-need", label: "Actions", icon: Users, description: "Investment ask" },
  { id: "timeline", label: "Timeline", icon: Calendar, description: "Key milestones" },
  { id: "deep-dive", label: "Deep Dive", icon: BookOpen, description: "Detailed analysis" },
];

export function getSectionById(id: SectionId): SectionDefinition | undefined {
  return SECTIONS.find((s) => s.id === id);
}
