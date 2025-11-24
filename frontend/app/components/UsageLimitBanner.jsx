'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { getUsageCount, USAGE_LIMIT } from '../lib/usageLimit';

export default function UsageLimitBanner({ session, onSignInClick }) {
    const [mounted, setMounted] = useState(false);
    const [usageCount, setUsageCount] = useState(0);

    useEffect(() => {
        setMounted(true);
        if (!session) {
            setUsageCount(getUsageCount());
        }
    }, [session]);

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    if (session) {
        return (
            <div className="bg-blue-50 dark:bg-slate-800/50 border-l-4 border-blue-500 p-4 mb-8">
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Unlimited Access
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            You're signed in as <span className="text-blue-600 dark:text-blue-400">{session.user?.email}</span>. Enjoy unlimited image analysis!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const remainingAttempts = USAGE_LIMIT - usageCount;
    const isLimitReached = remainingAttempts <= 0;

    if (isLimitReached) {
        return (
            <div className="bg-red-50 dark:bg-slate-800/50 border-l-4 border-red-500 p-4 mb-8">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Free Limit Reached
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                            You've used all {USAGE_LIMIT} free analyses. Sign in to continue with unlimited access!
                        </p>
                        <button
                            onClick={onSignInClick}
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                        >
                            Sign In Now →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 dark:bg-slate-800/50 border-l-4 border-blue-500 p-4 mb-8">
            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Free Trial: {remainingAttempts} {remainingAttempts === 1 ? 'Analysis' : 'Analyses'} Remaining
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Sign in for unlimited access to all features.
                    </p>
                </div>
            </div>
        </div>
    );
}
