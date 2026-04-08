import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Zap, PieChart, Briefcase, BarChart3, ChevronDown } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Timeline steps data
const timelineSteps = [
  {
    icon: Users,
    heading: "Aggregate Multi-Year Buyer Commitments",
    body: "Secure corporate commitments to buy credits that satisfy defined specifications under multi-year offtakes.",
  },
  {
    icon: Search,
    heading: "Complete Diligence & Documentation Every Quarter",
    body: "Developers submit data once per quarter. Registries, ratings agencies, and insurance providers assess centrally against agreed specifications. Successful developers enter standardised offtakes at the end of each cycle.",
  },
  {
    icon: Zap,
    heading: "Unlock Pre-Committed Finance",
    body: "Capital providers co-design diligence to satisfy their underwriting requirements. Successful projects receive simultaneous offtake and financing at the end of each cycle.",
  },
];

// Benefits data
const benefits = [
  {
    icon: PieChart,
    title: "Payment Diversification",
    body: "Developers mitigate buyer payment default risks through diversification",
  },
  {
    icon: Briefcase,
    title: "Delivery Diversification",
    body: "Buyers mitigate delivery risk through diversification",
  },
  {
    icon: BarChart3,
    title: "Capital Efficiency",
    body: "Funders underwrite diversified portfolios and increase loan-to-value",
  },
];

import hurdleSchematic from "@/assets/hurdle-schematic-solution.png";

// Hub-and-spoke visualization component
function TransactionCostVisualization() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-card-sm p-2"
    >
      <h3 className="font-serif-display text-xl md:text-2xl font-medium text-center mb-8">
        Hurdle Accelerates Capital Deployment & Minimises Risk
      </h3>

      {/* Schematic image */}
      <div className="relative w-full max-w-5xl mx-auto">
        <img
          src={hurdleSchematic}
          alt="Hurdle connects Capital Providers, Developers, and Buyers through a unified platform"
          className="w-full h-auto"
        />
      </div>
    </motion.div>
  );
}

// Animated timeline component with scroll/keyboard navigation
function AnimatedTimeline() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentStep < timelineSteps.length - 1) {
        e.preventDefault();
        setCurrentStep(prev => prev + 1);
      } else if (e.key === 'ArrowUp' && currentStep > 0) {
        e.preventDefault();
        setCurrentStep(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const handleScroll = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentStep < timelineSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (e.deltaY < 0 && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div 
      className="flex flex-col items-center"
      onWheel={handleScroll}
    >
      <AnimatePresence mode="wait">
        {timelineSteps.map((step, index) => (
          <motion.div
            key={step.heading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: index <= currentStep ? 1 : 0.3,
              y: 0,
              scale: index <= currentStep ? 1 : 0.98
            }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="relative flex flex-col items-center w-full max-w-2xl"
          >
            {/* Icon circle */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
              index <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}>
              <step.icon className={`h-6 w-6 transition-colors duration-300 ${
                index <= currentStep ? 'text-primary-foreground' : 'text-muted-foreground'
              }`} />
            </div>

            {/* Content card - centered, wider */}
            <div className={`w-full glass-card-sm p-6 mt-4 transition-all duration-300 text-center ${
              index <= currentStep ? 'opacity-100' : 'opacity-50'
            }`}>
              <h3 className="font-serif-display text-xl font-medium text-foreground mb-4">
                {step.heading}
              </h3>
              <p className="font-serif-display text-base text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </div>

            {/* Arrow to next step */}
            {index < timelineSteps.length - 1 && (
              <motion.div 
                className="flex flex-col items-center my-3"
                animate={{ 
                  opacity: index < currentStep ? 1 : 0.4 
                }}
              >
                <div className="w-0.5 h-6 bg-primary/30" />
                <ChevronDown className="h-5 w-5 text-primary/50 -mt-1" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function SolutionSection() {
  return (
    <motion.div {...fadeInUp} className="space-y-8 max-w-5xl mx-auto">
      {/* Section Eyebrow */}
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        HURDLE'S APPROACH
      </span>

      {/* Main Heading */}
      <h1 className="font-serif-display text-3xl sm:text-4xl md:text-[48px] font-medium leading-tight tracking-tight">
        A Shared Operating System
      </h1>

      {/* Subtitle - serif font */}
      <p className="font-serif-display text-lg sm:text-xl leading-relaxed text-foreground/80">
        Hurdle aligns buyers, developers, and capital providers around a shared operating system that collapses bilateral complexity into coordinated cycles.
      </p>

      {/* Transaction Cost Collapse - Full width, immediately after subtitle */}
      <TransactionCostVisualization />

      {/* How It Works - Animated Vertical Timeline */}
      <div className="space-y-6 pt-4">
        <h2 className="font-serif-display text-2xl font-medium text-foreground text-center">
          How It Works
        </h2>

        <AnimatedTimeline />
      </div>

      {/* Benefits Grid */}
      <div className="space-y-6 pt-4">
        <h2 className="font-serif-display text-2xl font-medium text-foreground text-center">
          Benefits
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            >
              <div className="glass-card-sm p-6 h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif-display font-medium text-lg">
                      {benefit.title}
                    </h3>
                    <p className="font-serif-display text-sm text-muted-foreground leading-relaxed">
                      {benefit.body}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
