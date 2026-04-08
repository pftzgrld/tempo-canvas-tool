import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useToast } from "@/hooks/use-toast";

interface UseAutoSaveOptions<T> {
  /** The mutation function to call on save */
  onSave: (value: T) => Promise<void>;
  /** Debounce delay in milliseconds (default: 500ms) */
  delay?: number;
  /** Success message to show */
  successMessage?: string;
  /** Error message to show */
  errorMessage?: string;
}

export function useAutoSave<T>({
  onSave,
  delay = 500,
  successMessage,
  errorMessage = "Failed to save changes",
}: UseAutoSaveOptions<T>) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const debouncedSave = useDebouncedCallback(
    async (value: T) => {
      setIsSaving(true);
      try {
        await onSave(value);
        setLastSaved(new Date());
        if (successMessage) {
          toast({
            title: successMessage,
            duration: 2000,
          });
        }
      } catch (error) {
        toast({
          title: errorMessage,
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    },
    delay
  );

  const save = useCallback(
    (value: T) => {
      debouncedSave(value);
    },
    [debouncedSave]
  );

  const saveImmediately = useCallback(
    async (value: T) => {
      debouncedSave.cancel();
      setIsSaving(true);
      try {
        await onSave(value);
        setLastSaved(new Date());
        if (successMessage) {
          toast({
            title: successMessage,
            duration: 2000,
          });
        }
      } catch (error) {
        toast({
          title: errorMessage,
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, debouncedSave, successMessage, errorMessage, toast]
  );

  return {
    save,
    saveImmediately,
    isSaving,
    lastSaved,
    cancel: debouncedSave.cancel,
    flush: debouncedSave.flush,
  };
}
