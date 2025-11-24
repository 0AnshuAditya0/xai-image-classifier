'use client';

import { Award, TrendingUp } from 'lucide-react';

export default function PredictionResults({ result }) {
    const { prediction, metadata } = result;
    const confidenceBadge = prediction.confidence > 80 ? 'high' : prediction.confidence > 50 ? 'medium' : 'low';
    const badgeColors = {
        high: 'bg-green-500/20 border-green-500/50 text-green-600 dark:text-green-400',
        medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-600 dark:text-yellow-400',
        low: 'bg-red-500/20 border-red-500/50 text-red-600 dark:text-red-400'
    };

    return (
        <div className="space-y-6">
            {/* Main Prediction */}
            <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-5 h-5 text-gradient-purple" />
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Top Prediction</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {prediction.class}
                        </h3>
                    </div>
                    <span className={`px-4 py-2 text-sm font-bold border-2 rounded-xl ${badgeColors[confidenceBadge]}`}>
                        {confidenceBadge === 'high' ? '🎯' : confidenceBadge === 'medium' ? '⚡' : '⚠️'}
                        {' '}{confidenceBadge.toUpperCase()}
                    </span>
                </div>

                <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
                            {prediction.confidence.toFixed(1)}%
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">confidence</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-purple-pink rounded-full transition-all duration-1000"
                            style={{ width: `${prediction.confidence}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-600 dark:text-blue-400 font-medium">
                        {metadata.model}
                    </div>
                    <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-600 dark:text-purple-400 font-medium">
                        {metadata.precision}
                    </div>
                    <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 dark:text-green-400 font-medium">
                        82.3% Accuracy
                    </div>
                </div>
            </div>

            {/* Top 5 Predictions */}
            <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-gradient-blue" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Top 5 Predictions</h4>
                </div>
                <div className="space-y-3">
                    {prediction.top_predictions.slice(0, 5).map((pred, idx) => {
                        const icons = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                        const gradients = [
                            'from-yellow-400 to-orange-500',
                            'from-gray-300 to-gray-500',
                            'from-orange-400 to-orange-600',
                            'from-blue-400 to-blue-600',
                            'from-purple-400 to-purple-600'
                        ];

                        return (
                            <div
                                key={idx}
                                className="group glass-card p-4 rounded-xl hover:shadow-glass transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl flex-shrink-0">{icons[idx]}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 dark:text-white font-semibold truncate mb-1">
                                            {pred.class}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${gradients[idx]} rounded-full transition-all duration-1000`}
                                                    style={{ width: `${pred.confidence}%` }}
                                                />
                                            </div>
                                            <span className={`text-sm font-bold bg-gradient-to-r ${gradients[idx]} bg-clip-text text-transparent min-w-[60px] text-right`}>
                                                {pred.confidence.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
