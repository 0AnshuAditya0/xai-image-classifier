'use client';

import { useState, useEffect } from 'react';

const STAGES = [
    { id: 1, name: 'Allocating Memory...', range: [0, 20] },
    { id: 2, name: 'Normalizing Tensor...', range: [20, 40] },
    { id: 3, name: 'Executing Forward Pass...', range: [40, 80] },
    { id: 4, name: 'Synthesizing Grad-CAM...', range: [80, 100] },
];

export default function AnalysisProgress({ onCancel }) {
    const [currentStage, setCurrentStage] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = Math.min(prev + 2, 100);
                const stage = STAGES.findIndex(s => newProgress >= s.range[0] && newProgress <= s.range[1]);
                if (stage !== -1) {
                    setCurrentStage(stage);
                }
                return newProgress;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="border border-[#1E293B] bg-[#111111] p-8 max-w-lg w-full mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#3B82F6] animate-pulse shadow-[0_0_10px_#3B82F6]"></div>
            
            <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">System Execution</span>
                <span className="text-[10px] font-bold text-[#3B82F6] tracking-widest">{progress}%</span>
            </div>

            <div className="w-full h-1 bg-[#0A0A0A] mb-8 border border-[#1E293B]">
                <div 
                    className="h-full bg-[#3B82F6] transition-none"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="space-y-4 mb-8">
                {STAGES.map((stage, idx) => {
                    const isComplete = idx < currentStage;
                    const isCurrent = idx === currentStage;
                    return (
                        <div key={stage.id} className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-[14px]" style={{ color: isCurrent ? '#3B82F6' : isComplete ? '#919191' : '#1E293B' }}>
                                {isComplete ? 'check_circle' : isCurrent ? 'radio_button_checked' : 'radio_button_unchecked'}
                            </span>
                            <span className={`text-[11px] font-medium tracking-widest uppercase ${isCurrent ? 'text-white' : isComplete ? 'text-slate-500' : 'text-[#1E293B]'}`}>
                                {stage.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {onCancel && (
                <button
                    onClick={onCancel}
                    className="w-full border border-red-900/50 bg-red-950/20 hover:bg-red-900/40 text-red-500 px-6 py-3 text-[10px] tracking-widest uppercase font-bold transition-none"
                >
                    Terminate Thread
                </button>
            )}
        </div>
    );
}
