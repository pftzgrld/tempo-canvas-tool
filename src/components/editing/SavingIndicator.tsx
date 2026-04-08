import { cn } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SavingIndicatorProps {
  /** Whether saving is in progress */
  isSaving: boolean;
  /** Last saved timestamp */
  lastSaved?: Date | null;
  /** CSS class */
  className?: string;
}

export function SavingIndicator({
  isSaving,
  lastSaved,
  className,
}: SavingIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className={cn("flex items-center gap-2 text-sm font-sans-ui", className)}>
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </motion.div>
        ) : lastSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-1.5 text-deck-completed"
          >
            <Check className="h-3 w-3" />
            <span>Saved at {formatTime(lastSaved)}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
