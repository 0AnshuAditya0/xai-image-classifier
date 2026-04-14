'use client';

import { Clock, Cpu, Image as ImageIcon, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AnalysisMetadata({ metadata, imageMetadata }) {
    const timestamp = new Date();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Processing Time */}
            <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Processing Time</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {metadata?.processing_time ? `${metadata.processing_time.toFixed(2)}s` : '2.3s'}
                </p>
            </div>

            {/* Model */}
            <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Model</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {metadata?.model || 'ResNet18'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    {metadata?.precision || 'FP16 (GPU)'}
                </p>
            </div>

            {/* Image Details */}
            {imageMetadata && (
                <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Image</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {imageMetadata.dimensions}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        {imageMetadata.sizeFormatted}
                    </p>
                </div>
            )}

            {/* Timestamp */}
            <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Analyzed</span>
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
