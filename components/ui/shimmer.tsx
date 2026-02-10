"use client";

import { motion } from "motion/react";
import { type CSSProperties, memo, useMemo } from "react";
import { cn } from "@/utils/shared";

// Pre-create motion components outside of render
const motionComponents = {
	p: motion.p,
	span: motion.span,
	h1: motion.h1,
	h2: motion.h2,
	h3: motion.h3,
	h4: motion.h4,
	div: motion.div,
} as const;

type SupportedElements = keyof typeof motionComponents;

export interface TextShimmerProps {
	children: string;
	as?: SupportedElements;
	className?: string;
	duration?: number;
	spread?: number;
}

const ShimmerComponent = ({
	children,
	as: Component = "p",
	className,
	duration = 2,
	spread = 2,
}: TextShimmerProps) => {
	const MotionComponent = motionComponents[Component];

	const dynamicSpread = useMemo(
		() => (children?.length ?? 0) * spread,
		[children, spread],
	);

	return (
		<MotionComponent
			animate={{ backgroundPosition: "0% center" }}
			className={cn(
				"relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
				"[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
				className,
			)}
			initial={{ backgroundPosition: "100% center" }}
			style={
				{
					"--spread": `${dynamicSpread}px`,
					backgroundImage:
						"var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
				} as CSSProperties
			}
			transition={{
				repeat: Number.POSITIVE_INFINITY,
				duration,
				ease: "linear",
			}}
		>
			{children}
		</MotionComponent>
	);
};

export const Shimmer = memo(ShimmerComponent);
