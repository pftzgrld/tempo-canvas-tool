export type SlideType =
  | "title"
  | "agenda"
  | "executive-summary"
  | "priorities"
  | "team-introductions"
  | "goals"
  | "metrics"
  | "use-cases"
  | "programs"
  | "milestones"
  | "resources"
  | "closing"
  | "thank-you";

export interface SlideDefinition {
  id: SlideType;
  label: string;
  sectionKey?: string;
  icon?: string;
}

export const SLIDE_DEFINITIONS: Record<SlideType, SlideDefinition> = {
  "title": { id: "title", label: "Title" },
  "agenda": { id: "agenda", label: "Agenda", sectionKey: "agenda" },
  "executive-summary": { id: "executive-summary", label: "Executive Summary", sectionKey: "executive-summary" },
  "priorities": { id: "priorities", label: "Business Outcomes", sectionKey: "priorities" },
  "team-introductions": { id: "team-introductions", label: "Team", sectionKey: "team" },
  "goals": { id: "goals", label: "Goals", sectionKey: "goals" },
  "metrics": { id: "metrics", label: "Metrics", sectionKey: "metrics" },
  "use-cases": { id: "use-cases", label: "Use Cases", sectionKey: "use-cases" },
  "programs": { id: "programs", label: "Programs", sectionKey: "programs" },
  "milestones": { id: "milestones", label: "Milestones", sectionKey: "milestones" },
  "resources": { id: "resources", label: "Resources", sectionKey: "resources" },
  "closing": { id: "closing", label: "Next Steps" },
  "thank-you": { id: "thank-you", label: "Thank You" },
};

export const DEFAULT_SLIDE_ORDER: SlideType[] = [
  "title",
  "agenda",
  "executive-summary",
  "priorities",
  "team-introductions",
  "goals",
  "metrics",
  "use-cases",
  "programs",
  "milestones",
  "resources",
  "closing",
  "thank-you",
];

// Demo data types
export interface Deck {
  id: string;
  title: string;
  status: "draft" | "published";
  slideOrder: SlideType[];
  hiddenSlides: SlideType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  email?: string;
  photoUrl?: string;
  teamType: "internal" | "customer";
}

export interface Goal {
  id: string;
  title: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
}

export interface AgendaItem {
  id: string;
  title: string;
  duration: number;
  order: number;
}

export interface Slide {
  id: SlideType;
  label: string;
  sectionKey?: string;
}
