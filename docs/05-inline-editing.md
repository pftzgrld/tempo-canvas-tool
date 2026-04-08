# PRD 05: Inline Editing

## Overview

Inline Editing allows staff to modify slide content directly during presentations. Changes persist immediately to the database and sync across all views.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Slide Component                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   isEditMode = false         isEditMode = true              │
│   ┌─────────────────┐        ┌─────────────────┐            │
│   │  Static Text    │   →    │  EditableText   │            │
│   └─────────────────┘        │  ┌───────────┐  │            │
│                              │  │ Input     │  │            │
│                              │  └───────────┘  │            │
│                              └─────────────────┘            │
│                                      │                       │
│                                      ▼                       │
│                              ┌─────────────────┐            │
│                              │  useMutation    │            │
│                              │  (auto-save)    │            │
│                              └─────────────────┘            │
│                                      │                       │
│                                      ▼                       │
│                              ┌─────────────────┐            │
│                              │   Database      │            │
│                              │   (Supabase)    │            │
│                              └─────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Edit Mode Toggle

```tsx
// src/components/presentation/EditModeToggle.tsx

import { Button } from "@/components/ui/button";
import { Pencil, Check } from "lucide-react";
import { motion } from "framer-motion";

interface EditModeToggleProps {
  isEditMode: boolean;
  onToggle: () => void;
}

export function EditModeToggle({ isEditMode, onToggle }: EditModeToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 right-4 z-50"
    >
      <Button
        variant={isEditMode ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        className="gap-2"
      >
        {isEditMode ? (
          <>
            <Check className="h-4 w-4" />
            Done Editing
          </>
        ) : (
          <>
            <Pencil className="h-4 w-4" />
            Edit Slide
          </>
        )}
      </Button>
    </motion.div>
  );
}
```

---

## Editable Text Component

```tsx
// src/components/presentation/EditableText.tsx

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  isEditMode: boolean;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function EditableText({
  value,
  onSave,
  isEditMode,
  className,
  placeholder = "Click to edit...",
  multiline = false,
  as: Component = "span",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync with prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onSave(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  // View mode (not in edit mode)
  if (!isEditMode) {
    return (
      <Component className={className}>
        {value || placeholder}
      </Component>
    );
  }

  // Edit mode but not actively editing
  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className={cn(
          "group relative text-left w-full",
          "hover:bg-primary/5 rounded transition-colors",
          "ring-2 ring-transparent hover:ring-primary/20",
          className
        )}
      >
        <Component className="inline">
          {value || <span className="text-muted-foreground italic">{placeholder}</span>}
        </Component>
        <Pencil className="inline-block ml-2 h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      </button>
    );
  }

  // Actively editing
  const InputComponent = multiline ? "textarea" : "input";

  return (
    <InputComponent
      ref={inputRef as any}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={cn(
        "w-full bg-transparent border-none outline-none",
        "ring-2 ring-primary rounded px-1 -mx-1",
        multiline && "min-h-[100px] resize-none",
        className
      )}
      rows={multiline ? 4 : undefined}
    />
  );
}
```

---

## Editable List Component

```tsx
// src/components/presentation/EditableList.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface EditableListProps<T> {
  items: T[];
  isEditMode: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderEditItem: (item: T, index: number, onChange: (updates: Partial<T>) => void) => React.ReactNode;
  onAdd: () => void;
  onUpdate: (index: number, updates: Partial<T>) => void;
  onDelete: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  getItemId: (item: T) => string;
  addLabel?: string;
}

export function EditableList<T>({
  items,
  isEditMode,
  renderItem,
  renderEditItem,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  getItemId,
  addLabel = "Add item",
}: EditableListProps<T>) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
    const newIndex = items.findIndex((item) => getItemId(item) === over.id);
    onReorder(oldIndex, newIndex);
  };

  if (!isEditMode) {
    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={getItemId(item)}>{renderItem(item, index)}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(getItemId)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => (
            <SortableEditItem
              key={getItemId(item)}
              id={getItemId(item)}
              onDelete={() => onDelete(index)}
            >
              {renderEditItem(item, index, (updates) => onUpdate(index, updates))}
            </SortableEditItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4 mr-2" />
        {addLabel}
      </Button>
    </div>
  );
}

function SortableEditItem({
  id,
  children,
  onDelete,
}: {
  id: string;
  children: React.ReactNode;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-2 p-2 rounded-lg border bg-card",
        isDragging && "shadow-lg opacity-80"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex-1">{children}</div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

---

## Example: Editable Agenda Slide

```tsx
// src/components/presentation/slides/AgendaSlide.tsx

import { SlideLayout } from "../SlideLayout";
import { EditableText } from "../EditableText";
import { EditableList } from "../EditableList";
import { useDeckMutations } from "@/hooks/useDeckMutations";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AgendaSlideProps {
  deckId: string;
  items: AgendaItem[];
  isEditMode: boolean;
}

export function AgendaSlide({ deckId, items, isEditMode }: AgendaSlideProps) {
  const { addAgendaItem, updateAgendaItem, deleteAgendaItem } = useDeckMutations(deckId);

  const handleAdd = () => {
    addAgendaItem.mutate({
      title: "New Agenda Item",
      duration: "5 min",
      display_order: items.length,
    });
  };

  const handleUpdate = (index: number, updates: Partial<AgendaItem>) => {
    const item = items[index];
    updateAgendaItem.mutate({ id: item.id, ...updates });
  };

  const handleDelete = (index: number) => {
    deleteAgendaItem.mutate(items[index].id);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    // Update display_order for affected items
    const reordered = arrayMove(items, fromIndex, toIndex);
    reordered.forEach((item, idx) => {
      if (item.display_order !== idx) {
        updateAgendaItem.mutate({ id: item.id, display_order: idx });
      }
    });
  };

  return (
    <SlideLayout>
      <div className="flex-1 flex flex-col px-16 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12"
        >
          Agenda
        </motion.h1>

        <div className="flex-1 max-w-2xl">
          <EditableList
            items={items}
            isEditMode={isEditMode}
            getItemId={(item) => item.id}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onReorder={handleReorder}
            addLabel="Add agenda item"
            renderItem={(item, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 py-4 border-b"
              >
                <span className="text-3xl font-bold text-primary/30 w-12">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{item.duration}</span>
                </div>
              </motion.div>
            )}
            renderEditItem={(item, index, onChange) => (
              <div className="space-y-2">
                <Input
                  value={item.title}
                  onChange={(e) => onChange({ title: e.target.value })}
                  placeholder="Agenda item title"
                  className="font-semibold"
                />
                <div className="flex gap-2">
                  <Input
                    value={item.description || ""}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="Description (optional)"
                    className="flex-1"
                  />
                  <Input
                    value={item.duration || ""}
                    onChange={(e) => onChange({ duration: e.target.value })}
                    placeholder="Duration"
                    className="w-24"
                  />
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </SlideLayout>
  );
}
```

---

## Auto-Save with Debounce

```typescript
// src/hooks/useAutoSave.ts

import { useRef, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useAutoSave<T>(
  saveFn: (value: T) => Promise<void>,
  delay: number = 500
) {
  const pendingRef = useRef<T | null>(null);

  const debouncedSave = useDebouncedCallback(async () => {
    if (pendingRef.current !== null) {
      await saveFn(pendingRef.current);
      pendingRef.current = null;
    }
  }, delay);

  const save = useCallback((value: T) => {
    pendingRef.current = value;
    debouncedSave();
  }, [debouncedSave]);

  return save;
}
```

**Usage:**

```tsx
const autoSave = useAutoSave(async (value: string) => {
  await updateTitle.mutateAsync({ id: itemId, title: value });
});

<EditableText
  value={item.title}
  onSave={autoSave}
  isEditMode={isEditMode}
/>
```

---

## Edit Indicators

```tsx
// src/components/presentation/EditIndicator.tsx

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface EditIndicatorProps {
  status: SaveStatus;
}

export function EditIndicator({ status }: EditIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      {status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border shadow-sm">
            {status === "saving" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-xs">Saving...</span>
              </>
            )}
            {status === "saved" && (
              <>
                <Check className="h-3 w-3 text-green-500" />
                <span className="text-xs">Saved</span>
              </>
            )}
            {status === "error" && (
              <span className="text-xs text-destructive">Failed to save</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## Modal-Based Editing (Alternative)

For complex fields, use a modal editor:

```tsx
// src/components/presentation/EditModal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface EditModalProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialData: T;
  onSave: (data: T) => void;
  children: (data: T, setData: (data: T) => void) => React.ReactNode;
}

export function EditModal<T>({
  open,
  onOpenChange,
  title,
  initialData,
  onSave,
  children,
}: EditModalProps<T>) {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    if (open) {
      setData(initialData);
    }
  }, [open, initialData]);

  const handleSave = () => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">{children(data, setData)}</div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Sync with Menu System

Changes made in presentation mode automatically reflect in the menu system because:

1. Both use the same data hooks (`useDeckData`)
2. Mutations invalidate shared query keys
3. React Query's cache ensures consistency

```typescript
// Mutation invalidation pattern
onSuccess: () => {
  // Invalidate both presentation and menu caches
  queryClient.invalidateQueries({ queryKey: ["deck", deckId] });
  queryClient.invalidateQueries({ queryKey: ["deck-sections", deckId] });
  queryClient.invalidateQueries({ queryKey: ["presentation", deckId] });
}
```
