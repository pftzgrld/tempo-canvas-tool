import { motion } from "framer-motion";
import { 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Zap, 
  Globe,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { ContentCard } from "../ContentCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import hurdleSchematic from "@/assets/hurdle-schematic.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// Stage data with schematic configurations
const STAGES = [
  {
    id: "stage-1",
    icon: ArrowRight,
    heading: "Simple, Slow, Small",
    structure: "1 Capital Provider → 1 Developer → 1 Buyer",
    schematic: { capitalProviders: 1, developers: 1, buyers: 1 },
    characteristics: [
      "12-18 month diligence cycles",
      "High transaction costs relative to deal size",
      "Cannot scale",
    ],
    painPoints: [
      "Buyer fear triggers exhaustive diligence",
      "Lengthy diligence drains developers' working capital",
      "Project-by-project underwriting creates bottlenecks",
    ],
  },
  {
    id: "stage-2",
    icon: TrendingUp,
    heading: "Developer Burden Grows",
    structure: "M Capital Providers → 1 Developer → M Buyers",
    schematic: { capitalProviders: 3, developers: 1, buyers: 3 },
    characteristics: [
      "Developer success attracts more buyers",
      "Each buyer negotiates separate contract terms, requiring unique underwriting",
      "Cannot scale",
    ],
    painPoints: [
      "Multiple diligence processes drain working capital faster",
      "Developers struggle to ensure consistency across the lattice of contractual obligations",
      "Capital struggles to deploy at scale",
    ],
  },
  {
    id: "stage-3",
    icon: AlertTriangle,
    heading: "n × m Explosion: Gridlock",
    structure: "M Capital Providers → N Developers → M Buyers",
    schematic: { capitalProviders: 5, developers: 4, buyers: 5 },
    mathematical: "(10 developers × 10 buyers) + (10 developers × 10 capital providers) = 200 bilateral relationships",
    painPoints: [
      "Each relationship demands separate diligence, separate negotiation, separate financing",
      "Transaction costs increase further",
      "The market stalls under the weight of its own good intentions",
    ],
    missing: [
      "No shared diligence standard",
      "No shared documentation",
      "Bad payment diversification",
      "Bad performance diversification",
      "Bad capital efficiency",
    ],
  },
  {
    id: "stage-4",
    icon: Users,
    heading: "Buyers' Clubs",
    structure: "N Developers → 1 Buyer Pool",
    schematic: { capitalProviders: 0, developers: 4, buyers: 1, buyerPool: true },
    characteristics: [
      "Forward-thinking buyers see that duplication destroys value",
      "Centralised diligence designed to reduce parallel buyer processes",
    ],
    gaps: [
      "Buyers continue to do supplemental diligence",
      "Contracts still negotiated directly with each club member",
      "No tied capital",
    ],
  },
  {
    id: "stage-5",
    icon: Zap,
    heading: "Hurdle's Shared Operating System",
    schematic: { hub: true },
    isHurdle: true,
    benefits: [
      "Buyer diversification protects developers from non-payment",
      "Developer diversification protects buyers from non-delivery",
      "Portfolio structure de-risks capital",
      "Transaction costs plummet",
      "Central diligence accelerates impact",
    ],
  },
  {
    id: "stage-6",
    icon: Globe,
    heading: "Vision: Continuous Marketplace",
    timeline: "2029+",
    schematic: { marketplace: true },
    characteristics: [
      "Real-time project submission and assessment",
      "Algorithmic matching between projects and buyer specs",
      "Secondary market for forward contracts",
      "Standardized derivative instruments",
      "Network effects entrench position",
    ],
  },
];

// Hub-and-spoke visualization component - uses PNG image
function HurdleSchematic() {
  return (
    <div className="bg-muted/70 rounded-lg p-6">
      <div className="relative w-full max-w-2xl mx-auto">
        <img
          src={hurdleSchematic}
          alt="Hurdle connects Capital Providers, Developers, and Buyers through a unified platform"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

// Schematic component for each stage
function StageSchematic({ stage }: { stage: typeof STAGES[0] }) {
  const schematic = stage.schematic;
  
  if (!schematic) return null;

  // Hub-and-spoke for Hurdle (Stage 5) - use the same schematic as Solution section
  if (schematic.hub) {
    return <HurdleSchematic />;
  }

  // Marketplace visualization (Stage 6) - no graphic
  if (schematic.marketplace) {
    return null;
  }

  // Buyer pool (Stage 4)
  if (schematic.buyerPool) {
    return (
      <div className="bg-muted/30 rounded-lg p-6">
        <svg viewBox="0 0 400 140" className="w-full h-auto max-w-md mx-auto" fill="none">
          {/* Column labels */}
          <text x="80" y="15" textAnchor="middle" className="text-[9px] uppercase tracking-[0.1em] fill-muted-foreground opacity-30" style={{ fontFamily: 'sans-serif' }}>
            Capital Providers
          </text>
          <text x="200" y="15" textAnchor="middle" className="text-[9px] uppercase tracking-[0.1em] fill-muted-foreground" style={{ fontFamily: 'sans-serif' }}>
            Developers
          </text>
          <text x="330" y="15" textAnchor="middle" className="text-[9px] uppercase tracking-[0.1em] fill-muted-foreground" style={{ fontFamily: 'sans-serif' }}>
            Buyer Pool
          </text>

          {/* Capital providers (faded) */}
          {[0, 1, 2].map((i) => (
            <circle key={`cp-${i}`} cx="80" cy={40 + i * 30} r="10" fill="hsl(var(--muted-foreground))" opacity="0.15" />
          ))}

          {/* Developers */}
          {[0, 1, 2, 3].map((i) => (
            <circle key={`d-${i}`} cx="200" cy={35 + i * 28} r="10" fill="hsl(var(--foreground))" opacity="0.6" />
          ))}

          {/* Buyer Pool */}
          <rect x="290" y="35" width="80" height="80" rx="8" fill="hsl(var(--primary))" opacity="0.15" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          {[0, 1, 2].map((i) => (
            <circle key={`b-${i}`} cx={310 + (i % 2) * 30} cy={55 + Math.floor(i / 2) * 30 + (i % 2) * 15} r="8" fill="hsl(var(--primary))" opacity="0.8" />
          ))}

          {/* Connection lines - Developers to Buyer Pool */}
          {[0, 1, 2, 3].map((i) => (
            <line key={`d-bp-${i}`} x1="210" y1={35 + i * 28} x2="290" y2="75" stroke="hsl(var(--muted-foreground))" strokeWidth="0.75" opacity="0.3" />
          ))}
        </svg>
      </div>
    );
  }

  // Standard n×m diagram
  const { capitalProviders = 0, developers = 1, buyers = 0 } = schematic;
  
  return (
    <div className="bg-muted/30 rounded-lg p-6">
      <svg viewBox="0 0 400 160" className="w-full h-auto max-w-md mx-auto" fill="none">
        {/* Column labels */}
        <text x="60" y="15" textAnchor="middle" className="text-[9px] uppercase tracking-[0.1em] fill-muted-foreground" style={{ fontFamily: 'sans-serif' }}>
          Capital Providers
        </text>
        <text x="200" y="15" textAnchor="middle" className="text-[9px] uppercase tracking-[0.1em] fill-muted-foreground" style={{ fontFamily: 'sans-serif' }}>
          Developers
        </text>
        <text x="340" y="15" textAnchor="middle" className="text-[9px] uppercase tracking-[0.1em] fill-muted-foreground" style={{ fontFamily: 'sans-serif' }}>
          Buyers
        </text>

        {/* Capital Providers */}
        {Array.from({ length: capitalProviders }).map((_, i) => {
          const spacing = 120 / Math.max(capitalProviders, 1);
          const yOffset = capitalProviders === 1 ? 80 : 35 + i * spacing;
          return (
            <circle key={`cp-${i}`} cx="60" cy={yOffset} r="10" fill="hsl(var(--primary))" opacity="0.8" />
          );
        })}

        {/* Developers */}
        {Array.from({ length: developers }).map((_, i) => {
          const spacing = 120 / Math.max(developers, 1);
          const yOffset = developers === 1 ? 80 : 35 + i * spacing;
          return (
            <circle key={`d-${i}`} cx="200" cy={yOffset} r="10" fill="hsl(var(--foreground))" opacity="0.6" />
          );
        })}

        {/* Buyers */}
        {Array.from({ length: buyers }).map((_, i) => {
          const spacing = 120 / Math.max(buyers, 1);
          const yOffset = buyers === 1 ? 80 : 35 + i * spacing;
          return (
            <circle key={`b-${i}`} cx="340" cy={yOffset} r="10" fill="hsl(var(--primary))" opacity="0.8" />
          );
        })}

        {/* Connection lines - Capital Providers to Developers */}
        {Array.from({ length: capitalProviders }).map((_, cp) => {
          const cpSpacing = 120 / Math.max(capitalProviders, 1);
          const cpY = capitalProviders === 1 ? 80 : 35 + cp * cpSpacing;
          
          return Array.from({ length: developers }).map((_, d) => {
            const dSpacing = 120 / Math.max(developers, 1);
            const dY = developers === 1 ? 80 : 35 + d * dSpacing;
            
            return (
              <line
                key={`cp-d-${cp}-${d}`}
                x1="70"
                y1={cpY}
                x2="190"
                y2={dY}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.5"
                opacity="0.25"
              />
            );
          });
        })}

        {/* Connection lines - Developers to Buyers */}
        {Array.from({ length: developers }).map((_, d) => {
          const dSpacing = 120 / Math.max(developers, 1);
          const dY = developers === 1 ? 80 : 35 + d * dSpacing;
          
          return Array.from({ length: buyers }).map((_, b) => {
            const bSpacing = 120 / Math.max(buyers, 1);
            const bY = buyers === 1 ? 80 : 35 + b * bSpacing;
            
            return (
              <line
                key={`d-b-${d}-${b}`}
                x1="210"
                y1={dY}
                x2="330"
                y2={bY}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.5"
                opacity="0.25"
              />
            );
          });
        })}
      </svg>
    </div>
  );
}

// Product roadmap data
const ROADMAP = [
  {
    version: "V1",
    date: "Q2 2026",
    title: "Proof of Coordination",
    details: [
      "5 anchor buyers, $100M committed",
      "10 validated projects",
      "Pre-committed capital",
    ],
    metrics: [
      "Quarterly cycle runs from submission to contract execution",
      "Buyers & funders accept centralised diligence without supplementary process",
    ],
  },
  {
    version: "V2",
    date: "Q3-Q4 2026",
    title: "Recurring Cycles",
    details: [
      "7-10 buyers, $100-200M",
      "2-3 pre-committed capital providers",
      "2 additional quarterly cycles",
      "Standardized debt facility structure",
    ],
  },
  {
    version: "V3",
    date: "2027",
    title: "Diligence Automation + Portfolio Financing",
    details: [
      "10+ buyers, $200-300M",
      "Automated assessment runs via APIs",
      "Portfolio-level debt facility",
    ],
  },
  {
    version: "V4",
    date: "2028",
    title: "Bond Financing + Public Market",
    details: [
      "15-20 buyers, $500M+",
      "Green bond issuance",
      "Large-scale institutional capital",
      "Becomes permanent infrastructure layer",
    ],
  },
  {
    version: "V5",
    date: "2029+",
    title: "Full Marketplace",
    details: [
      "Real-time submission and matching",
      "Secondary markets",
      "Network effects entrench position",
      "Derivative instruments",
    ],
  },
];

const SEQUENCING_REASONS = [
  "V1 proves centralised diligence and documentation can satisfy all parties",
  "V2 validates ability to run process on a fast, recurring basis",
  "V3 unlocks portfolio economics",
  "V4 creates permanent infrastructure",
  "V5 emerges naturally from critical mass",
];

export function DeepDiveSection() {
  return (
    <motion.div {...fadeInUp} className="space-y-12">
      {/* Header */}
      <div className="mb-6">
        <span className="label-text text-muted-foreground block mb-2">APPENDIX</span>
        <h2 className="section-title">Market Evolution: From Bilateral to Infrastructure</h2>
        <p className="body-large text-muted-foreground mt-4 max-w-4xl font-serif-body">
          Carbon markets have long promised to deliver a scalable solution to climate change. But they have faced headwinds, and remain sub-scale. While this is starting to change, the current trajectory of bilateral long-term offtakes without tied funding will lead to gridlock. Scalable market infrastructure that reduces transaction costs and minimises risk for all parties is necessary for carbon to finally deliver on its promise. This is what Hurdle is designed to solve.
        </p>
      </div>

      {/* Stage-by-Stage Analysis */}
      <div>
        <h3 className="font-serif-display text-2xl font-medium mb-6">Market Evolution Stages</h3>
        <Accordion type="single" collapsible className="space-y-3">
          {STAGES.map((stage, index) => (
            <AccordionItem 
              key={stage.id} 
              value={stage.id}
              className="border-0"
            >
              <ContentCard className="overflow-hidden">
                <AccordionTrigger className="hover:no-underline py-0 [&>svg]:hidden">
                  <div className="flex items-center gap-4 w-full">
                    <div className={cn(
                      "p-2 rounded-lg shrink-0",
                      stage.isHurdle ? "bg-green-500/10" : "bg-primary/10"
                    )}>
                      <stage.icon className={cn(
                        "h-5 w-5",
                        stage.isHurdle ? "text-green-600" : "text-primary"
                      )} />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-xs text-muted-foreground font-sans-ui">
                        Stage {index + 1}
                        {stage.timeline && ` • ${stage.timeline}`}
                      </span>
                      <h4 className="font-serif-display font-medium text-lg">{stage.heading}</h4>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                  <div className="space-y-4 border-t border-foreground/5 pt-4">
                    {/* Schematic Diagram */}
                    <StageSchematic stage={stage} />


                    {/* Mathematical breakdown */}
                    {stage.mathematical && (
                      <div className="bg-destructive/5 rounded-lg p-4 text-center">
                        <code className="font-mono text-sm text-destructive">{stage.mathematical}</code>
                      </div>
                    )}

                    {/* Characteristics */}
                    {stage.characteristics && (
                      <div>
                        <h5 className="text-xs uppercase text-muted-foreground font-sans-ui mb-2">Characteristics</h5>
                        <ul className="space-y-1.5">
                          {stage.characteristics.map((item, i) => (
                            <li key={i} className="text-sm font-serif-body text-foreground/80 flex items-center gap-2">
                              <span className="text-muted-foreground">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pain Points */}
                    {stage.painPoints && (
                      <div>
                        <h5 className="text-xs uppercase text-muted-foreground font-sans-ui mb-2">Pain Points</h5>
                        <ul className="space-y-1.5">
                          {stage.painPoints.map((item, i) => (
                            <li key={i} className="text-sm font-serif-body text-foreground/80 flex items-center gap-2">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Infrastructure */}
                    {stage.missing && (
                      <div>
                        <h5 className="text-xs uppercase text-muted-foreground font-sans-ui mb-2">Missing Infrastructure</h5>
                        <ul className="space-y-1.5">
                          {stage.missing.map((item, i) => (
                            <li key={i} className="text-sm font-serif-body text-foreground/80 flex items-center gap-2">
                              <span className="text-destructive">✕</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Gaps */}
                    {stage.gaps && (
                      <div>
                        <h5 className="text-xs uppercase text-muted-foreground font-sans-ui mb-2">Continued Gaps</h5>
                        <ul className="space-y-1.5">
                          {stage.gaps.map((item, i) => (
                            <li key={i} className="text-sm font-serif-body text-foreground/80 flex items-center gap-2">
                              <span className="text-amber-500">○</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Benefits (Hurdle) */}
                    {stage.benefits && (
                      <div>
                        <h5 className="text-xs uppercase text-muted-foreground font-sans-ui mb-2">Benefits</h5>
                        <ul className="space-y-1.5">
                          {stage.benefits.map((item, i) => (
                            <li key={i} className="text-sm font-serif-body text-foreground/80 flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </ContentCard>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Critical Insight Card */}
      <ContentCard className="bg-primary/10 border-primary/20">
        <div className="space-y-4">
          <h3 className="font-serif-display text-xl font-medium">
            Why Coordination Can't Emerge Bilaterally
          </h3>
          <p className="font-serif-body text-foreground/80">
            The n × m explosion reveals what's missing:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              "Standard Diligence",
              "Standard Documentation", 
              "Capital Coordination",
              "Payment Pooling",
              "Performance Pooling"
            ].map((item, i) => (
              <div key={i} className="bg-primary/20 border border-primary/30 rounded-lg px-3 py-2 flex items-center justify-center min-h-[48px]">
                <span className="text-sm font-sans-ui font-medium text-foreground text-center">{item}</span>
              </div>
            ))}
          </div>
          <p className="font-serif-body text-foreground/80 italic">
            Individual buyers, developers, and capital providers can't solve this alone. Infrastructure is required.
          </p>
        </div>
      </ContentCard>

      {/* Product Evolution Roadmap */}
      <div>
        <h3 className="font-serif-display text-2xl font-medium mb-6">Product Evolution Roadmap</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-foreground/10" />
          
          <div className="space-y-4">
            {ROADMAP.map((phase, i) => (
              <motion.div
                key={phase.version}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative pl-10"
              >
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-2.5 top-5 w-3 h-3 rounded-full ring-4 ring-background",
                  i === 0 ? "bg-primary" : "bg-foreground/20"
                )} />

                <ContentCard size="md">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-sans-ui font-bold text-primary">{phase.version}</span>
                      <span className="text-xs text-muted-foreground font-sans-ui bg-muted/50 px-2 py-0.5 rounded">
                        {phase.date}
                      </span>
                      <h4 className="font-serif-display font-medium">{phase.title}</h4>
                    </div>
                    
                    <ul className="space-y-1">
                      {phase.details.map((detail, j) => (
                        <li key={j} className="text-sm font-serif-body text-foreground/80 flex items-center gap-2">
                          <span className="text-muted-foreground">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>

                    {phase.metrics && (
                      <div className="border-t border-foreground/5 pt-3 mt-3">
                        <h5 className="text-xs uppercase text-muted-foreground font-sans-ui mb-2">Success Metrics</h5>
                        <ul className="space-y-1">
                          {phase.metrics.map((metric, j) => (
                            <li key={j} className="text-sm font-serif-body text-foreground/80 flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </ContentCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why This Sequencing Matters */}
      <ContentCard>
        <h3 className="font-serif-display text-xl font-medium mb-4">Why This Sequencing Matters</h3>
        <ul className="space-y-2">
          {SEQUENCING_REASONS.map((reason, i) => (
            <li key={i} className="text-sm font-serif-body text-foreground/80 flex items-center gap-3">
              <span className="font-sans-ui font-bold text-primary shrink-0">V{i + 1}</span>
              {reason}
            </li>
          ))}
        </ul>
      </ContentCard>
    </motion.div>
  );
}
