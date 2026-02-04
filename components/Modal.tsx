"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIsMounted } from "@/hooks/useIsMounted";
import { cn } from "@/lib/utils";

interface ModalProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: ReactNode;
	className?: string;
	isAnimate?: boolean;
}

export function Modal({
	open,
	onOpenChange,
	children,
	className,
	isAnimate = false,
}: ModalProps) {
	const isMounted = useIsMounted();
	if (!isMounted) return null;
	return createPortal(
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<MotionConfig
						transition={
							isAnimate
								? {
										ease: [0.32, 0.72, 0, 1],
										duration: 0.3,
									}
								: undefined
						}
					>
						<motion.div
							className="fixed inset-0 backdrop-brightness-75 dark:backdrop-brightness-50"
							onClick={() => onOpenChange?.(false)}
							initial={isAnimate ? { opacity: 0 } : undefined}
							animate={isAnimate ? { opacity: 1 } : undefined}
							exit={isAnimate ? { opacity: 0 } : undefined}
						/>
						<motion.div
							initial={isAnimate ? { opacity: 0, scale: 1.1 } : undefined}
							animate={isAnimate ? { opacity: 1, scale: 1 } : undefined}
							exit={isAnimate ? { opacity: 0, scale: 1.1 } : undefined}
							className={cn(
								"relative z-50 w-full max-w-[750px] border border-border bg-popover shadow-[0px_15px_40px_rgba(0,0,0,0.3)] sm:rounded-[12px] overflow-hidden",
								className,
							)}
						>
							{children}
						</motion.div>
					</MotionConfig>
				</div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
