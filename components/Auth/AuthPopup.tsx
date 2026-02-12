import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { AuthCard, ConnectGoogleCard } from "@/components/Auth/AuthCards";
import { AUTH_POPUP_MODES } from "@/constants/auth.constant";
import { useAuthPopupStore } from "@/store/useAuthPopupStore";

const transition = {
	type: "spring",
	stiffness: 300,
	damping: 35,
} as const;

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

export function AuthPopup() {
	const { isOpen, setOpen, intent } = useAuthPopupStore(
		useShallow((state) => ({
			isOpen: state.isOpen,
			setOpen: state.setOpen,
			intent: state.intent,
		})),
	);

	const handleClose = useCallback(() => setOpen(false), [setOpen]);

	return (
		<AnimatePresence>
			{isOpen ? (
				<motion.div
					onClick={handleClose}
					className="fixed inset-0 bg-black/60 z-1000"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={transition}
				>
					<div className="fixed inset-x-0 bottom-0 flex justify-center">
						<motion.div
							onClick={stopPropagation}
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							transition={transition}
						>
							{intent === AUTH_POPUP_MODES.SIGN_IN && (
								<AuthCard setOpen={setOpen} />
							)}
							{intent === AUTH_POPUP_MODES.CONNECT_GOOGLE && (
								<ConnectGoogleCard />
							)}
						</motion.div>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
