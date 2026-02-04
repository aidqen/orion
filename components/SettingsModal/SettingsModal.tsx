'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { SettingsModalProps } from './types';
import { SettingsModalHeader } from './SettingsModalHeader';
import { SettingsModalFooter } from './SettingsModalFooter';
import { UserDetailsSection } from './UserDetailsSection';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { AUTH_POPUP_MODES } from '@/constants/auth.constant';
import { useAuthPopupStore } from '@/store/useAuthPopupStore';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const router = useRouter()
    const openAuthPopup = useAuthPopupStore(state => state.open)
    const { signOut, authenticated } = useUser();
    
    async function handleLogout() {
        try {
            await signOut();
            router.push('/');
            onClose();      
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    async function handleLogin() {
        openAuthPopup(AUTH_POPUP_MODES.SIGN_IN)
    }

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div key="settings-modal" className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 bg-black/40"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            duration: 0.25,
                            bounce: 0
                        }}
                        className="relative p-6 space-y-6 w-full max-w-[500px] mx-4 overflow-hidden rounded-[16px] border-2 border-[#E5E7EB] shadow-[0_16px_40px_rgba(0,0,0,0.16)] bg-[#F7F7F8] text-[#111827] dark:bg-[#0E1116] dark:text-[#E5E7EB] dark:border-[rgba(255,255,255,0.1)]"
                    >
                        <SettingsModalHeader />
                        <UserDetailsSection />
                        <SettingsModalFooter
                            onClose={onClose}
                            onLogout={handleLogout}
                            isAuthenticated={authenticated}
                            onLogin={handleLogin}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
