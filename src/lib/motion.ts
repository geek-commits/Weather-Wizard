/**
 * Premium motion identity — Weather Wizard
 * Signature easing: cubic-bezier(0.22,1,0.36,1) (MD3 Emphasized decelerate)
 * Locked hierarchy: label ~190ms < glass 460ms/420ms < scene 520ms < initial 150ms < ambient 5-16s
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
    quick: 160, // label 190 uses quick+ 
    standard: 380,
    slow: 520, // scene day transition locked
    entrance: 1800,
    glass: 460,
    glassWidth: 420,
    initialFade: 150,
    label: 190,
  },
} as const;
