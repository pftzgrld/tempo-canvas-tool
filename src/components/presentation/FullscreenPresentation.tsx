import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionId, SECTIONS } from "@/lib/sections";
import { useDeckData } from "@/hooks/useDeckData";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ExecutiveSummarySection,
  ProblemSection,
  SolutionSection,
  HowDifferentSection,
  CommercialModelSection,
  WhatWeNeedSection,
  MilestonesSection,
  DeepDiveSection,
  PlaceholderSection,
} from "@/components/deck/sections";

interface FullscreenPresentationProps {
  deckId: string;
  onExit: () => void;
  initialSection?: SectionId;
}

export function FullscreenPresentation({ 
  deckId, 
  onExit,
  initialSection = "executive-summary" 
}: FullscreenPresentationProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = SECTIONS.findIndex(s => s.id === initialSection);
    return idx >= 0 ? idx : 0;
  });
  const isMobile = useIsMobile();

  const deckData = useDeckData(deckId);

  const currentSection = SECTIONS[currentIndex];

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, SECTIONS.length - 1));
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Mobile swipe navigation
  useSwipeNavigation({
    onSwipeLeft: next,
    onSwipeRight: prev,
    enabled: isMobile,
    threshold: 50,
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          onExit();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, onExit]);

  const renderSection = () => {
    switch (currentSection.id) {
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
        return <PlaceholderSection title={currentSection.label} />;
    }
  };

  if (deckData.isLoading || !deckData.deck) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-1/2 -right-20 h-[500px] w-[500px] rounded-full bg-muted blur-3xl" />
        </div>
        <p className="text-muted-foreground font-serif-body text-lg relative z-10">Loading presentation...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -right-20 h-[500px] w-[500px] rounded-full bg-muted blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        {/* Left: Branding + Section */}
        <div className="flex items-center gap-4">
          <span className="font-serif-display text-xl font-bold text-foreground">Hurdle</span>
          <div className="h-6 w-px bg-foreground/10" />
          <span className="text-sm text-muted-foreground">{currentSection.label}</span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="font-sans-ui text-xs uppercase tracking-widest"
          >
            <X className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
      </div>

      {/* Slide content */}
      <div className="h-full w-full overflow-auto pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 sm:p-10"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {SECTIONS.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? "w-8 bg-primary" 
                    : idx < currentIndex 
                      ? "w-2 bg-primary/50" 
                      : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to ${section.label}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prev}
              disabled={currentIndex === 0}
              className="font-sans-ui"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground px-3">
              {currentIndex + 1} / {SECTIONS.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={next}
              disabled={currentIndex === SECTIONS.length - 1}
              className="font-sans-ui"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
