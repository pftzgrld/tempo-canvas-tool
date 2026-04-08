import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export function useDeckMutations(deckId: string | undefined) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["deck", deckId] });
    queryClient.invalidateQueries({ queryKey: ["deck-sections", deckId] });
  };

  // Goals
  const addGoal = useMutation({
    mutationFn: async (data: Omit<TablesInsert<"deck_goals">, "id" | "deck_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("deck_goals")
        .insert({ ...data, deck_id: deckId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateGoal = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"deck_goals">) => {
      const { error } = await supabase
        .from("deck_goals")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteGoal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deck_goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Agenda Items
  const addAgendaItem = useMutation({
    mutationFn: async (data: Omit<TablesInsert<"deck_agenda">, "id" | "deck_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("deck_agenda")
        .insert({ ...data, deck_id: deckId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateAgendaItem = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"deck_agenda">) => {
      const { error } = await supabase
        .from("deck_agenda")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteAgendaItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deck_agenda").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Executive Summary
  const updateExecutiveSummary = useMutation({
    mutationFn: async (updates: TablesUpdate<"deck_executive_summary">) => {
      const { error } = await supabase
        .from("deck_executive_summary")
        .update(updates)
        .eq("deck_id", deckId!);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Metrics
  const addMetric = useMutation({
    mutationFn: async (data: Omit<TablesInsert<"deck_metrics">, "id" | "deck_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("deck_metrics")
        .insert({ ...data, deck_id: deckId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateMetric = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"deck_metrics">) => {
      const { error } = await supabase
        .from("deck_metrics")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMetric = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deck_metrics").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Priorities
  const addPriority = useMutation({
    mutationFn: async (data: Omit<TablesInsert<"deck_priorities">, "id" | "deck_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("deck_priorities")
        .insert({ ...data, deck_id: deckId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updatePriority = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"deck_priorities">) => {
      const { error } = await supabase
        .from("deck_priorities")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deletePriority = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deck_priorities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Use Cases
  const addUseCase = useMutation({
    mutationFn: async (data: Omit<TablesInsert<"deck_use_cases">, "id" | "deck_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("deck_use_cases")
        .insert({ ...data, deck_id: deckId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateUseCase = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"deck_use_cases">) => {
      const { error } = await supabase
        .from("deck_use_cases")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteUseCase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deck_use_cases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Programs
  const addProgram = useMutation({
    mutationFn: async (data: Omit<TablesInsert<"deck_programs">, "id" | "deck_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("deck_programs")
        .insert({ ...data, deck_id: deckId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateProgram = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"deck_programs">) => {
      const { error } = await supabase
        .from("deck_programs")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteProgram = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deck_programs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Milestones
  const addMilestone = useMutation({
    mutationFn: async (data: Omit<TablesInsert<"deck_milestones">, "id" | "deck_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("deck_milestones")
        .insert({ ...data, deck_id: deckId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateMilestone = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"deck_milestones">) => {
      const { error } = await supabase
        .from("deck_milestones")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMilestone = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deck_milestones").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Resources
  const addResource = useMutation({
    mutationFn: async (data: Omit<TablesInsert<"deck_resources">, "id" | "deck_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("deck_resources")
        .insert({ ...data, deck_id: deckId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateResource = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"deck_resources">) => {
      const { error } = await supabase
        .from("deck_resources")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deck_resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Slide Management
  const updateSlideOrder = useMutation({
    mutationFn: async (slideOrder: string[]) => {
      const { error } = await supabase
        .from("decks")
        .update({ slide_order: slideOrder })
        .eq("id", deckId!);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateHiddenSlides = useMutation({
    mutationFn: async (hiddenSlides: string[]) => {
      const { error } = await supabase
        .from("decks")
        .update({ hidden_slides: hiddenSlides })
        .eq("id", deckId!);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Visible sections
  const updateVisibleSections = useMutation({
    mutationFn: async (visibleSections: string[]) => {
      const { error } = await supabase
        .from("decks")
        .update({ visible_sections: visibleSections })
        .eq("id", deckId!);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Deck metadata
  const updateDeck = useMutation({
    mutationFn: async (updates: TablesUpdate<"decks">) => {
      const { error } = await supabase
        .from("decks")
        .update(updates)
        .eq("id", deckId!);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    // Goals
    addGoal,
    updateGoal,
    deleteGoal,
    // Agenda
    addAgendaItem,
    updateAgendaItem,
    deleteAgendaItem,
    // Executive Summary
    updateExecutiveSummary,
    // Metrics
    addMetric,
    updateMetric,
    deleteMetric,
    // Priorities
    addPriority,
    updatePriority,
    deletePriority,
    // Use Cases
    addUseCase,
    updateUseCase,
    deleteUseCase,
    // Programs
    addProgram,
    updateProgram,
    deleteProgram,
    // Milestones
    addMilestone,
    updateMilestone,
    deleteMilestone,
    // Resources
    addResource,
    updateResource,
    deleteResource,
    // Slide Management
    updateSlideOrder,
    updateHiddenSlides,
    updateVisibleSections,
    // Deck
    updateDeck,
  };
}
