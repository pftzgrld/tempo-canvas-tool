# PRD 02: Menu System

## Overview

The Menu System provides a tab-based interface for viewing and managing deck content. Each tab corresponds to a section, with CRUD capabilities for staff users.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DeckPage                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   DeckHeader                         │    │
│  │  [Title] [Status Badge] [Preview] [Settings] [Present]   │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   DeckTabs                           │    │
│  │  [Summary] [Team] [Goals] [Programs] [...]          │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Active Section Component                │    │
│  │                                                      │    │
│  │   e.g., TeamSection, GoalsSection, etc.             │    │
│  │                                                      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Section Definitions

```typescript
// src/lib/section-definitions.ts

import {
  FileText, Users, Target, TrendingUp, Lightbulb,
  FolderKanban, Milestone, Shield, BookOpen, AlertTriangle,
  Calendar, Phone, ListChecks
} from "lucide-react";

export type SectionId =
  | "executive-summary"
  | "team-introductions"
  | "goals-metrics"
  | "use-cases"
  | "programs"
  | "milestones"
  | "governance"
  | "risks"
  | "resources"
  | "next-meeting"
  | "recent-calls";

export interface SectionDefinition {
  id: SectionId;
  label: string;
  icon: React.ComponentType;
  description?: string;
  internal?: boolean; // Staff-only sections
}

export const SECTIONS: SectionDefinition[] = [
  { id: "executive-summary", label: "Executive Summary", icon: FileText },
  { id: "team-introductions", label: "Team", icon: Users },
  { id: "goals-metrics", label: "Goals & Metrics", icon: Target },
  { id: "use-cases", label: "Use Cases", icon: Lightbulb },
  { id: "programs", label: "Programs", icon: FolderKanban },
  { id: "milestones", label: "Milestones", icon: Milestone },
  { id: "governance", label: "Governance", icon: Shield },
  { id: "risks", label: "Risks & Issues", icon: AlertTriangle, internal: true },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "next-meeting", label: "Next Meeting", icon: Calendar },
  { id: "recent-calls", label: "Recent Calls", icon: Phone, internal: true },
];
```

---

## Tab Navigation Component

```tsx
// src/components/deck/DeckTabs.tsx

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SECTIONS, SectionId } from "@/lib/section-definitions";
import { cn } from "@/lib/utils";

interface DeckTabsProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  visibleSections?: SectionId[];
  isStaff?: boolean;
  isPreviewMode?: boolean;
}

export function DeckTabs({
  activeSection,
  onSectionChange,
  visibleSections,
  isStaff = false,
  isPreviewMode = false,
}: DeckTabsProps) {
  // Filter sections based on visibility and permissions
  const displayedSections = SECTIONS.filter((section) => {
    // In preview mode, only show visible sections
    if (isPreviewMode && visibleSections) {
      return visibleSections.includes(section.id);
    }
    // Hide internal sections from non-staff
    if (section.internal && !isStaff) {
      return false;
    }
    return true;
  });

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-1 p-1">
        {displayedSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <Button
              key={section.id}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex items-center gap-2 shrink-0",
                isActive && "bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{section.label}</span>
              {section.internal && isStaff && (
                <Badge variant="outline" className="ml-1 text-xs">
                  Internal
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
```

---

## Section Component Pattern

Each section follows a consistent pattern:

```tsx
// src/components/deck/sections/TeamSection.tsx

import { useDeckData } from "@/hooks/useDeckData";
import { useDeckMutations } from "@/hooks/useDeckMutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TeamMemberCard } from "./TeamMemberCard";
import { TeamMemberEditor } from "./TeamMemberEditor";

interface TeamSectionProps {
  deckId: string;
  isEditMode?: boolean;
}

export function TeamSection({ deckId, isEditMode = false }: TeamSectionProps) {
  const { teamMembers, isLoading } = useDeckData(deckId);
  const { addTeamMember, updateTeamMember, deleteTeamMember } = useDeckMutations(deckId);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  if (isLoading) {
    return <SectionSkeleton />;
  }

  // Group by team type
  const internalTeam = teamMembers.filter((m) => m.team_type === "internal");
  const customerTeam = teamMembers.filter((m) => m.team_type === "customer");

  return (
    <div className="space-y-6">
      {/* Internal Team */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Team</CardTitle>
          {isEditMode && (
            <Button size="sm" onClick={() => setEditorOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {internalTeam.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                isEditMode={isEditMode}
                onEdit={() => setEditingMember(member)}
                onDelete={() => deleteTeamMember.mutate(member.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Team */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerTeam.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                isEditMode={isEditMode}
                onEdit={() => setEditingMember(member)}
                onDelete={() => deleteTeamMember.mutate(member.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor Modal */}
      <TeamMemberEditor
        open={editorOpen || !!editingMember}
        onOpenChange={(open) => {
          if (!open) {
            setEditorOpen(false);
            setEditingMember(null);
          }
        }}
        member={editingMember}
        onSave={(data) => {
          if (editingMember) {
            updateTeamMember.mutate({ id: editingMember.id, ...data });
          } else {
            addTeamMember.mutate(data);
          }
        }}
      />
    </div>
  );
}
```

---

## Section Rendering

```tsx
// src/components/deck/DeckContent.tsx

import { SectionId } from "@/lib/section-definitions";
import {
  ExecutiveSummarySection,
  TeamSection,
  GoalsMetricsSection,
  UseCasesSection,
  ProgramsSection,
  MilestonesSection,
  GovernanceSection,
  RisksSection,
  ResourcesSection,
  NextMeetingSection,
  RecentCallsSection,
} from "./sections";

interface DeckContentProps {
  deckId: string;
  activeSection: SectionId;
  isEditMode?: boolean;
}

export function DeckContent({ deckId, activeSection, isEditMode }: DeckContentProps) {
  const sectionComponents: Record<SectionId, React.ReactNode> = {
    "executive-summary": <ExecutiveSummarySection deckId={deckId} isEditMode={isEditMode} />,
    "team-introductions": <TeamSection deckId={deckId} isEditMode={isEditMode} />,
    "goals-metrics": <GoalsMetricsSection deckId={deckId} isEditMode={isEditMode} />,
    "use-cases": <UseCasesSection deckId={deckId} isEditMode={isEditMode} />,
    "programs": <ProgramsSection deckId={deckId} isEditMode={isEditMode} />,
    "milestones": <MilestonesSection deckId={deckId} isEditMode={isEditMode} />,
    "governance": <GovernanceSection deckId={deckId} isEditMode={isEditMode} />,
    "risks": <RisksSection deckId={deckId} isEditMode={isEditMode} />,
    "resources": <ResourcesSection deckId={deckId} isEditMode={isEditMode} />,
    "next-meeting": <NextMeetingSection deckId={deckId} isEditMode={isEditMode} />,
    "recent-calls": <RecentCallsSection deckId={deckId} isEditMode={isEditMode} />,
  };

  return (
    <div className="p-6">
      {sectionComponents[activeSection]}
    </div>
  );
}
```

---

## Main Page Component

```tsx
// src/pages/Deck.tsx

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDeckData } from "@/hooks/useDeckData";
import { DeckHeader } from "@/components/deck/DeckHeader";
import { DeckTabs } from "@/components/deck/DeckTabs";
import { DeckContent } from "@/components/deck/DeckContent";
import { DeckSettingsModal } from "@/components/deck/DeckSettingsModal";
import { SectionId } from "@/lib/section-definitions";

export default function DeckPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { deck, isLoading } = useDeckData(deckId);
  
  const [activeSection, setActiveSection] = useState<SectionId>("executive-summary");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Check if user is staff (implement your auth logic)
  const isStaff = useIsStaff();

  if (isLoading) {
    return <DeckSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DeckHeader
        deck={deck}
        isEditMode={isEditMode}
        isPreviewMode={isPreviewMode}
        isStaff={isStaff}
        onEditModeToggle={() => setIsEditMode(!isEditMode)}
        onPreviewModeToggle={() => setIsPreviewMode(!isPreviewMode)}
        onSettingsOpen={() => setSettingsOpen(true)}
        onPresent={() => navigate(`/deck/${deckId}/present`)}
      />

      <DeckTabs
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        visibleSections={deck?.visible_sections}
        isStaff={isStaff}
        isPreviewMode={isPreviewMode}
      />

      <DeckContent
        deckId={deckId!}
        activeSection={activeSection}
        isEditMode={isEditMode && isStaff}
      />

      <DeckSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        deck={deck}
      />
    </div>
  );
}
```

---

## Section Visibility Settings

```tsx
// src/components/deck/DeckSettingsModal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SECTIONS, SectionId } from "@/lib/section-definitions";
import { useDeckMutations } from "@/hooks/useDeckMutations";

interface DeckSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deck: Deck | null;
}

export function DeckSettingsModal({ open, onOpenChange, deck }: DeckSettingsModalProps) {
  const { updateVisibleSections } = useDeckMutations(deck?.id);
  const [selectedSections, setSelectedSections] = useState<SectionId[]>(
    deck?.visible_sections || SECTIONS.map((s) => s.id)
  );

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Section Visibility</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {SECTIONS.filter((s) => !s.internal).map((section) => (
            <div key={section.id} className="flex items-center justify-between">
              <Label htmlFor={section.id} className="flex items-center gap-2">
                <section.icon className="h-4 w-4" />
                {section.label}
              </Label>
              <Switch
                id={section.id}
                checked={selectedSections.includes(section.id)}
                onCheckedChange={() => handleToggle(section.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Keyboard Shortcuts

```tsx
// src/hooks/useMenuKeyboardShortcuts.ts

import { useEffect } from "react";

export function useMenuKeyboardShortcuts({
  onNextSection,
  onPrevSection,
  onToggleEditMode,
  onOpenSettings,
  onPresent,
}: {
  onNextSection: () => void;
  onPrevSection: () => void;
  onToggleEditMode: () => void;
  onOpenSettings: () => void;
  onPresent: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
          onNextSection();
          break;
        case "ArrowLeft":
          onPrevSection();
          break;
        case "e":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            onToggleEditMode();
          }
          break;
        case ",":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            onOpenSettings();
          }
          break;
        case "p":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            onPresent();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNextSection, onPrevSection, onToggleEditMode, onOpenSettings, onPresent]);
}
```
