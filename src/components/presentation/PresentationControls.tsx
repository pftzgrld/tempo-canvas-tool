import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Edit, 
  Maximize,
  Minimize,
  PanelLeft,
  PanelLeftClose,
  ChevronDown,
} from "lucide-react";
import { SlideType, SLIDE_DEFINITIONS } from "@/types/deck";
import { PresentationTimer } from "./PresentationTimer";
import { useIsMobile } from "@/hooks/use-mobile";

interface PresentationControlsProps {
  currentIndex: number;
  totalSlides: number;
  currentSlide: SlideType;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  isEditMode: boolean;
  onToggleEdit: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function PresentationControls({
  currentIndex,
  totalSlides,
  currentSlide,
  onPrev,
  onNext,
  onExit,
  isFirstSlide,
  isLastSlide,
  isEditMode,
  onToggleEdit,
  isFullscreen,
  onToggleFullscreen,
  isSidebarOpen,
  onToggleSidebar,
}: PresentationControlsProps) {
  const isMobile = useIsMobile();
  const progress = ((currentIndex + 1) / totalSlides) * 100;
  const slideLabel = SLIDE_DEFINITIONS[currentSlide]?.label || currentSlide;

  // Mobile layout
  if (isMobile) {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-16 pb-6">
        <div className="px-4">
          {/* Progress bar */}
          <Progress value={progress} className="h-1 mb-4 bg-muted" />

          {/* Slide info and navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrev}
              disabled={isFirstSlide}
              className="h-10 w-10 rounded-xl border-foreground/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex flex-col items-center">
              <span className="font-serif-display text-lg font-medium">
                {currentIndex + 1} / {totalSlides}
              </span>
              <span className="label-text text-[10px]">
                {slideLabel}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
              disabled={isLastSlide}
              className="h-10 w-10 rounded-xl border-foreground/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onExit}
              className="rounded-xl font-sans-ui text-[10px] uppercase tracking-widest h-8 px-2"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Exit
            </Button>
            
            <span className="label-text text-[10px] flex items-center gap-1">
              <ChevronDown className="h-3 w-3" />
              Scroll for more • Swipe to navigate
            </span>

            <Button
              variant={isEditMode ? "default" : "ghost"}
              size="sm"
              onClick={onToggleEdit}
              className="rounded-xl font-sans-ui text-[10px] uppercase tracking-widest h-8 px-2"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              {isEditMode ? "Done" : "Edit"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Progress bar */}
        <Progress value={progress} className="h-1 mb-6 bg-muted" />

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Left: Sidebar Toggle + Exit + Timer */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleSidebar}
                className="h-10 w-10 rounded-xl"
                title="Toggle slide manager (S)"
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <PanelLeft className="h-5 w-5" />
                )}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onExit}
              className="rounded-xl font-sans-ui text-xs uppercase tracking-widest"
            >
              <X className="h-4 w-4 mr-2" />
              Exit
            </Button>
            <PresentationTimer />
          </div>

          {/* Center: Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrev}
              disabled={isFirstSlide}
              className="h-12 w-12 rounded-xl border-foreground/10 hover:bg-foreground hover:text-background transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex flex-col items-center min-w-[140px]">
              <span className="font-serif-display text-xl font-medium">
                {currentIndex + 1} / {totalSlides}
              </span>
              <span className="label-text">
                {slideLabel}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
              disabled={isLastSlide}
              className="h-12 w-12 rounded-xl border-foreground/10 hover:bg-foreground hover:text-background transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant={isEditMode ? "default" : "ghost"}
              size="sm"
              onClick={onToggleEdit}
              className="rounded-xl font-sans-ui text-xs uppercase tracking-widest"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditMode ? "Editing" : "Edit"}
            </Button>
            
            {onToggleFullscreen && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleFullscreen}
                className="h-10 w-10 rounded-xl"
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="flex justify-center gap-6 mt-4">
          <span className="label-text">← → Navigate</span>
          <span className="label-text">S Slides</span>
          <span className="label-text">H Hide</span>
          <span className="label-text">Esc Exit</span>
        </div>
      </div>
    </div>
  );
}
