import { motion } from "motion/react";
import { useInView } from "./useInView";

type AnimationType = "fade-up" | "fade-left" | "fade-right" | "scale-in" | "blur-in";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: AnimationType;
}

const animations: Record<AnimationType, { initial: object; animate: object }> = {
  "fade-up": {
    initial: { opacity: 0, y: 30, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "fade-left": {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  "scale-in": {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  "blur-in": {
    initial: { opacity: 0, filter: "blur(12px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
};

export function AnimatedSection({ children, delay = 0, className = "", animation = "fade-up" }: AnimatedSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const anim = animations[animation];

  return (
    <motion.div
      ref={ref}
      initial={anim.initial}
      animate={isInView ? anim.animate : {}}
      transition={{ 
        duration: 0.7, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      style={{ willChange: isInView ? 'auto' : 'opacity, transform, filter' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
