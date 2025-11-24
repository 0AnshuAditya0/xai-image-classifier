'use client';

import { Image as ImageIcon, Flame, Layers, Grid2X2 } from 'lucide-react';

const VIEW_MODES = [
    { id: 'heatmap', name: 'Heatmap', icon: Flame },
    { id: 'graph', name: 'Confidence', icon: Layers },
    { id: 'comparison', name: 'Comparison', icon: Grid2X2 },
    { id: 'details', name: 'Details', icon: ImageIcon },
];

export default function ViewModeToggle({ currentMode, onChange }) {
    return (
        <div className="flex flex-wrap gap-2">
            {VIEW_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = currentMode === mode.id;

                return (
                    <button
                        key={mode.id}
                        onClick={() => onChange(mode.id)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{mode.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
