/**
 * Premium motion identity — Weather Wizard
 * Signature easing: cubic-bezier(0.22,1,0.36,1) (MD3 Emphasized decelerate)
 * Duration palette: quick 160ms / standard 380ms / slow 520ms / entrance 1.8s
 * Layers: Primary (position/scale/opacity) + Secondary (blur/shadow) + Ambient (glow/sweep)
 */
export const motion = {
  easing: {
    signature: "cubic-bezier(0.22,1,0.36,1)",
    premium: "cubic-bezier(0.4,0,0.2,1)",
    entrance: "cubic-bezier(0.22,1,0.36,1)",
    exit: "cubic-bezier(0.3,0,1,1)",
  },
  duration: {
    quick: 160,
    standard: 380,
    slow: 520,
    entrance: 1800,
  },
} as const;
