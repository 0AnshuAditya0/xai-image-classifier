'use client';

import { Eye } from 'lucide-react';

export default function GradCAMVisualization({ visualizations }) {
    return (
        <div className="space-y-6">
            {/* Main Visualization */}
            <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-gradient-purple" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Visual Explainability Analysis</h2>
                </div>
                <div className="bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img
                        src={`data:image/png;base64,${visualizations.main}`}
                        alt="Grad-CAM Main Visualization"
                        className="w-full h-auto"
                    />
                </div>
            </div>

            {/* Detailed Heatmap */}
            <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-gradient-pink" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detailed Heatmap Comparison</h2>
                </div>
                <div className="bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img
                        src={`data:image/png;base64,${visualizations.detailed}`}
                        alt="Detailed Heatmap Comparison"
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </div>
    );
}
