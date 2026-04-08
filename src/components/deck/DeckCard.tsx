import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const deckCardVariants = cva(
  "rounded-2xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/60 dark:bg-white/10 border-foreground/5 backdrop-blur-sm",
        surface: "bg-deck-surface border-deck-border",
        elevated: "bg-white/90 dark:bg-white/10 border-foreground/5 shadow-xl backdrop-blur-sm",
        interactive: "bg-white/60 dark:bg-white/10 border-foreground/5 backdrop-blur-sm hover:bg-white dark:hover:bg-white/15 hover:scale-[1.02] hover:shadow-lg cursor-pointer",
        slide: "bg-white/40 dark:bg-white/5 border-foreground/5 shadow-sm backdrop-blur-sm",
        glass: "glass-card-sm",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
        xl: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

interface DeckCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof deckCardVariants> {}

export const DeckCard = forwardRef<HTMLDivElement, DeckCardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(deckCardVariants({ variant, padding }), className)}
        {...props}
      />
    );
  }
);

DeckCard.displayName = "DeckCard";
