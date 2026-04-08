import { cn } from "@/lib/utils";
import { Pencil, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EditModeToggleProps {
  /** Whether edit mode is active */
  isEditMode: boolean;
  /** Toggle edit mode callback */
  onToggle: () => void;
  /** Whether saving is in progress */
  isSaving?: boolean;
  /** CSS class */
  className?: string;
}

export function EditModeToggle({
  isEditMode,
  onToggle,
  isSaving = false,
  className,
}: EditModeToggleProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isSaving && (
        <Badge variant="secondary" className="gap-1.5 font-sans-ui">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving...
        </Badge>
      )}
      
      <Button
        variant={isEditMode ? "default" : "secondary"}
        size="sm"
        onClick={onToggle}
        className={cn(
          "gap-2 font-sans-ui transition-all",
          isEditMode && "bg-primary text-primary-foreground"
        )}
      >
        {isEditMode ? (
          <>
            <Eye className="h-4 w-4" />
            View Mode
          </>
        ) : (
          <>
            <Pencil className="h-4 w-4" />
            Edit Mode
          </>
        )}
      </Button>
    </div>
  );
}
