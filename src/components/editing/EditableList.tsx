import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentCard } from "@/components/deck/ContentCard";

interface EditableListItem {
  id: string;
  value: string;
}

interface EditableListProps {
  /** The list of items */
  items: EditableListItem[];
  /** Callback when items change (reorder, add, remove, edit) */
  onItemsChange: (items: EditableListItem[]) => void | Promise<void>;
  /** Whether editing is allowed */
  isEditable?: boolean;
  /** Whether the component is currently saving */
  isSaving?: boolean;
  /** Placeholder for new item input */
  placeholder?: string;
  /** Placeholder for empty list */
  emptyPlaceholder?: string;
  /** Custom render function for each item */
  renderItem?: (item: EditableListItem, index: number) => React.ReactNode;
  /** Show add button */
  showAddButton?: boolean;
  /** Show delete button on items */
  showDeleteButton?: boolean;
  /** Show drag handle on items */
  showDragHandle?: boolean;
  /** CSS class for the container */
  className?: string;
}

export function EditableList({
  items,
  onItemsChange,
  isEditable = true,
  isSaving = false,
  placeholder = "Add new item...",
  emptyPlaceholder = "No items yet",
  renderItem,
  showAddButton = true,
  showDeleteButton = true,
  showDragHandle = true,
  className,
}: EditableListProps) {
  const [newItemValue, setNewItemValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onItemsChange(newItems);
      }
    },
    [items, onItemsChange]
  );

  const handleAddItem = useCallback(() => {
    const trimmed = newItemValue.trim();
    if (!trimmed) return;
    
    const newItem: EditableListItem = {
      id: `temp-${Date.now()}`,
      value: trimmed,
    };
    onItemsChange([...items, newItem]);
    setNewItemValue("");
  }, [newItemValue, items, onItemsChange]);

  const handleDeleteItem = useCallback(
    (id: string) => {
      onItemsChange(items.filter((item) => item.id !== id));
    },
    [items, onItemsChange]
  );

  const handleEditItem = useCallback(
    (id: string, newValue: string) => {
      const trimmed = newValue.trim();
      if (!trimmed) return;
      
      onItemsChange(
        items.map((item) => (item.id === id ? { ...item, value: trimmed } : item))
      );
      setEditingId(null);
    },
    [items, onItemsChange]
  );

  const startEditing = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  if (!isEditable) {
    return (
      <div className={cn("space-y-2", className)}>
        {items.length === 0 ? (
          <p className="text-muted-foreground font-serif-body italic">{emptyPlaceholder}</p>
        ) : (
          items.map((item, index) => (
            <div key={item.id}>
              {renderItem ? renderItem(item, index) : (
                <ContentCard size="sm" interactive={false}>
                  <span className="font-serif-body">{item.value}</span>
                </ContentCard>
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.length === 0 ? (
            <p className="text-muted-foreground font-serif-body italic py-4">{emptyPlaceholder}</p>
          ) : (
            items.map((item, index) => (
              <SortableListItem
                key={item.id}
                item={item}
                index={index}
                isEditing={editingId === item.id}
                editValue={editValue}
                onEditValueChange={setEditValue}
                onStartEditing={startEditing}
                onSaveEdit={handleEditItem}
                onCancelEdit={() => setEditingId(null)}
                onDelete={handleDeleteItem}
                showDragHandle={showDragHandle}
                showDeleteButton={showDeleteButton}
                renderItem={renderItem}
                isSaving={isSaving}
              />
            ))
          )}
        </SortableContext>
      </DndContext>

      {showAddButton && (
        <div className="flex gap-2">
          <Input
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddItem();
              }
            }}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleAddItem}
            disabled={!newItemValue.trim() || isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

interface SortableListItemProps {
  item: EditableListItem;
  index: number;
  isEditing: boolean;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onStartEditing: (id: string, value: string) => void;
  onSaveEdit: (id: string, value: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  showDragHandle: boolean;
  showDeleteButton: boolean;
  renderItem?: (item: EditableListItem, index: number) => React.ReactNode;
  isSaving: boolean;
}

function SortableListItem({
  item,
  index,
  isEditing,
  editValue,
  onEditValueChange,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  showDragHandle,
  showDeleteButton,
  renderItem,
  isSaving,
}: SortableListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group",
        isDragging && "opacity-50"
      )}
    >
      <ContentCard 
        size="sm" 
        className={cn(
          "flex items-center gap-3",
          isDragging && "shadow-2xl ring-2 ring-primary"
        )}
      >
        {showDragHandle && (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none p-1 hover:bg-muted rounded"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSaveEdit(item.id, editValue);
              } else if (e.key === "Escape") {
                onCancelEdit();
              }
            }}
            onBlur={() => onSaveEdit(item.id, editValue)}
            autoFocus
            className="flex-1"
          />
        ) : (
          <div 
            className="flex-1 cursor-pointer font-serif-body"
            onClick={() => onStartEditing(item.id, item.value)}
          >
            {renderItem ? renderItem(item, index) : item.value}
          </div>
        )}

        {showDeleteButton && !isEditing && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(item.id)}
            disabled={isSaving}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </ContentCard>
    </div>
  );
}
