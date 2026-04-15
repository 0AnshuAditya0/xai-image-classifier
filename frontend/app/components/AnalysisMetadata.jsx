'use client';

import { Clock, Cpu, Image as ImageIcon, Calendar } from 'lucide-react';

export default function AnalysisMetadata({ metadata, imageMetadata }) {
    const timestamp = new Date();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-xl transition-all duration-300 hover:bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Analysis Speed</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {metadata?.speed || 'Turbo'}
                </p>
            </div>

            <div className="glass-card p-4 rounded-xl transition-all duration-300 hover:bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">AI Brain</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {metadata?.ai_type || 'Smart AI'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    {metadata?.engine || 'Active'}
                </p>
            </div>

            {imageMetadata && (
                <div className="glass-card p-4 rounded-xl transition-all duration-300 hover:bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Photo Details</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {imageMetadata.dimensions}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        {imageMetadata.sizeFormatted}
                    </p>
                </div>
            )}

            <div className="glass-card p-4 rounded-xl transition-all duration-300 hover:bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Time</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                    Just now
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    {timestamp.toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}
