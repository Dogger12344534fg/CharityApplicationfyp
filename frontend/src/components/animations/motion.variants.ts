/**
 * motion.variants.ts
 * Reusable Framer Motion animation variants for Setu homepage.
 * GPU-friendly: transforms + opacity only.
 * Respects prefers-reduced-motion via useReducedMotion().
 */

import type { Variants } from "framer-motion";

// ─────────────────────────────────────────────
// BASE EASING
// ─────────────────────────────────────────────
export const EASE_OUT = [0.0, 0.0, 0.2, 1] as const;
export const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1] as const;
export const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const;

// ─────────────────────────────────────────────
// REVEAL VARIANTS
// ─────────────────────────────────────────────

/** Fade up — primary reveal for headings and text blocks */
export const fadeUp: Variants = {
	hidden: { opacity: 0, y: 40 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
	},
};

/** Fade in — for elements that shouldn't move */
export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
	},
};

/** Scale reveal — for cards/panels */
export const scaleReveal: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
	},
};

/** Slide in from left */
export const slideLeft: Variants = {
	hidden: { opacity: 0, x: -40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
	},
};

/** Slide in from right */
export const slideRight: Variants = {
	hidden: { opacity: 0, x: 40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
	},
};

// ─────────────────────────────────────────────
// STAGGER CONTAINER
// ─────────────────────────────────────────────

/** Wraps a list of children and staggers their reveal */
export const staggerContainer: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.05,
		},
	},
};

/** Slower stagger for larger cards */
export const staggerContainerSlow: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.14,
			delayChildren: 0.1,
		},
	},
};

// ─────────────────────────────────────────────
// ORBIT RING ANIMATIONS (CSS keyframes via style)
// Defined here as config constants used in components
// ─────────────────────────────────────────────

export const ORBIT_OUTER = {
	animate: { rotate: 360 },
	transition: {
		duration: 60,
		ease: "linear" as const,
		repeat: Infinity,
	},
};

export const ORBIT_INNER = {
	animate: { rotate: -360 },
	transition: {
		duration: 40,
		ease: "linear" as const,
		repeat: Infinity,
	},
};

// ─────────────────────────────────────────────
// FLOATING CARD ANIMATION (per-card y offset)
// ─────────────────────────────────────────────

export const floatVariants = (delaySeconds: number) => ({
	animate: {
		y: [0, -8, 0],
		transition: {
			duration: 4,
			ease: EASE_IN_OUT,
			repeat: Infinity,
			delay: delaySeconds,
		},
	},
});

// ─────────────────────────────────────────────
// REDUCED MOTION FALLBACK
// Pass these when useReducedMotion() is true
// ─────────────────────────────────────────────

export const reducedFadeUp: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const reducedNoAnimation: Variants = {
	hidden: { opacity: 1 },
	visible: { opacity: 1 },
};
