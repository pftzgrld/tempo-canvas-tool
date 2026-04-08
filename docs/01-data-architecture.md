# PRD 01: Data Architecture

## Overview

This document defines the database schema, relationships, and data access patterns for the Kickoff Deck mini app.

---

## Database Schema

### Core Tables

#### 1. `decks` - Main Deck Entity

```sql
CREATE TABLE public.decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  owner_id UUID REFERENCES auth.users(id),
  
  -- Metadata
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft' | 'published'
  
  -- Slide Configuration (stored as JSON for flexibility)
  slide_order TEXT[], -- Array of slide type IDs
  hidden_slides TEXT[], -- Array of hidden slide type IDs
  visible_sections TEXT[], -- Array of visible section IDs
  
  -- Closing slide content
  closing_next_steps TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their decks"
  ON public.decks FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can manage their decks"
  ON public.decks FOR ALL
  USING (auth.uid() = owner_id);
```

#### 2. `deck_sections` - Section Content

Each section type has its own table for type safety and efficient querying.

```sql
-- Example: Team Members Section
CREATE TABLE public.deck_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE,
  
  -- Content
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  calendar_link TEXT,
  team_type TEXT DEFAULT 'internal', -- 'internal' | 'customer'
  
  -- Display
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deck_team_members ENABLE ROW LEVEL SECURITY;

-- Policies (inherit from deck ownership)
CREATE POLICY "Users can view team members for their decks"
  ON public.deck_team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = deck_team_members.deck_id
      AND decks.owner_id = auth.uid()
    )
  );
```

#### 3. Section Tables Pattern

Apply this pattern for each section type:

| Section | Table Name | Key Fields |
|---------|-----------|------------|
| Executive Summary | `deck_executive_summary` | summary_title, summary_description, focus_title, focus_description |
| Team Members | `deck_team_members` | name, title, email, team_type, display_order |
| Goals | `deck_goals` | title, status, priority, due_date, progress_percent |
| Metrics | `deck_metrics` | title, baseline_value, target_value, status |
| Use Cases | `deck_use_cases` | title, description, category, status |
| Programs | `deck_programs` | title, description, status, start_date, end_date |
| Milestones | `deck_milestones` | title, date, status, program_id |
| Governance | `deck_governance` | title, type, frequency, attendees |
| Resources | `deck_resources` | title, url, category, icon |
| Risks | `deck_risks` | title, type, severity, mitigation, status |
| Next Meeting | `deck_next_meeting` | title, meeting_date, meeting_time, agenda_items |
| Calls | `deck_calls` | title, call_date, notes, action_items |
| Agenda | `deck_agenda` | title, description, duration, display_order |
| Priorities | `deck_priorities` | title, status, owner_type, due_date |

---

## Slide Type Definitions

```typescript
// src/types/slides.ts

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
  | "governance"
  | "resources"
  | "next-meeting"
  | "recent-calls"
  | "closing";

export interface SlideDefinition {
  id: SlideType;
  label: string;
  sectionKey?: string; // Maps to section visibility
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
  "governance": { id: "governance", label: "Governance", sectionKey: "governance" },
  "resources": { id: "resources", label: "Resources", sectionKey: "resources" },
  "next-meeting": { id: "next-meeting", label: "Next Meeting", sectionKey: "next-meeting" },
  "recent-calls": { id: "recent-calls", label: "Recent Calls", sectionKey: "calls" },
  "closing": { id: "closing", label: "Closing" },
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
  "governance",
  "resources",
  "next-meeting",
  "recent-calls",
  "closing",
];
```

---

## Data Access Hooks

### Primary Data Hook

```typescript
// src/hooks/useDeckData.ts

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DeckData {
  deck: Deck | null;
  executiveSummary: ExecutiveSummary | null;
  teamMembers: TeamMember[];
  goals: Goal[];
  metrics: Metric[];
  useCases: UseCase[];
  programs: Program[];
  milestones: MilestoneWithTasks[];
  governance: Governance[];
  resources: Resource[];
  risks: Risk[];
  nextMeeting: NextMeeting | null;
  calls: Call[];
  agendaItems: AgendaItem[];
  priorities: Priority[];
  isLoading: boolean;
  error: Error | null;
}

export function useDeckData(deckId: string | undefined): DeckData {
  // Fetch main deck
  const deckQuery = useQuery({
    queryKey: ["deck", deckId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", deckId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!deckId,
  });

  // Fetch all sections in parallel
  const sectionsQuery = useQuery({
    queryKey: ["deck-sections", deckId],
    queryFn: async () => {
      const [
        executiveSummary,
        teamMembers,
        goals,
        metrics,
        useCases,
        programs,
        milestones,
        governance,
        resources,
        risks,
        nextMeeting,
        calls,
        agenda,
        priorities,
      ] = await Promise.all([
        supabase.from("deck_executive_summary").select("*").eq("deck_id", deckId).single(),
        supabase.from("deck_team_members").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_goals").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_metrics").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_use_cases").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_programs").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_milestones").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_governance").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_resources").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_risks").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_next_meeting").select("*").eq("deck_id", deckId).single(),
        supabase.from("deck_calls").select("*").eq("deck_id", deckId).order("call_date", { ascending: false }),
        supabase.from("deck_agenda").select("*").eq("deck_id", deckId).order("display_order"),
        supabase.from("deck_priorities").select("*").eq("deck_id", deckId).order("display_order"),
      ]);

      return {
        executiveSummary: executiveSummary.data,
        teamMembers: teamMembers.data || [],
        goals: goals.data || [],
        metrics: metrics.data || [],
        useCases: useCases.data || [],
        programs: programs.data || [],
        milestones: milestones.data || [],
        governance: governance.data || [],
        resources: resources.data || [],
        risks: risks.data || [],
        nextMeeting: nextMeeting.data,
        calls: calls.data || [],
        agendaItems: agenda.data || [],
        priorities: priorities.data || [],
      };
    },
    enabled: !!deckId,
  });

  return {
    deck: deckQuery.data ?? null,
    ...sectionsQuery.data,
    isLoading: deckQuery.isLoading,
    error: deckQuery.error || sectionsQuery.error,
  };
}
```

### Mutations Hook (Modular Pattern)

```typescript
// src/hooks/useDeckMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDeckMutations(deckId: string | undefined) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["deck", deckId] });
    queryClient.invalidateQueries({ queryKey: ["deck-sections", deckId] });
  };

  // Generic add mutation factory
  const createAddMutation = <T>(table: string) =>
    useMutation({
      mutationFn: async (data: Omit<T, "id" | "created_at" | "updated_at">) => {
        const { error } = await supabase
          .from(table)
          .insert({ ...data, deck_id: deckId });
        if (error) throw error;
      },
      onSuccess: invalidate,
    });

  // Generic update mutation factory
  const createUpdateMutation = <T>(table: string) =>
    useMutation({
      mutationFn: async ({ id, ...updates }: { id: string } & Partial<T>) => {
        const { error } = await supabase
          .from(table)
          .update(updates)
          .eq("id", id);
        if (error) throw error;
      },
      onSuccess: invalidate,
    });

  // Generic delete mutation factory
  const createDeleteMutation = (table: string) =>
    useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: invalidate,
    });

  return {
    // Team Members
    addTeamMember: createAddMutation<TeamMember>("deck_team_members"),
    updateTeamMember: createUpdateMutation<TeamMember>("deck_team_members"),
    deleteTeamMember: createDeleteMutation("deck_team_members"),

    // Goals
    addGoal: createAddMutation<Goal>("deck_goals"),
    updateGoal: createUpdateMutation<Goal>("deck_goals"),
    deleteGoal: createDeleteMutation("deck_goals"),

    // ... repeat for all section types

    // Slide Management
    updateSlideOrder: useMutation({
      mutationFn: async (slideOrder: string[]) => {
        const { error } = await supabase
          .from("decks")
          .update({ slide_order: slideOrder })
          .eq("id", deckId);
        if (error) throw error;
      },
      onSuccess: invalidate,
    }),

    updateHiddenSlides: useMutation({
      mutationFn: async (hiddenSlides: string[]) => {
        const { error } = await supabase
          .from("decks")
          .update({ hidden_slides: hiddenSlides })
          .eq("id", deckId);
        if (error) throw error;
      },
      onSuccess: invalidate,
    }),
  };
}
```

---

## Query Key Structure

```typescript
// Consistent query key patterns for cache management

const QUERY_KEYS = {
  deck: (deckId: string) => ["deck", deckId],
  deckSections: (deckId: string) => ["deck-sections", deckId],
  presentation: (deckId: string) => ["presentation", deckId],
};
```

---

## Data Sync Rules

1. **Single Source of Truth**: All data lives in the database
2. **Optimistic Updates**: UI updates immediately, rolls back on error
3. **Cache Invalidation**: Mutations invalidate relevant query keys
4. **Real-time Sync** (optional): Use Supabase Realtime for multi-user editing

```sql
-- Enable realtime for collaborative editing
ALTER PUBLICATION supabase_realtime ADD TABLE public.decks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deck_team_members;
-- ... add other tables as needed
```
