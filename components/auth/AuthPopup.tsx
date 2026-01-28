import { AnimatePresence, motion } from "motion/react";
import AuthCard from "@/components/auth/AuthCard";
import { useAuthPopupStore } from "@/store/useAuthPopupStore";



export function AuthPopup() {
  const isOpen = useAuthPopupStore(state => state.isOpen)
  const setOpen = useAuthPopupStore(state => state.setOpen)
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={() => setOpen(false)}
          className="fixed inset-0 backdrop-brightness-50 backdrop-blur-sm z-1000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          <div className="fixed inset-x-0 bottom-0 flex justify-center">
            <motion.div
              onClick={(e) => {
                e.stopPropagation();
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                bounce: 0,
                damping: 35,
                mass: 1,
                stiffness: 300,
                duration: 0.4,
              }}
            >
              
              <AuthCard />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}