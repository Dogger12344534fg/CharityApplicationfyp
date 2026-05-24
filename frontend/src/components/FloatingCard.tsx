"use client";

/**
 * FloatingCard.tsx
 * Wraps a hero orbit category card with a subtle infinite float animation.
 *
 * - Very subtle vertical travel (–8px)
 * - Each card gets a different delay via `floatIndex`
 * - Float uses translateY only — no layout shifts
 * - Hover interactions from Tailwind CSS are preserved (no conflict)
 * - Reduced motion: animation is disabled, card is static
 *
 * Usage:
 *   <FloatingCard floatIndex={0}>
 *     <Link href="..." className="..."> ... </Link>
 *   </FloatingCard>
 *
 * floatIndex: 0–5 (maps to pre-defined delays for organic feel)
 */

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

const FLOAT_DELAYS = [0, 0.7, 1.4, 0.35, 1.05, 1.75];

interface FloatingCardProps {
	children: React.ReactNode;
	floatIndex?: number;
	className?: string;
	style?: React.CSSProperties;
}

export function FloatingCard({
	children,
	floatIndex = 0,
	className,
	style,
}: FloatingCardProps) {
	const shouldReduce = useReducedMotion();
	const delay = FLOAT_DELAYS[floatIndex % FLOAT_DELAYS.length];

	return (
		<motion.div
			className={className}
			style={{ ...style, willChange: "transform" }}
			animate={
				shouldReduce
					? {}
					: {
							y: [0, -8, 0],
						}
			}
			transition={
				shouldReduce
					? {}
					: {
							duration: 4,
							ease: [0.42, 0, 0.58, 1],
							repeat: Infinity,
							delay,
						}
			}>
			{children}
		</motion.div>
	);
}
