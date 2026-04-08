import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditableTextProps {
  /** The current value */
  value: string;
  /** Callback when value changes */
  onSave: (value: string) => void | Promise<void>;
  /** Whether editing is allowed */
  isEditable?: boolean;
  /** Whether the component is currently saving */
  isSaving?: boolean;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Use textarea for multi-line editing */
  multiline?: boolean;
  /** CSS class for the display text */
  className?: string;
  /** CSS class for the input */
  inputClassName?: string;
  /** Maximum length for the input */
  maxLength?: number;
  /** Minimum rows for textarea */
  minRows?: number;
  /** Variant for styling */
  variant?: "title" | "body" | "label" | "default";
}

export function EditableText({
  value,
  onSave,
  isEditable = true,
  isSaving = false,
  placeholder = "Click to edit...",
  multiline = false,
  className,
  inputClassName,
  maxLength = 500,
  minRows = 2,
  variant = "default",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync internal state with external value
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(async () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue !== value) {
      await onSave(trimmedValue);
    }
    setIsEditing(false);
  }, [editValue, value, onSave]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !multiline) {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Enter" && multiline && e.metaKey) {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel, multiline]
  );

  const variantStyles = {
    title: "font-serif-display text-xl font-medium",
    body: "font-serif-body text-muted-foreground leading-relaxed",
    label: "label-text",
    default: "font-sans-ui",
  };

  if (!isEditable) {
    return (
      <span className={cn(variantStyles[variant], className)}>
        {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      </span>
    );
  }

  if (isEditing) {
    const InputComponent = multiline ? Textarea : Input;

    return (
      <div className="relative group">
        <InputComponent
          ref={inputRef as any}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          maxLength={maxLength}
          rows={multiline ? minRows : undefined}
          className={cn(
            "w-full bg-white/90 dark:bg-white/10 border-primary focus:ring-2 focus:ring-primary/20",
            variantStyles[variant],
            inputClassName
          )}
          placeholder={placeholder}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
              >
                <Check className="h-3 w-3 text-deck-completed" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
              >
                <X className="h-3 w-3 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "group relative cursor-pointer rounded-lg transition-colors",
        "hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20",
        variantStyles[variant],
        className
      )}
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => e.key === "Enter" && setIsEditing(true)}
      tabIndex={0}
      role="button"
      aria-label="Click to edit"
    >
      {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      <Pencil className="inline-block ml-2 h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </span>
  );
}
