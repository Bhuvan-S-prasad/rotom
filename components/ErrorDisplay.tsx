"use client"

import { useGlobalError } from "@/lib/context/global-error-context";
import { XIcon, AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ErrorDisplay() {
    const { error, clearError } = useGlobalError();

    // Auto-dismiss after 10 seconds if no action is required
    useEffect(() => {
        if (error && !error.action) {
            const timer = setTimeout(() => {
                clearError();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                >
                    <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-4 flex items-start gap-3">
                        <div className="shrink-0 text-red-500 mt-0.5">
                            <AlertCircleIcon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-red-800">
                                {error.message}
                            </h3>
                            {error.description && (
                                <p className="text-xs text-red-600 mt-1">
                                    {error.description}
                                </p>
                            )}
                            {error.action && (
                                <button
                                    onClick={() => {
                                        error.action?.onClick();
                                        clearError();
                                    }}
                                    className="mt-2 text-xs font-medium bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    {error.action.label}
                                </button>
                            )}
                        </div>
                        <button
                            onClick={clearError}
                            className="shrink-0 text-red-400 hover:text-red-600 transition-colors p-1"
                        >
                            <XIcon size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
