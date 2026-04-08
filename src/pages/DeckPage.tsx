import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { DeckHeader } from "@/components/deck/DeckHeader";
import { DeckTabs } from "@/components/deck/DeckTabs";
import { DeckSettingsModal } from "@/components/deck/DeckSettingsModal";
import { SectionId, SECTIONS } from "@/lib/sections";
import { useDeckData } from "@/hooks/useDeckData";
import { useDeckMutations } from "@/hooks/useDeckMutations";
import { useMenuKeyboardShortcuts } from "@/hooks/useMenuKeyboardShortcuts";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { FullscreenPresentation } from "@/components/presentation/FullscreenPresentation";
import {
  ExecutiveSummarySection,
  GoalsSection,
  UseCasesSection,
  ProgramsSection,
  MilestonesSection,
  ResourcesSection,
  MetricsSection,
  ProblemSection,
  SolutionSection,
  HowDifferentSection,
  CommercialModelSection,
  WhatWeNeedSection,
  DeepDiveSection,
  PlaceholderSection,
} from "@/components/deck/sections";
import { Skeleton } from "@/components/ui/skeleton";

// Demo deck ID for now - would come from route params in production
const DEMO_DECK_ID = "11111111-1111-1111-1111-111111111111";

export function DeckPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("executive-summary");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isMobile = useIsMobile();

  const deckData = useDeckData(DEMO_DECK_ID);
  const mutations = useDeckMutations(DEMO_DECK_ID);

  // Get visible sections for navigation
  const visibleSections = SECTIONS;
  const currentIndex = visibleSections.findIndex(s => s.id === activeSection);

  const handleNextSection = useCallback(() => {
    const nextIndex = Math.min(currentIndex + 1, visibleSections.length - 1);
    setActiveSection(visibleSections[nextIndex].id);
  }, [currentIndex, visibleSections]);

  const handlePrevSection = useCallback(() => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    setActiveSection(visibleSections[prevIndex].id);
  }, [currentIndex, visibleSections]);

  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  // Keyboard shortcuts
  useMenuKeyboardShortcuts({
    onNextSection: handleNextSection,
    onPrevSection: handlePrevSection,
    onOpenSettings: handleOpenSettings,
  });

  // Mobile swipe navigation for sections
  useSwipeNavigation({
    onSwipeLeft: handleNextSection,
    onSwipeRight: handlePrevSection,
    enabled: isMobile && !isPresentationMode,
    threshold: 50,
  });

  if (deckData.isLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="ambient-blob-primary -top-20 -left-20 h-96 w-96" />
        <div className="ambient-blob-muted top-1/2 -right-20 h-[500px] w-[500px]" />
        <div className="p-8 relative z-10">
          <Skeleton className="h-16 w-full mb-4 rounded-2xl" />
          <Skeleton className="h-12 w-full mb-8 rounded-2xl" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!deckData.deck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="ambient-blob-primary -top-20 -left-20 h-96 w-96" />
        <p className="text-muted-foreground font-serif-body text-lg">Deck not found</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "executive-summary":
        return <ExecutiveSummarySection data={deckData.executiveSummary} />;
      case "the-problem":
        return <ProblemSection />;
      case "the-solution":
        return <SolutionSection />;
      case "how-different":
        return <HowDifferentSection />;
      case "commercial-model":
        return <CommercialModelSection />;
      case "what-we-need":
        return <WhatWeNeedSection />;
      case "timeline":
        return <MilestonesSection />;
      case "deep-dive":
        return <DeepDiveSection />;
      default:
        return <PlaceholderSection title={activeSection} />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isPresentationMode && (
          <FullscreenPresentation 
            deckId={DEMO_DECK_ID}
            onExit={() => setIsPresentationMode(false)}
            initialSection={activeSection}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient background blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="ambient-blob-primary -top-20 -left-20 h-96 w-96" />
          <div className="ambient-blob-muted top-1/2 -right-20 h-[500px] w-[500px]" />
          <div className="ambient-blob-primary -bottom-32 left-1/3 h-80 w-80 opacity-50" />
        </div>

        {/* Sticky navigation wrapper */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
          <DeckHeader
            deck={deckData.deck}
            onPresent={() => setIsPresentationMode(true)}
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
            onOpenSettings={handleOpenSettings}
          />

          <DeckTabs
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isPreviewMode={isPreviewMode}
          />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass-card p-6 sm:p-10 animate-fade-in-up">
            {renderSection()}
          </div>
        </main>
      </div>

      <DeckSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        deck={deckData.deck}
      />
    </>
  );
}

export default DeckPage;
