import { motion } from "framer-motion";
import { Building, Leaf, Briefcase, Settings, Target, Check, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

interface PartnerCardProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  statusVariant: "early" | "advanced" | "secured";
  target: string;
  commitment?: string;
  profile: string;
  progress: number;
  currentState: string;
  partners?: string[];
}

function PartnerCard({ 
  icon, 
  title, 
  status, 
  statusVariant, 
  target, 
  commitment,
  profile, 
  progress, 
  currentState,
  partners 
}: PartnerCardProps) {
  const statusStyles = {
    early: "bg-primary/20 text-primary border-primary/30",
    advanced: "bg-green-500/20 text-green-700 border-green-500/30",
    secured: "bg-green-500/20 text-green-700 border-green-500/30"
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="glass-card-sm p-6 flex flex-col h-full"
    >
      {/* Top content - grows to fill space */}
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-xl bg-primary/10">
            {icon}
          </div>
          <Badge className={statusStyles[statusVariant]}>
            {status}
          </Badge>
        </div>

        <h3 className="font-serif-display text-xl font-medium text-foreground">
          {title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-sans-ui text-sm font-medium text-foreground">{target}</span>
          </div>
          {commitment && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-sans-ui text-sm text-muted-foreground">{commitment}</span>
            </div>
          )}
        </div>

        <p className="font-serif-body text-sm text-muted-foreground leading-relaxed">
          {profile}
        </p>

        {partners && (
          <div className="flex flex-wrap gap-2">
            {partners.map((partner, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-sm text-green-700">
                <Check className="w-3 h-3" />
                {partner}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom section - always aligned */}
      <div className="pt-4 mt-auto space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-sans-ui">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <p className="font-serif-body text-xs text-foreground/70 italic leading-relaxed">
          {currentState}
        </p>
      </div>
    </motion.div>
  );
}

export function WhatWeNeedSection() {
  const partners: PartnerCardProps[] = [
    {
      icon: <Building className="w-6 h-6 text-primary" />,
      title: "Anchor Buyers",
      status: "EARLY PROGRESS",
      statusVariant: "early",
      target: "3-5 anchor buyers",
      commitment: "$60M+ initial pool",
      profile: "Mainstream corporates with allocated climate budgets, regulatory pressure, or internal commitments",
      progress: 25,
      currentState: "Strong indications of support from household names"
    },
    {
      icon: <Leaf className="w-6 h-6 text-primary" />,
      title: "Project Developers",
      status: "ADVANCED PROGRESS",
      statusVariant: "advanced",
      target: "10+ validated projects",
      profile: "High-rated developers using CCP-approved methodologies with track records",
      progress: 50,
      currentState: "Strong pipeline confirmed; developers eager for coordinated offtakes"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      title: "Capital Providers",
      status: "EARLY PROGRESS",
      statusVariant: "early",
      target: "Pre-committed implementation finance",
      profile: "Banks, asset managers with carbon mandates seeking standardised offtake structures",
      progress: 25,
      currentState: "Ample dry powder in market; structured products in development"
    },
    {
      icon: <Settings className="w-6 h-6 text-primary" />,
      title: "Technical Partners",
      status: "SECURED",
      statusVariant: "secured",
      target: "Registry, ratings, insurance, legal",
      profile: "Infrastructure partners providing operational backbone for V1 launch",
      progress: 90,
      currentState: "Core partnerships in place",
      partners: ["Registries", "Ratings", "Insurance", "Legal"]
    }
  ];

  const buyerChecklist = [
    "$20M+ climate budget allocated but undeployed",
    "Willingness to commit against specifications vs. selecting individual projects",
    "Multi-year horizon (5+ year commitments preferred)"
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-4">
        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-sans-ui">
          V1 Requirements
        </span>
        <h1 className="font-serif-display text-4xl md:text-5xl font-medium text-foreground leading-tight">
          Building Critical Mass
        </h1>
        <p className="font-serif-body text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          V1 launch requires three anchor buyers, validated project pipeline, and operational partners. 
          We've secured technical infrastructure and developer commitment. Buyer commitments are the critical path.
        </p>
      </motion.div>

      {/* Partner Categories Grid */}
      <div className="grid md:grid-cols-2 gap-6 auto-rows-fr">
        {partners.map((partner, idx) => (
          <PartnerCard key={idx} {...partner} />
        ))}
      </div>

      {/* Critical Path Section */}
      <motion.div 
        variants={itemVariants}
        className="glass-card-sm p-8 bg-primary/10 border-primary/20 space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif-display text-2xl md:text-3xl font-medium text-foreground">
            Buyer Commitments = Launch Trigger
          </h2>
        </div>
        <p className="font-serif-body text-lg text-foreground/80 leading-relaxed max-w-4xl">
          Hurdle's success relies on buyer participation more than anything else. We have developer appetite, 
          capital provider interest, technical partner agreements, and operational blueprints. 
          Securing 3 anchor buyers unlocks V1 deployment in Q2 2026.
        </p>
        <a href="mailto:hurdle@hutchinsclimate.com?subject=Hurdle%20-%20Anchor%20Buyer%20Introduction" className="mt-4 inline-block">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans-ui font-medium px-8">
            Connect With Us
          </Button>
        </a>
      </motion.div>

      {/* Bottom Row: Target Buyer + Why Now */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Target Buyer Profile */}
        <motion.div variants={itemVariants} className="glass-card-sm p-6 space-y-4">
          <h3 className="font-serif-display text-xl font-medium text-foreground">
            Ideal Anchor Buyer
          </h3>
          <ul className="space-y-3">
            {buyerChecklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-full bg-primary/10">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="font-serif-body text-sm text-foreground/80 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Why Now */}
        <motion.div variants={itemVariants} className="glass-card-sm p-6 space-y-4">
          <h3 className="font-serif-display text-xl font-medium text-foreground">
            Market Window
          </h3>
          <p className="font-serif-body text-sm text-foreground/80 leading-relaxed">
            Corporate climate commitments are scaling. Regulatory pressure is intensifying. 
            Allocated budgets are sitting idle. The infrastructure gap is becoming obvious.
          </p>
          <p className="font-serif-body text-sm text-foreground/80 leading-relaxed">
            First-mover anchor buyers will have access to the highest-quality project pipeline 
            before it's committed elsewhere.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
