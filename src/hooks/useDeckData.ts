import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Deck = Tables<"decks">;
export type ExecutiveSummary = Tables<"deck_executive_summary">;
export type Goal = Tables<"deck_goals">;
export type AgendaItem = Tables<"deck_agenda">;
export type Metric = Tables<"deck_metrics">;
export type UseCase = Tables<"deck_use_cases">;
export type Program = Tables<"deck_programs">;
export type Milestone = Tables<"deck_milestones">;
export type Resource = Tables<"deck_resources">;
export type Priority = Tables<"deck_priorities">;

export interface DeckData {
  deck: Deck | null;
  executiveSummary: ExecutiveSummary | null;
  goals: Goal[];
  agendaItems: AgendaItem[];
  metrics: Metric[];
  useCases: UseCase[];
  programs: Program[];
  milestones: Milestone[];
  resources: Resource[];
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
        .eq("id", deckId!)
        .maybeSingle();
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
        goals,
        metrics,
        useCases,
        programs,
        milestones,
        resources,
        agenda,
        priorities,
      ] = await Promise.all([
        supabase.from("deck_executive_summary").select("*").eq("deck_id", deckId!).maybeSingle(),
        supabase.from("deck_goals").select("*").eq("deck_id", deckId!).order("display_order"),
        supabase.from("deck_metrics").select("*").eq("deck_id", deckId!).order("display_order"),
        supabase.from("deck_use_cases").select("*").eq("deck_id", deckId!).order("display_order"),
        supabase.from("deck_programs").select("*").eq("deck_id", deckId!).order("display_order"),
        supabase.from("deck_milestones").select("*").eq("deck_id", deckId!).order("display_order"),
        supabase.from("deck_resources").select("*").eq("deck_id", deckId!).order("display_order"),
        supabase.from("deck_agenda").select("*").eq("deck_id", deckId!).order("display_order"),
        supabase.from("deck_priorities").select("*").eq("deck_id", deckId!).order("display_order"),
      ]);

      return {
        executiveSummary: executiveSummary.data,
        goals: goals.data || [],
        metrics: metrics.data || [],
        useCases: useCases.data || [],
        programs: programs.data || [],
        milestones: milestones.data || [],
        resources: resources.data || [],
        agendaItems: agenda.data || [],
        priorities: priorities.data || [],
      };
    },
    enabled: !!deckId,
  });

  return {
    deck: deckQuery.data ?? null,
    executiveSummary: sectionsQuery.data?.executiveSummary ?? null,
    goals: sectionsQuery.data?.goals ?? [],
    agendaItems: sectionsQuery.data?.agendaItems ?? [],
    metrics: sectionsQuery.data?.metrics ?? [],
    useCases: sectionsQuery.data?.useCases ?? [],
    programs: sectionsQuery.data?.programs ?? [],
    milestones: sectionsQuery.data?.milestones ?? [],
    resources: sectionsQuery.data?.resources ?? [],
    priorities: sectionsQuery.data?.priorities ?? [],
    isLoading: deckQuery.isLoading || sectionsQuery.isLoading,
    error: deckQuery.error || sectionsQuery.error,
  };
}

// Hook to fetch list of all decks
export function useDecks() {
  return useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
