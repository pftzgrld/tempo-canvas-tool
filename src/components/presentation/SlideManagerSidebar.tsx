import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  X, 
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SlideType, SLIDE_DEFINITIONS } from "@/types/deck";

interface SlideManagerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  slideOrder: SlideType[];
  hiddenSlides: SlideType[];
  currentSlide: SlideType;
  onSlideClick: (index: number) => void;
  onReorder: (newOrder: SlideType[]) => void;
  onToggleVisibility: (slide: SlideType) => void;
}

export function SlideManagerSidebar({
  isOpen,
  onClose,
  slideOrder,
  hiddenSlides,
  currentSlide,
  onSlideClick,
  onReorder,
  onToggleVisibility,
}: SlideManagerSidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = slideOrder.indexOf(active.id as SlideType);
        const newIndex = slideOrder.indexOf(over.id as SlideType);
        const newOrder = arrayMove(slideOrder, oldIndex, newIndex);
        onReorder(newOrder);
      }
    },
    [slideOrder, onReorder]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-background/95 backdrop-blur-md border-r border-foreground/5 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-foreground/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <PanelLeft className="h-5 w-5" />
              </div>
              <h2 className="font-serif-display text-lg font-medium">Slides</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-10 w-10 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Slide List */}
          <ScrollArea className="flex-1 p-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slideOrder}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {slideOrder.map((slide, index) => (
                    <SortableSlideItem
                      key={slide}
                      slide={slide}
                      index={index}
                      isHidden={hiddenSlides.includes(slide)}
                      isCurrent={slide === currentSlide}
                      onSlideClick={() => onSlideClick(index)}
                      onToggleVisibility={() => onToggleVisibility(slide)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-foreground/5">
            <p className="label-text text-center">
              Drag to reorder • Click eye to hide
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SortableSlideItemProps {
  slide: SlideType;
  index: number;
  isHidden: boolean;
  isCurrent: boolean;
  onSlideClick: () => void;
  onToggleVisibility: () => void;
}

function SortableSlideItem({
  slide,
  index,
  isHidden,
  isCurrent,
  onSlideClick,
  onToggleVisibility,
}: SortableSlideItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const slideLabel = SLIDE_DEFINITIONS[slide]?.label || slide;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl group transition-all duration-200",
        isDragging && "bg-white shadow-xl z-50 scale-105",
        isCurrent && !isDragging && "bg-primary/10 border border-primary/20",
        isHidden && "opacity-50",
        !isCurrent && !isDragging && "hover:bg-muted/50"
      )}
    >
      {/* Drag Handle */}
      <button
        className="cursor-grab active:cursor-grabbing touch-none p-1.5 rounded-lg hover:bg-foreground/5 transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Slide Info */}
      <button
        onClick={onSlideClick}
        className="flex-1 text-left truncate"
      >
        <span className="label-text mr-2">{String(index + 1).padStart(2, '0')}</span>
        <span className={cn(
          "font-serif-display text-sm",
          isHidden && "line-through text-muted-foreground"
        )}>
          {slideLabel}
        </span>
      </button>

      {/* Visibility Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility();
        }}
      >
        {isHidden ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {/* Current indicator */}
      {isCurrent && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" />
      )}
    </div>
  );
}

// Sidebar Toggle Button (for use in presentation controls)
interface SidebarToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function SidebarToggle({ isOpen, onClick }: SidebarToggleProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={onClick} 
      className="h-10 w-10 rounded-xl"
    >
      {isOpen ? (
        <PanelLeftClose className="h-5 w-5" />
      ) : (
        <PanelLeft className="h-5 w-5" />
      )}
    </Button>
  );
}
