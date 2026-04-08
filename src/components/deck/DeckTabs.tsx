import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SECTIONS, SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface DeckTabsProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  visibleSections?: SectionId[];
  isPreviewMode?: boolean;
}

export function DeckTabs({
  activeSection,
  onSectionChange,
  visibleSections,
  isPreviewMode = false,
}: DeckTabsProps) {
  const isMobile = useIsMobile();
  
  const displayedSections = SECTIONS.filter((section) => {
    if (isPreviewMode && visibleSections) {
      return visibleSections.includes(section.id);
    }
    return true;
  });

  const currentSection = displayedSections.find(s => s.id === activeSection) || displayedSections[0];

  // Mobile dropdown view
  if (isMobile) {
    return (
      <nav className="mt-4 px-4 max-w-7xl mx-auto py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between font-sans-ui text-xs uppercase tracking-[0.15em] rounded-xl bg-background/80 border-foreground/10"
            >
              <span className="flex items-center gap-2">
                {currentSection && (
                  <>
                    <currentSection.icon className="h-4 w-4" />
                    {currentSection.label}
                  </>
                )}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="center" 
            className="w-[calc(100vw-2rem)] max-w-md bg-background border border-border"
          >
            {displayedSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <DropdownMenuItem
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={cn(
                    "font-sans-ui text-xs uppercase tracking-[0.15em] py-3",
                    isActive && "bg-foreground text-background"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {section.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    );
  }

  // Desktop horizontal tabs
  return (
    <nav className="mt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-2">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 py-2 justify-center">
          {displayedSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "flex items-center gap-2 shrink-0 font-sans-ui text-xs uppercase tracking-[0.15em] rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-foreground text-background hover:bg-foreground hover:text-background shadow-lg" 
                    : "text-muted-foreground hover:text-primary hover:bg-transparent"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{section.label}</span>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  );
}
