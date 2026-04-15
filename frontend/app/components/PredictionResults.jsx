'use client';

import { Award, TrendingUp } from 'lucide-react';

export default function PredictionResults({ result }) {
    const { prediction, metadata } = result;
    const confidenceBadge = prediction.confidence > 80 ? 'high' : prediction.confidence > 50 ? 'medium' : 'low';
    const badgeColors = {
        high: 'bg-green-500/20 border-green-500/50 text-green-400',
        medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
        low: 'bg-red-500/20 border-red-500/50 text-red-400'
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Best Guess</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
                            {prediction.class}
                        </h3>
                    </div>
                    <span className={`px-4 py-2 text-[10px] font-black border rounded-sm tracking-widest ${badgeColors[confidenceBadge]}`}>
                        {confidenceBadge === 'high' ? 'CERTIFIED' : confidenceBadge === 'medium' ? 'PROBABLE' : 'UNSURE'}
                    </span>
                </div>

                <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-black text-white transition-all duration-1000">
                            {prediction.confidence.toFixed(1)}%
                        </span>
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Confidence Score</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ease-out ${confidenceBadge === 'high' ? 'bg-green-500' : confidenceBadge === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${prediction.confidence}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400">
                        {metadata.ai_type || 'Smart AI'}
                    </div>
                    <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400">
                        {metadata.engine || 'Active'}
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Other Choices</h4>
                </div>
                <div className="space-y-3">
                    {prediction.top_predictions.slice(1, 6).map((pred, idx) => {
                        return (
                            <div
                                key={idx}
                                className="group p-4 border border-white/5 bg-white/5 hover:border-white/20 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-white font-bold uppercase tracking-widest text-[11px]">
                                        {pred.class}
                                    </p>
                                    <span className="text-[11px] font-black text-slate-400">
                                        {pred.confidence.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full h-[2px] bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500/50 transition-all duration-1000 ease-out"
                                        style={{ width: `${pred.confidence}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
