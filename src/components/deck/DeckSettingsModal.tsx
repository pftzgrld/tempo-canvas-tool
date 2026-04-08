import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SECTIONS, SectionId } from "@/lib/sections";
import { useDeckMutations } from "@/hooks/useDeckMutations";
import type { Deck } from "@/hooks/useDeckData";

interface DeckSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deck: Deck | null;
}

export function DeckSettingsModal({ open, onOpenChange, deck }: DeckSettingsModalProps) {
  const { updateVisibleSections } = useDeckMutations(deck?.id);
  const allSectionIds = SECTIONS.map(s => s.id);
  
  const [selectedSections, setSelectedSections] = useState<SectionId[]>(
    (deck?.visible_sections as SectionId[]) || allSectionIds
  );

  useEffect(() => {
    if (deck?.visible_sections) {
      setSelectedSections(deck.visible_sections as SectionId[]);
    } else {
      setSelectedSections(allSectionIds);
    }
  }, [deck?.visible_sections]);

  const handleToggle = (sectionId: SectionId) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSave = () => {
    updateVisibleSections.mutate(selectedSections);
    onOpenChange(false);
  };

  const handleSelectAll = () => {
    setSelectedSections(allSectionIds);
  };

  const handleDeselectAll = () => {
    setSelectedSections([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Section Visibility</DialogTitle>
          <DialogDescription>
            Choose which sections are visible to customers in preview mode.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeselectAll}>
            Deselect All
          </Button>
        </div>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="flex items-center justify-between">
                <Label htmlFor={section.id} className="flex items-center gap-3 cursor-pointer">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{section.label}</span>
                    {section.description && (
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    )}
                  </div>
                </Label>
                <Switch
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => handleToggle(section.id)}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateVisibleSections.isPending}>
            {updateVisibleSections.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
