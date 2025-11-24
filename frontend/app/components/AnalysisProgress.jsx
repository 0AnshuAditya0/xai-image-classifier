'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Upload, Brain, Eye } from 'lucide-react';

const STAGES = [
    { id: 1, name: 'Uploading image...', icon: Upload, range: [0, 20] },
    { id: 2, name: 'Preprocessing...', icon: Sparkles, range: [20, 40] },
    { id: 3, name: 'Running AI model...', icon: Brain, range: [40, 80] },
    { id: 4, name: 'Generating heatmap...', icon: Eye, range: [80, 100] },
];

export default function AnalysisProgress({ onCancel }) {
    const [currentStage, setCurrentStage] = useState(0);
    const [progress, setProgress] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = Math.min(prev + 2, 100);

                // Update current stage based on progress
                const stage = STAGES.findIndex(s => newProgress >= s.range[0] && newProgress <= s.range[1]);
                if (stage !== -1) {
                    setCurrentStage(stage);
                }

                // Update estimated time
                const remaining = Math.max(0, Math.ceil((100 - newProgress) / 20));
                setEstimatedTime(remaining);

                return newProgress;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const CurrentIcon = STAGES[currentStage]?.icon || Loader2;

    return (
        <div className="glass-card p-8 rounded-2xl">
            <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-purple-pink/10 dark:bg-gradient-purple-pink/20 rounded-2xl flex items-center justify-center">
                    <CurrentIcon className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {STAGES[currentStage]?.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {estimatedTime > 0 ? `~${estimatedTime} seconds remaining` : 'Almost done...'}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-bold text-primary">{progress}%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Stages */}
            <div className="space-y-2 mb-6">
                {STAGES.map((stage, idx) => {
                    const isComplete = idx < currentStage;
                    const isCurrent = idx === currentStage;
                    const Icon = stage.icon;

                    return (
                        <div
                            key={stage.id}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${isCurrent
                                ? 'glass-card border-l-4 border-primary'
                                : isComplete
                                    ? 'bg-green-500/10 dark:bg-green-500/20'
                                    : 'opacity-50'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isCurrent ? 'text-primary animate-pulse' : isComplete ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                            <span className={`text-sm font-medium ${isCurrent ? 'text-gray-900 dark:text-white' : isComplete ? 'text-green-700 dark:text-green-300' : 'text-gray-500'}`}>
                                {stage.name}
                            </span>
                            {isComplete && (
                                <span className="ml-auto text-green-600 dark:text-green-400 text-xs">✓</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Cancel Button */}
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="w-full px-6 py-3 glass-card hover:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold rounded-xl transition-all duration-300"
                >
                    Cancel Analysis
                </button>
            )}
        </div>
    );
}
