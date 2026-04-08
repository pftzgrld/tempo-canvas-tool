import { 
  Deck, 
  TeamMember, 
  Goal, 
  AgendaItem, 
  DEFAULT_SLIDE_ORDER 
} from "@/types/deck";

export const demoDeck: Deck = {
  id: "demo-deck-1",
  title: "Q1 2026 Investor Presentation",
  status: "published",
  slideOrder: DEFAULT_SLIDE_ORDER,
  hiddenSlides: [],
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20"),
};

export const demoTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Sarah Chen",
    title: "Customer Success Manager",
    email: "sarah.chen@company.com",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    teamType: "internal",
  },
  {
    id: "tm-2",
    name: "Marcus Johnson",
    title: "Solutions Architect",
    email: "marcus.j@company.com",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    teamType: "internal",
  },
  {
    id: "tm-3",
    name: "Emily Rodriguez",
    title: "Technical Lead",
    email: "emily.r@company.com",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    teamType: "internal",
  },
  {
    id: "tm-4",
    name: "David Park",
    title: "VP of Engineering",
    email: "david.park@customer.com",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    teamType: "customer",
  },
  {
    id: "tm-5",
    name: "Lisa Thompson",
    title: "Project Manager",
    email: "lisa.t@customer.com",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    teamType: "customer",
  },
];

export const demoGoals: Goal[] = [
  {
    id: "g-1",
    title: "Reduce onboarding time by 50%",
    status: "in-progress",
    progress: 65,
  },
  {
    id: "g-2",
    title: "Achieve 99.9% uptime SLA",
    status: "in-progress",
    progress: 88,
  },
  {
    id: "g-3",
    title: "Complete Phase 1 integration",
    status: "completed",
    progress: 100,
  },
  {
    id: "g-4",
    title: "Train 100+ end users",
    status: "not-started",
    progress: 0,
  },
];

export const demoAgendaItems: AgendaItem[] = [
  { id: "a-1", title: "Welcome & Introductions", duration: 5, order: 1 },
  { id: "a-2", title: "Executive Summary", duration: 10, order: 2 },
  { id: "a-3", title: "Goals & Success Metrics", duration: 15, order: 3 },
  { id: "a-4", title: "Team Overview", duration: 10, order: 4 },
  { id: "a-5", title: "Implementation Timeline", duration: 20, order: 5 },
  { id: "a-6", title: "Q&A and Next Steps", duration: 15, order: 6 },
];

export const demoExecutiveSummary = {
  summaryTitle: "Partnership Overview",
  summaryDescription: "Strategic partnership to modernize customer engagement platform, driving digital transformation across all touchpoints.",
  focusTitle: "Key Focus Areas",
  focusDescription: "API integration, data migration, and user training to ensure seamless adoption and maximize ROI.",
};

export const demoNextSteps = [
  "Finalize technical requirements by Jan 31",
  "Complete security review and compliance audit",
  "Schedule bi-weekly sync meetings",
  "Begin Phase 1 development sprint",
];
