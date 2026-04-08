# PRD 03: Presentation Engine

## Overview

The Presentation Engine provides a full-screen slide experience for presenting deck content, with navigation controls, keyboard shortcuts, and staff editing capabilities.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   PresentationPage                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │              SlideRenderer                           │    │
│  │                                                      │    │
│  │   ┌─────────────────────────────────────────────┐   │    │
│  │   │         Current Slide Component              │   │    │
│  │   │    (e.g., TitleSlide, TeamSlide, etc.)      │   │    │
│  │   └─────────────────────────────────────────────┘   │    │
│  │                                                      │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │              PresentationControls                    │    │
│  │  [Progress] [Prev] [1/15] [Next] [Timer] [Exit]     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

Optional Sidebar (Staff Only):
┌───────────────────┐
│ SlideManagerPanel │
│ ☐ Title          │
│ ☑ Agenda         │
│ ☑ Team           │
│ ☐ Goals          │
│ ...              │
└───────────────────┘
```

---

## Presentation Hook

```typescript
// src/hooks/usePresentation.ts

import { useState, useMemo, useCallback } from "react";
import { useDeckData } from "@/hooks/useDeckData";
import { SlideType, DEFAULT_SLIDE_ORDER, SLIDE_DEFINITIONS } from "@/types/slides";

export interface Slide {
  id: SlideType;
  label: string;
  sectionKey?: string;
}

export interface UsePresentationReturn {
  // Data
  deck: Deck | null;
  currentSlide: Slide | null;
  currentIndex: number;
  slides: Slide[];
  allSlides: Slide[];
  
  // Navigation
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  
  // State
  isLoading: boolean;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  
  // Edit Mode
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
  
  // Sidebar
  isSidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export function usePresentation(deckId: string): UsePresentationReturn {
  const { deck, isLoading, ...sectionData } = useDeckData(deckId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditMode, setEditMode] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Get slide order from deck or use default
  const slideOrder = useMemo(() => {
    if (deck?.slide_order?.length) {
      return deck.slide_order as SlideType[];
    }
    return DEFAULT_SLIDE_ORDER;
  }, [deck?.slide_order]);

  // Get hidden slides
  const hiddenSlides = useMemo(() => {
    return new Set(deck?.hidden_slides || []);
  }, [deck?.hidden_slides]);

  // Build all slides list
  const allSlides = useMemo(() => {
    return slideOrder.map((type) => ({
      id: type,
      label: SLIDE_DEFINITIONS[type]?.label || type,
      sectionKey: SLIDE_DEFINITIONS[type]?.sectionKey,
    }));
  }, [slideOrder]);

  // Filter to visible slides only
  const slides = useMemo(() => {
    return allSlides.filter((slide) => {
      // Check if slide is hidden
      if (hiddenSlides.has(slide.id)) return false;

      // Check if section has data (skip empty sections)
      if (slide.sectionKey) {
        const sectionHasData = checkSectionHasData(slide.sectionKey, sectionData);
        if (!sectionHasData && !isEditMode) return false;
      }

      return true;
    });
  }, [allSlides, hiddenSlides, sectionData, isEditMode]);

  // Current slide
  const currentSlide = slides[currentIndex] || null;

  // Navigation
  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, slides.length - 1)));
  }, [slides.length]);

  return {
    deck,
    currentSlide,
    currentIndex,
    slides,
    allSlides,
    next,
    prev,
    goTo,
    isLoading,
    isFirstSlide: currentIndex === 0,
    isLastSlide: currentIndex === slides.length - 1,
    isEditMode,
    setEditMode,
    isSidebarOpen,
    setSidebarOpen,
  };
}

// Helper to check if section has data
function checkSectionHasData(sectionKey: string, data: any): boolean {
  switch (sectionKey) {
    case "team":
      return data.teamMembers?.length > 0;
    case "goals":
      return data.goals?.length > 0;
    case "metrics":
      return data.metrics?.length > 0;
    case "use-cases":
      return data.useCases?.length > 0;
    case "programs":
      return data.programs?.length > 0;
    case "milestones":
      return data.milestones?.length > 0;
    case "governance":
      return data.governance?.length > 0;
    case "resources":
      return data.resources?.length > 0;
    case "calls":
      return data.calls?.length > 0;
    case "agenda":
      return data.agendaItems?.length > 0;
    case "priorities":
      return data.priorities?.length > 0;
    default:
      return true;
  }
}
```

---

## Slide Renderer

```tsx
// src/components/presentation/SlideRenderer.tsx

import { motion, AnimatePresence } from "framer-motion";
import { SlideType } from "@/types/slides";
import { useDeckData } from "@/hooks/useDeckData";
import {
  TitleSlide,
  AgendaSlide,
  ExecutiveSummarySlide,
  TeamSlide,
  GoalsSlide,
  MetricsSlide,
  UseCasesSlide,
  ProgramsSlide,
  MilestonesSlide,
  GovernanceSlide,
  ResourcesSlide,
  NextMeetingSlide,
  RecentCallsSlide,
  ClosingSlide,
  PrioritiesSlide,
} from "./slides";

interface SlideRendererProps {
  deckId: string;
  slideType: SlideType;
  isEditMode: boolean;
}

export function SlideRenderer({ deckId, slideType, isEditMode }: SlideRendererProps) {
  const deckData = useDeckData(deckId);

  const slideComponents: Record<SlideType, React.ReactNode> = {
    "title": <TitleSlide deck={deckData.deck} />,
    "agenda": <AgendaSlide items={deckData.agendaItems} isEditMode={isEditMode} />,
    "executive-summary": <ExecutiveSummarySlide data={deckData.executiveSummary} isEditMode={isEditMode} />,
    "priorities": <PrioritiesSlide items={deckData.priorities} isEditMode={isEditMode} />,
    "team-introductions": <TeamSlide members={deckData.teamMembers} isEditMode={isEditMode} />,
    "goals": <GoalsSlide goals={deckData.goals} isEditMode={isEditMode} />,
    "metrics": <MetricsSlide metrics={deckData.metrics} isEditMode={isEditMode} />,
    "use-cases": <UseCasesSlide useCases={deckData.useCases} isEditMode={isEditMode} />,
    "programs": <ProgramsSlide programs={deckData.programs} isEditMode={isEditMode} />,
    "milestones": <MilestonesSlide milestones={deckData.milestones} isEditMode={isEditMode} />,
    "governance": <GovernanceSlide items={deckData.governance} isEditMode={isEditMode} />,
    "resources": <ResourcesSlide resources={deckData.resources} isEditMode={isEditMode} />,
    "next-meeting": <NextMeetingSlide meeting={deckData.nextMeeting} isEditMode={isEditMode} />,
    "recent-calls": <RecentCallsSlide calls={deckData.calls} isEditMode={isEditMode} />,
    "closing": <ClosingSlide deck={deckData.deck} />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideType}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full h-full"
      >
        {slideComponents[slideType]}
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## Slide Layout Component

```tsx
// src/components/presentation/SlideLayout.tsx

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlideLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "centered" | "split";
}

export function SlideLayout({ children, className, variant = "default" }: SlideLayoutProps) {
  return (
    <div
      className={cn(
        "relative w-full h-full min-h-screen",
        "bg-gradient-to-br from-background via-background to-muted/20",
        "flex flex-col",
        variant === "centered" && "items-center justify-center",
        variant === "split" && "flex-row",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-secondary/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
```

---

## Example Slide Component

```tsx
// src/components/presentation/slides/TeamSlide.tsx

import { SlideLayout } from "../SlideLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface TeamSlideProps {
  members: TeamMember[];
  isEditMode?: boolean;
}

export function TeamSlide({ members, isEditMode }: TeamSlideProps) {
  const internalTeam = members.filter((m) => m.team_type === "internal");
  const customerTeam = members.filter((m) => m.team_type === "customer");

  return (
    <SlideLayout>
      <div className="flex-1 flex flex-col px-16 py-12">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12"
        >
          Meet the Team
        </motion.h1>

        <div className="flex-1 grid grid-cols-2 gap-16">
          {/* Your Team */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-primary">Your Team</h2>
            <div className="grid grid-cols-2 gap-4">
              {internalTeam.map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Customer Team */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Customer Team</h2>
            <div className="grid grid-cols-2 gap-4">
              {customerTeam.map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SlideLayout>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-card border"
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={member.photo_url || undefined} />
        <AvatarFallback>
          {member.name.split(" ").map((n) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{member.name}</p>
        <p className="text-sm text-muted-foreground">{member.title}</p>
      </div>
    </motion.div>
  );
}
```

---

## Presentation Controls

```tsx
// src/components/presentation/PresentationControls.tsx

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  LayoutGrid,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PresentationControlsProps {
  currentIndex: number;
  totalSlides: number;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isStaff?: boolean;
}

export function PresentationControls({
  currentIndex,
  totalSlides,
  isFirstSlide,
  isLastSlide,
  onPrev,
  onNext,
  onExit,
  onToggleSidebar,
  isSidebarOpen,
  isStaff = false,
}: PresentationControlsProps) {
  const progress = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <Progress value={progress} className="h-1 rounded-none" />

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-lg border-t">
        {/* Left: Exit and Sidebar */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onExit}>
            <X className="h-5 w-5" />
          </Button>
          {isStaff && (
            <Button
              variant={isSidebarOpen ? "secondary" : "ghost"}
              size="icon"
              onClick={onToggleSidebar}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            disabled={isFirstSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <span className="text-sm font-medium tabular-nums min-w-[60px] text-center">
            {currentIndex + 1} / {totalSlides}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={isLastSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Right: Timer and Fullscreen */}
        <div className="flex items-center gap-2">
          <PresentationTimer />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => document.documentElement.requestFullscreen()}
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PresentationTimer() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span className="tabular-nums">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
```

---

## Keyboard Navigation

```tsx
// src/hooks/usePresentationKeyboard.ts

import { useEffect } from "react";

export function usePresentationKeyboard({
  onNext,
  onPrev,
  onExit,
  onToggleEditMode,
  onToggleSidebar,
}: {
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onToggleEditMode: () => void;
  onToggleSidebar: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          e.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
        case "Escape":
          onExit();
          break;
        case "e":
        case "E":
          onToggleEditMode();
          break;
        case "s":
        case "S":
          onToggleSidebar();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, onExit, onToggleEditMode, onToggleSidebar]);
}
```

---

## Presentation Page

```tsx
// src/pages/Present.tsx

import { useParams, useNavigate } from "react-router-dom";
import { usePresentation } from "@/hooks/usePresentation";
import { usePresentationKeyboard } from "@/hooks/usePresentationKeyboard";
import { SlideRenderer } from "@/components/presentation/SlideRenderer";
import { PresentationControls } from "@/components/presentation/PresentationControls";
import { SlideManagerSidebar } from "@/components/presentation/SlideManagerSidebar";

export default function PresentPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const isStaff = useIsStaff();

  const {
    deck,
    currentSlide,
    currentIndex,
    slides,
    allSlides,
    next,
    prev,
    goTo,
    isLoading,
    isFirstSlide,
    isLastSlide,
    isEditMode,
    setEditMode,
    isSidebarOpen,
    setSidebarOpen,
  } = usePresentation(deckId!);

  usePresentationKeyboard({
    onNext: next,
    onPrev: prev,
    onExit: () => navigate(`/deck/${deckId}`),
    onToggleEditMode: () => isStaff && setEditMode(!isEditMode),
    onToggleSidebar: () => isStaff && setSidebarOpen(!isSidebarOpen),
  });

  if (isLoading) {
    return <PresentationSkeleton />;
  }

  return (
    <div className="fixed inset-0 bg-background">
      {/* Slide Content */}
      <div
        className={cn(
          "h-full transition-all duration-300",
          isSidebarOpen ? "mr-80" : "mr-0"
        )}
      >
        {currentSlide && (
          <SlideRenderer
            deckId={deckId!}
            slideType={currentSlide.id}
            isEditMode={isEditMode}
          />
        )}
      </div>

      {/* Controls */}
      <PresentationControls
        currentIndex={currentIndex}
        totalSlides={slides.length}
        isFirstSlide={isFirstSlide}
        isLastSlide={isLastSlide}
        onPrev={prev}
        onNext={next}
        onExit={() => navigate(`/deck/${deckId}`)}
        onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        isStaff={isStaff}
      />

      {/* Sidebar (Staff Only) */}
      {isStaff && (
        <SlideManagerSidebar
          open={isSidebarOpen}
          onOpenChange={setSidebarOpen}
          slides={allSlides}
          hiddenSlides={deck?.hidden_slides || []}
          currentIndex={currentIndex}
          onSlideClick={goTo}
          deckId={deckId!}
        />
      )}
    </div>
  );
}
```
