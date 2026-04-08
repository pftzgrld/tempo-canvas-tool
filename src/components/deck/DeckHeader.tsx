import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { Deck } from "@/hooks/useDeckData";

interface DeckHeaderProps {
  deck: Deck;
  onPresent: () => void;
  isPreviewMode?: boolean;
  onTogglePreview?: () => void;
  onOpenSettings?: () => void;
}

export function DeckHeader({ 
  deck, 
  onPresent, 
  isPreviewMode,
  onTogglePreview,
  onOpenSettings,
}: DeckHeaderProps) {
  const updatedAt = deck.updated_at ? new Date(deck.updated_at).toLocaleDateString() : "";

  return (
    <header className="pt-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex bg-background/80 border border-foreground/5 rounded-2xl py-3 px-4 sm:px-6 shadow-xl shadow-foreground/5 backdrop-blur-md items-center justify-between transition-all duration-300">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <a href="/" className="font-serif-display text-xl sm:text-2xl tracking-tighter text-foreground font-bold">
            Hurdle
          </a>
          <div className="hidden sm:block h-6 w-px bg-foreground/10" />
          <div className="hidden sm:block">
            <h1 className="font-serif-display text-lg font-medium text-foreground">Q1 2026 Introduction</h1>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button 
            onClick={onPresent} 
            size="sm"
            className="rounded-xl bg-foreground text-background hover:bg-primary font-sans-ui text-xs uppercase tracking-widest transition-colors shadow-lg shadow-foreground/10"
          >
            <Play className="mr-2 h-4 w-4" />
            Present
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Button 
            onClick={onPresent} 
            size="sm"
            className="rounded-xl bg-foreground text-background hover:bg-primary font-sans-ui text-xs uppercase tracking-widest transition-colors shadow-lg shadow-foreground/10"
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
