import { useEffect } from "react";

interface UseMenuKeyboardShortcutsProps {
  onNextSection: () => void;
  onPrevSection: () => void;
  onOpenSettings: () => void;
}

export function useMenuKeyboardShortcuts({
  onNextSection,
  onPrevSection,
  onOpenSettings,
}: UseMenuKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if in input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Cmd/Ctrl + , for settings
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        onOpenSettings();
        return;
      }

      // Arrow keys for section navigation (without modifiers)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            onNextSection();
            break;
          case "ArrowLeft":
            e.preventDefault();
            onPrevSection();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNextSection, onPrevSection, onOpenSettings]);
}
