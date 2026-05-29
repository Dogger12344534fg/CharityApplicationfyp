"use client";

/**
 * OrbitRings.tsx
 * Two animated dashed orbit rings for the hero section.
 *
 * - Outer ring rotates clockwise (slow, 60s)
 * - Inner ring rotates counter-clockwise (faster, 40s)
 * - Rotation is applied on the ring div itself — center content is unaffected
 * - Reduced motion: rings are static (no rotation)
 *
 * Usage:
 *   Drop inside the hero `relative` container BEFORE the center CTA div.
 *   The rings are absolutely centered via CSS.
 *
 *   <OrbitRings />
 *
 * Design intent:
 *   Apple/Tesla-style calm, futuristic depth.
 *   The counter-rotating rings create a sense of orbital depth without
 *   being distracting. Linear easing ensures no stuttering on repeat.
 */

import { motion, useReducedMotion } from "framer-motion";

interface OrbitRingProps {
	/** Diameter in px */
	size: number;
	/** Duration in seconds for one full rotation */
	duration: number;
	/** 1 = clockwise, -1 = counter-clockwise */
	direction?: 1 | -1;
	/** Tailwind classes for the ring border color/style */
	className?: string;
}

function OrbitRing({
	size,
	duration,
	direction = 1,
	className = "",
}: OrbitRingProps) {
	const shouldReduce = useReducedMotion();

	return (
		<motion.div
			className={`absolute rounded-full border-2 border-dashed pointer-events-none ${className}`}
			style={{
				width: size,
				height: size,
				top: "50%",
				left: "50%",
				marginTop: -size / 2,
				marginLeft: -size / 2,
				willChange: "transform",
			}}
			animate={shouldReduce ? {} : { rotate: direction * 360 }}
			transition={
				shouldReduce
					? {}
					: {
							duration,
							ease: "linear",
							repeat: Infinity,
							repeatType: "loop",
						}
			}
		/>
	);
}

export function OrbitRings() {
	return (
		<>
			{/* Outer ring — clockwise, slower */}
			<OrbitRing
				size={900}
				duration={180}
				direction={1}
				className="border-green-700/60"
			/>
			{/* Inner ring — counter-clockwise, faster */}
			<OrbitRing
				size={680}
				duration={140}
				direction={-1}
				className="border-green-600/60"
			/>
		</>
	);
}
