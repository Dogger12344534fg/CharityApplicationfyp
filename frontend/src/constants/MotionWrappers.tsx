"use client";

/**
 * MotionWrappers.tsx
 * Reusable scroll-reveal wrapper components.
 *
 * Usage:
 *   <Reveal>  — fade-up reveal (default)
 *   <RevealFade>  — fade-in (no Y movement)
 *   <RevealScale>  — scale + fade reveal
 *   <StaggerList>  — wraps children in a stagger container
 *
 * All components respect prefers-reduced-motion.
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import {
	fadeUp,
	fadeIn,
	scaleReveal,
	staggerContainer,
	staggerContainerSlow,
	reducedFadeUp,
	reducedNoAnimation,
} from "@/src/components/animations/motion.variants";

// ─────────────────────────────────────────────
// SHARED VIEWPORT CONFIG
// ─────────────────────────────────────────────
const VIEWPORT = { once: true, amount: 0.2 } as const;

// ─────────────────────────────────────────────
// REVEAL — fade up (most common)
// ─────────────────────────────────────────────
interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
	delay?: number;
	className?: string;
	children: React.ReactNode;
	as?: keyof React.JSX.IntrinsicElements;
}

export function Reveal({
	children,
	delay = 0,
	className,
	as = "div",
}: RevealProps) {
	const shouldReduce = useReducedMotion();
	const variants = shouldReduce ? reducedFadeUp : fadeUp;
	const Tag = motion[as as keyof typeof motion] as typeof motion.div;

	return (
		<Tag
			className={className}
			variants={variants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			transition={delay ? { delay } : undefined}>
			{children}
		</Tag>
	);
}

// ─────────────────────────────────────────────
// REVEAL FADE — no Y movement
// ─────────────────────────────────────────────
export function RevealFade({ children, delay = 0, className }: RevealProps) {
	const shouldReduce = useReducedMotion();
	const variants = shouldReduce ? reducedNoAnimation : fadeIn;

	return (
		<motion.div
			className={className}
			variants={variants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			transition={delay ? { delay } : undefined}>
			{children}
		</motion.div>
	);
}

// ─────────────────────────────────────────────
// REVEAL SCALE — cards / panels
// ─────────────────────────────────────────────
export function RevealScale({ children, delay = 0, className }: RevealProps) {
	const shouldReduce = useReducedMotion();
	const variants = shouldReduce ? reducedFadeUp : scaleReveal;

	return (
		<motion.div
			className={className}
			variants={variants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			transition={delay ? { delay } : undefined}>
			{children}
		</motion.div>
	);
}

// ─────────────────────────────────────────────
// STAGGER LIST — parent that staggers children
// Children should use motion.div with variants={fadeUp}
// ─────────────────────────────────────────────
interface StaggerListProps {
	children: React.ReactNode;
	className?: string;
	slow?: boolean;
}

export function StaggerList({ children, className, slow }: StaggerListProps) {
	const shouldReduce = useReducedMotion();
	const variants = shouldReduce
		? reducedNoAnimation
		: slow
			? staggerContainerSlow
			: staggerContainer;

	return (
		<motion.div
			className={className}
			variants={variants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}>
			{children}
		</motion.div>
	);
}

// ─────────────────────────────────────────────
// STAGGER ITEM — child of StaggerList
// ─────────────────────────────────────────────
interface StaggerItemProps {
	children: React.ReactNode;
	className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
	const shouldReduce = useReducedMotion();
	const variants = shouldReduce ? reducedFadeUp : fadeUp;

	return (
		<motion.div
			className={className}
			variants={variants}>
			{children}
		</motion.div>
	);
}
