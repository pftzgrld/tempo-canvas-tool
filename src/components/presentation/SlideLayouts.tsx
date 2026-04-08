import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SlideLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "dots";
}

export function SlideLayout({ children, className, variant = "default" }: SlideLayoutProps) {
  return (
    <div 
      className={cn(
        "relative min-h-screen w-full overflow-y-auto px-4 py-6 pb-24 md:py-8 md:px-8 lg:px-16",
        "flex flex-col justify-center",
        className
      )}
    >
      {/* Background Decorations */}
      {variant === "gradient" && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-muted to-transparent" />
        </div>
      )}
      
      {variant === "dots" && (
        <div className="absolute inset-0 -z-10">
          <div 
            className="h-full w-full opacity-20"
            style={{
              backgroundImage: "radial-gradient(hsl(var(--foreground) / 0.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      )}

      {/* Decorative lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent" />
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-gradient-to-b from-transparent via-foreground to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}

interface TwoColumnLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: "1/3" | "1/2" | "2/3";
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function TwoColumnLayout({ 
  left, 
  right, 
  leftWidth = "1/2",
  gap = "lg",
  className 
}: TwoColumnLayoutProps) {
  const widthClasses = {
    "1/3": "lg:grid-cols-[1fr_2fr]",
    "1/2": "lg:grid-cols-2",
    "2/3": "lg:grid-cols-[2fr_1fr]",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-8",
    lg: "gap-12",
  };

  return (
    <div className={cn("grid grid-cols-1", widthClasses[leftWidth], gapClasses[gap], className)}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center"
      >
        {left}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col justify-center"
      >
        {right}
      </motion.div>
    </div>
  );
}

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function GridLayout({ 
  children, 
  columns = 3, 
  gap = "md",
  className 
}: GridLayoutProps) {
  const columnClasses = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div className={cn("grid grid-cols-1", columnClasses[columns], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

interface SlideHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export function SlideHeader({ title, subtitle, icon, badge }: SlideHeaderProps) {
  // Split title for styled rendering
  const words = title.split(" ");
  const firstPart = words.slice(0, Math.min(2, words.length)).join(" ");
  const secondPart = words.slice(2).join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      {/* Badge */}
      {badge && (
        <div className="inline-flex items-center gap-3 rounded-full border border-foreground/10 bg-background/80 px-4 py-1.5 backdrop-blur mb-6">
          <span className="flex h-2 w-2 items-center justify-center rounded-full bg-primary">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
          </span>
          <span className="label-text">{badge}</span>
        </div>
      )}
      
      {/* Title with icon */}
      <div className="flex items-start gap-4">
        {icon && (
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          <h1 className="slide-title">
            {firstPart}
            {secondPart && (
              <>
                <br className="hidden md:block" />
                <span className="italic text-primary">{secondPart}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-lg font-serif-body leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
