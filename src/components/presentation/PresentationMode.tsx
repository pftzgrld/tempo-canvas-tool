import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideRenderer, slideHasContent } from "@/components/presentation/SlideComponents";
import { PresentationControls } from "@/components/presentation/PresentationControls";
import { SlideManagerSidebar } from "@/components/presentation/SlideManagerSidebar";
import { EditModeToggle, SavingIndicator } from "@/components/editing";
import { SlideType, DEFAULT_SLIDE_ORDER } from "@/types/deck";
import { useDeckData } from "@/hooks/useDeckData";
import { useDeckMutations } from "@/hooks/useDeckMutations";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
interface PresentationModeProps {
  deckId: string;
  onExit: () => void;
}

export function PresentationMode({ deckId, onExit }: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const deckData = useDeckData(deckId);
  const mutations = useDeckMutations(deckId);

  // Track if any mutation is pending
  const isSaving = 
    mutations.updateExecutiveSummary.isPending ||
    mutations.updateAgendaItem.isPending ||
    mutations.addAgendaItem.isPending ||
    mutations.deleteAgendaItem.isPending ||
    mutations.updateGoal.isPending ||
    mutations.addGoal.isPending ||
    mutations.deleteGoal.isPending ||
    mutations.updateMetric.isPending ||
    mutations.addMetric.isPending ||
    mutations.deleteMetric.isPending ||
    mutations.updatePriority.isPending ||
    mutations.addPriority.isPending ||
    mutations.deletePriority.isPending ||
    mutations.updateUseCase.isPending ||
    mutations.addUseCase.isPending ||
    mutations.deleteUseCase.isPending ||
    mutations.updateProgram.isPending ||
    mutations.addProgram.isPending ||
    mutations.deleteProgram.isPending ||
    mutations.updateMilestone.isPending ||
    mutations.addMilestone.isPending ||
    mutations.deleteMilestone.isPending ||
    mutations.updateResource.isPending ||
    mutations.addResource.isPending ||
    mutations.deleteResource.isPending ||
    mutations.updateDeck.isPending;

  // Full slide order from deck (or defaults)
  const fullSlideOrder = (deckData.deck?.slide_order as SlideType[]) || DEFAULT_SLIDE_ORDER;
  const hiddenSlides = (deckData.deck?.hidden_slides as SlideType[]) || [];
  
  // Filter slides: remove hidden ones and (in presentation mode) skip empty slides
  const visibleSlides = useMemo(() => {
    const nonHiddenSlides = fullSlideOrder.filter((slide) => !hiddenSlides.includes(slide));
    
    // In presentation mode (not edit mode), skip slides with no content
    if (!isEditMode && deckData.deck) {
      return nonHiddenSlides.filter((slide) => 
        slideHasContent(slide, {
          deck: deckData.deck!,
          executiveSummary: deckData.executiveSummary,
          goals: deckData.goals,
          agendaItems: deckData.agendaItems,
          metrics: deckData.metrics,
          useCases: deckData.useCases,
          programs: deckData.programs,
          milestones: deckData.milestones,
          resources: deckData.resources,
          priorities: deckData.priorities,
        })
      );
    }
    
    return nonHiddenSlides;
  }, [
    fullSlideOrder, 
    hiddenSlides, 
    isEditMode, 
    deckData.deck,
    deckData.executiveSummary,
    deckData.goals,
    deckData.agendaItems,
    deckData.metrics,
    deckData.useCases,
    deckData.programs,
    deckData.milestones,
    deckData.resources,
    deckData.priorities,
  ]);

  const currentSlide = visibleSlides[currentIndex] || "title";

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, visibleSlides.length - 1));
  }, [visibleSlides.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Mobile swipe navigation
  useSwipeNavigation({
    onSwipeLeft: next,
    onSwipeRight: prev,
    enabled: isMobile && !isEditMode,
    threshold: 50,
  });

  const goToSlide = useCallback((index: number) => {
    // Find the actual index in visible slides
    const slide = fullSlideOrder[index];
    const visibleIndex = visibleSlides.indexOf(slide);
    if (visibleIndex !== -1) {
      setCurrentIndex(visibleIndex);
    }
  }, [fullSlideOrder, visibleSlides]);

  // Handle slide reordering
  const handleReorder = useCallback((newOrder: SlideType[]) => {
    mutations.updateSlideOrder.mutate(newOrder);
  }, [mutations.updateSlideOrder]);

  // Handle visibility toggle
  const handleToggleVisibility = useCallback((slide: SlideType) => {
    const newHidden = hiddenSlides.includes(slide)
      ? hiddenSlides.filter((s) => s !== slide)
      : [...hiddenSlides, slide];
    mutations.updateHiddenSlides.mutate(newHidden);
  }, [hiddenSlides, mutations.updateHiddenSlides]);

  // Reset index if slides change and current index is out of bounds
  useEffect(() => {
    if (currentIndex >= visibleSlides.length) {
      setCurrentIndex(Math.max(0, visibleSlides.length - 1));
    }
  }, [visibleSlides.length, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
        case "Escape":
          e.preventDefault();
          if (isSidebarOpen) {
            setIsSidebarOpen(false);
          } else {
            onExit();
          }
          break;
        case "s":
        case "S":
          e.preventDefault();
          setIsSidebarOpen((prev) => !prev);
          break;
        case "h":
        case "H":
          e.preventDefault();
          handleToggleVisibility(currentSlide);
          break;
        case "e":
        case "E":
          e.preventDefault();
          setIsEditMode((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, onExit, isSidebarOpen, currentSlide, handleToggleVisibility]);

  if (deckData.isLoading || !deckData.deck) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background flex items-center justify-center relative overflow-hidden"
      >
        {/* Ambient blobs */}
        <div className="ambient-blob-primary -top-20 -left-20 h-96 w-96" />
        <div className="ambient-blob-muted top-1/2 -right-20 h-[500px] w-[500px]" />
        <p className="text-muted-foreground font-serif-body text-lg relative z-10">Loading presentation...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background"
      style={{ isolation: 'isolate' }}
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -right-20 h-[500px] w-[500px] rounded-full bg-muted blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Edit Mode Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <SavingIndicator isSaving={isSaving} />
        <EditModeToggle 
          isEditMode={isEditMode} 
          onToggle={() => setIsEditMode(!isEditMode)}
          isSaving={isSaving}
        />
      </div>

      {/* Slide Manager Sidebar */}
      <SlideManagerSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        slideOrder={fullSlideOrder}
        hiddenSlides={hiddenSlides}
        currentSlide={currentSlide}
        onSlideClick={goToSlide}
        onReorder={handleReorder}
        onToggleVisibility={handleToggleVisibility}
      />

      {/* Slide content */}
      <div className="h-full w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : -50 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <SlideRenderer 
              slideType={currentSlide} 
              isEditMode={isEditMode}
              onExitPresentation={onExit}
              deck={deckData.deck}
              executiveSummary={deckData.executiveSummary}
              goals={deckData.goals}
              agendaItems={deckData.agendaItems}
              metrics={deckData.metrics}
              useCases={deckData.useCases}
              programs={deckData.programs}
              milestones={deckData.milestones}
              resources={deckData.resources}
              priorities={deckData.priorities}
              mutations={mutations}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <PresentationControls
        currentIndex={currentIndex}
        totalSlides={visibleSlides.length}
        currentSlide={currentSlide}
        onPrev={prev}
        onNext={next}
        onExit={onExit}
        isFirstSlide={currentIndex === 0}
        isLastSlide={currentIndex === visibleSlides.length - 1}
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode(!isEditMode)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </motion.div>
  );
}

