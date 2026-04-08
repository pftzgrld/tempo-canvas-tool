# PRD 04: Slide Management

## Overview

Slide Management enables staff to control which slides are visible, their order, and provides a sidebar interface for real-time slide manipulation during presentations.

---

## Core Concepts

### Slide States

| State | Description | Behavior |
|-------|-------------|----------|
| **Visible** | Shown in presentation | Included in navigation flow |
| **Hidden** | Not shown in presentation | Skipped during navigation |
| **Empty** | Section has no data | Hidden unless in edit mode |

### Data Storage

```typescript
// In decks table
interface DeckSlideConfig {
  slide_order: SlideType[];    // Order of all slides
  hidden_slides: SlideType[];  // Slides to hide
  visible_sections: string[];  // Sections enabled for customers
}
```

---

## Slide Manager Sidebar

```tsx
// src/components/presentation/SlideManagerSidebar.tsx

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical, Eye, EyeOff, X } from "lucide-react";
import { useDeckMutations } from "@/hooks/useDeckMutations";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface SlideManagerSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: Slide[];
  hiddenSlides: string[];
  currentIndex: number;
  onSlideClick: (index: number) => void;
  deckId: string;
}

export function SlideManagerSidebar({
  open,
  onOpenChange,
  slides,
  hiddenSlides,
  currentIndex,
  onSlideClick,
  deckId,
}: SlideManagerSidebarProps) {
  const { updateSlideOrder, updateHiddenSlides } = useDeckMutations(deckId);
  const hiddenSet = new Set(hiddenSlides);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);

    const newOrder = arrayMove(slides.map((s) => s.id), oldIndex, newIndex);
    updateSlideOrder.mutate(newOrder);
  };

  const toggleSlideVisibility = (slideId: string) => {
    const newHidden = hiddenSet.has(slideId)
      ? hiddenSlides.filter((id) => id !== slideId)
      : [...hiddenSlides, slideId];
    updateHiddenSlides.mutate(newHidden);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l shadow-xl z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Manage Slides</h2>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Slide List */}
          <ScrollArea className="h-[calc(100vh-120px)]">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="p-2 space-y-1">
                  {slides.map((slide, index) => (
                    <SortableSlideItem
                      key={slide.id}
                      slide={slide}
                      index={index}
                      isHidden={hiddenSet.has(slide.id)}
                      isCurrent={index === currentIndex}
                      onToggleVisibility={() => toggleSlideVisibility(slide.id)}
                      onClick={() => onSlideClick(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
            <p className="text-xs text-muted-foreground text-center">
              Drag to reorder • Toggle visibility
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// Sortable slide item component
function SortableSlideItem({
  slide,
  index,
  isHidden,
  isCurrent,
  onToggleVisibility,
  onClick,
}: {
  slide: Slide;
  index: number;
  isHidden: boolean;
  isCurrent: boolean;
  onToggleVisibility: () => void;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border transition-colors",
        isCurrent && "bg-primary/10 border-primary",
        isHidden && "opacity-50",
        isDragging && "shadow-lg bg-background z-50"
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Slide Info */}
      <button
        onClick={onClick}
        className="flex-1 text-left text-sm font-medium truncate"
      >
        <span className="text-muted-foreground mr-2">{index + 1}.</span>
        {slide.label}
      </button>

      {/* Visibility Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility();
        }}
      >
        {isHidden ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

// Array move helper
function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const [item] = newArray.splice(from, 1);
  newArray.splice(to, 0, item);
  return newArray;
}
```

---

## Required Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## Mutations for Slide Management

```typescript
// In useDeckMutations.ts

// Update slide order
updateSlideOrder: useMutation({
  mutationFn: async (slideOrder: string[]) => {
    const { error } = await supabase
      .from("decks")
      .update({ 
        slide_order: slideOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deckId);
    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["deck", deckId] });
    queryClient.invalidateQueries({ queryKey: ["presentation", deckId] });
  },
}),

// Update hidden slides
updateHiddenSlides: useMutation({
  mutationFn: async (hiddenSlides: string[]) => {
    const { error } = await supabase
      .from("decks")
      .update({ 
        hidden_slides: hiddenSlides,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deckId);
    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["deck", deckId] });
    queryClient.invalidateQueries({ queryKey: ["presentation", deckId] });
  },
}),
```

---

## Slide Visibility Logic

```typescript
// src/lib/slide-visibility.ts

import { SlideType, SLIDE_DEFINITIONS } from "@/types/slides";

interface VisibilityConfig {
  slideOrder: SlideType[];
  hiddenSlides: SlideType[];
  visibleSections: string[];
  isEditMode: boolean;
  sectionData: Record<string, any[]>;
}

export function getVisibleSlides(config: VisibilityConfig): SlideType[] {
  const { slideOrder, hiddenSlides, visibleSections, isEditMode, sectionData } = config;
  const hiddenSet = new Set(hiddenSlides);
  const visibleSet = new Set(visibleSections);

  return slideOrder.filter((slideType) => {
    // Always hide explicitly hidden slides
    if (hiddenSet.has(slideType)) return false;

    const definition = SLIDE_DEFINITIONS[slideType];
    if (!definition) return false;

    // Check section visibility (customer-facing setting)
    if (definition.sectionKey && !visibleSet.has(definition.sectionKey)) {
      return false;
    }

    // Check if section has data (unless in edit mode)
    if (definition.sectionKey && !isEditMode) {
      const data = sectionData[definition.sectionKey];
      if (!data || data.length === 0) return false;
    }

    return true;
  });
}

export function getSlideIndex(
  slideType: SlideType,
  visibleSlides: SlideType[]
): number {
  return visibleSlides.indexOf(slideType);
}

export function isSlideVisible(
  slideType: SlideType,
  visibleSlides: SlideType[]
): boolean {
  return visibleSlides.includes(slideType);
}
```

---

## Thumbnail Preview (Optional Enhancement)

```tsx
// src/components/presentation/SlideThumbnail.tsx

interface SlideThumbnailProps {
  slideType: SlideType;
  deckId: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SlideThumbnail({ slideType, deckId, isActive, onClick }: SlideThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-video w-full rounded-lg border-2 overflow-hidden transition-all",
        "hover:ring-2 hover:ring-primary/50",
        isActive ? "border-primary ring-2 ring-primary" : "border-border"
      )}
    >
      {/* Mini slide preview - simplified version */}
      <div className="absolute inset-0 scale-[0.2] origin-top-left pointer-events-none">
        <SlideRenderer
          deckId={deckId}
          slideType={slideType}
          isEditMode={false}
        />
      </div>

      {/* Overlay with slide name */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
        <span className="absolute bottom-1 left-2 text-xs text-white font-medium">
          {SLIDE_DEFINITIONS[slideType]?.label}
        </span>
      </div>
    </button>
  );
}
```

---

## Slide Overview Grid

```tsx
// src/components/presentation/SlideOverviewGrid.tsx

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SLIDE_DEFINITIONS, SlideType } from "@/types/slides";

interface SlideOverviewGridProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: SlideType[];
  currentIndex: number;
  onSlideSelect: (index: number) => void;
  deckId: string;
}

export function SlideOverviewGrid({
  open,
  onOpenChange,
  slides,
  currentIndex,
  onSlideSelect,
  deckId,
}: SlideOverviewGridProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Slide Overview</h2>
        <div className="grid grid-cols-4 gap-4">
          {slides.map((slideType, index) => (
            <button
              key={slideType}
              onClick={() => {
                onSlideSelect(index);
                onOpenChange(false);
              }}
              className={cn(
                "relative aspect-video rounded-lg border-2 p-2 transition-all",
                "hover:border-primary hover:shadow-md",
                currentIndex === index && "border-primary bg-primary/5"
              )}
            >
              <div className="absolute top-1 left-1 text-xs font-medium text-muted-foreground">
                {index + 1}
              </div>
              <div className="flex items-center justify-center h-full">
                <span className="text-sm font-medium text-center">
                  {SLIDE_DEFINITIONS[slideType]?.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Keyboard Shortcuts for Slide Management

| Key | Action |
|-----|--------|
| `S` | Toggle sidebar |
| `G` | Open slide overview grid |
| `H` | Toggle current slide visibility |
| `↑/↓` | Move current slide up/down (when sidebar open) |
