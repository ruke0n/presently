"use client";

import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LiquidMetalHeroProps {
  badge?: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  features?: string[];
}

export default function LiquidMetalHero({
  badge,
  title,
  subtitle,
  primaryCtaLabel,
  secondaryCtaLabel,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  features = [],
}: LiquidMetalHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
      {/* Liquid metal shader, contained to the hero */}
      <LiquidMetal {...liquidMetalPresets[2]} speed={1.4} style={{ position: "absolute", inset: 0, zIndex: -20 }} />
      {/* Scrim so the foreground reads over the bright metal + fade into the body */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(95% 75% at 50% 46%, rgba(9,9,11,0.62), rgba(9,9,11,0.9) 100%), linear-gradient(0deg, #09090b 5%, transparent 42%)",
        }}
      />

      <div className="container mx-auto max-w-7xl px-6 pt-24 pb-16 lg:px-8">
        <motion.div
          className="space-y-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {badge && (
            <motion.div className="flex justify-center" variants={itemVariants}>
              <Badge
                variant="secondary"
                className="border-foreground/20 bg-foreground/10 text-foreground backdrop-blur-sm transition-colors duration-300 hover:bg-foreground/20"
              >
                {badge}
              </Badge>
            </motion.div>
          )}

          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.h1
              className="text-5xl font-medium leading-[0.95] tracking-tighter text-foreground drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl xl:text-8xl"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
            <motion.p
              className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/85 sm:text-xl"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={buttonVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onPrimaryCtaClick}
                size="lg"
                className="rounded-full bg-foreground px-8 py-6 text-base font-semibold text-background shadow-2xl transition-all duration-300 hover:bg-foreground/90"
              >
                {primaryCtaLabel}
              </Button>
            </motion.div>

            {secondaryCtaLabel && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onSecondaryCtaClick}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-foreground/30 bg-foreground/5 px-8 py-6 text-base font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-foreground/50 hover:bg-foreground/10"
                >
                  {secondaryCtaLabel}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {features.length > 0 && (
            <motion.div className="pt-10" variants={itemVariants}>
              <Card className="mx-auto max-w-3xl border-foreground/15 bg-foreground/[0.07] shadow-2xl backdrop-blur-md">
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-center text-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      >
                        <p className="text-base font-medium text-foreground/90">{feature}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
