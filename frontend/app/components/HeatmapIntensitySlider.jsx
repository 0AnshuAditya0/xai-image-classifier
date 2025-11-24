'use client';

import { useState } from 'react';
import { Sliders } from 'lucide-react';

export default function HeatmapIntensitySlider({ intensity, onChange }) {
    const [showValue, setShowValue] = useState(false);

    return (
        <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
                <Sliders className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Heatmap Intensity
                </span>
                <span className="ml-auto text-sm font-bold text-primary">
                    {intensity}%
                </span>
            </div>

            <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => onChange(parseInt(e.target.value))}
                onMouseEnter={() => setShowValue(true)}
                onMouseLeave={() => setShowValue(false)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:h-5
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-gradient-purple-pink
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-glow
                   [&::-webkit-slider-thumb]:transition-all
                   [&::-webkit-slider-thumb]:hover:scale-110
                   [&::-moz-range-thumb]:w-5
                   [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-gradient-purple-pink
                   [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:cursor-pointer"
            />

            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>Subtle</span>
                <span>Intense</span>
            </div>
        </div>
    );
}
