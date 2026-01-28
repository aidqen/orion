'use client'

import React from 'react';
import { Check, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts';
import GoogleButton from '@/components/GoogleButton';

interface AddEventButtonProps {
    onClick: () => void;
    isPending: boolean;
    isSuccess: boolean;
    error?: Error | null;
}

export const AddEventButton: React.FC<AddEventButtonProps> = ({
    onClick,
    isPending,
    isSuccess,
    error,
}) => {
    const { isGoogleConnected } = useUser();
    const isDisabled = isPending || isSuccess;

    const buttonContent = () => {
        if (isPending) {
            return (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                </>
            );
        }

        if (isSuccess) {
            return (
                <>
                    <Check className="h-4 w-4" />
                    Added!
                </>
            );
        }

        return (
            <>
                <Plus className="h-4 w-4" />
                Add To Calendar
            </>
        );
    };

    if (!isGoogleConnected) {
        return (
            <div className="flex flex-col items-start gap-2 py-2">
                <GoogleButton text="Connect Google Calendar" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-2 py-2">
            <Button
                onClick={onClick}
                disabled={isDisabled}
                size="lg"
                className={`w-fit gap-2 font-medium transition-colors disabled:opacity-80 ${
                    isSuccess
                        ? 'bg-green-700 hover:bg-green-700 text-white cursor-default'
                        : 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600'
                }`}
            >
                {buttonContent()}
            </Button>

            {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                    {error.message}
                </p>
            )}
        </div>
    );
};

