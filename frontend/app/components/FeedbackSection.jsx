'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function FeedbackSection({ prediction, onFeedback }) {
    const { data: session } = useSession();
    const [feedbackGiven, setFeedbackGiven] = useState(null); // 'correct' | 'incorrect'
    const [showCorrection, setShowCorrection] = useState(false);

    if (!session) return null;

    const handleCorrect = () => {
        setFeedbackGiven('correct');
        onFeedback({ isCorrect: true });
    };

    const handleIncorrect = () => {
        setFeedbackGiven('incorrect');
        setShowCorrection(true);
        // Logic to show correction dropdown would go here
        onFeedback({ isCorrect: false });
    };

    return (
        <div className="glass-card p-6 rounded-2xl mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Was this analysis correct?
            </h3>

            {!feedbackGiven ? (
                <div className="flex gap-4">
                    <button
                        onClick={handleCorrect}
                        className="flex-1 py-3 px-4 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        <ThumbsUp className="w-5 h-5" />
                        Yes, it's correct
                    </button>
                    <button
                        onClick={handleIncorrect}
                        className="flex-1 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        <ThumbsDown className="w-5 h-5" />
                        No, it's wrong
                    </button>
                </div>
            ) : (
                <div className="text-center py-2">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${feedbackGiven === 'correct'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}>
                        {feedbackGiven === 'correct' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span className="font-medium">
                            {feedbackGiven === 'correct' ? 'Thanks for your feedback!' : 'Thanks! We will use this to improve.'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
