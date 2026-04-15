'use client';

import { Eye } from 'lucide-react';

export default function GradCAMVisualization({ visualizations }) {
    return (
        <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl transition-all duration-500 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Focus Analysis</h2>
                </div>
                <div className="bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img
                        src={`data:image/png;base64,${visualizations.main}`}
                        alt="AI Focus Map"
                        className="w-full h-auto transition-opacity duration-1000"
                    />
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl transition-all duration-500 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detailed Focus View</h2>
                </div>
                <div className="bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img
                        src={`data:image/png;base64,${visualizations.detailed}`}
                        alt="Detailed Focus View"
                        className="w-full h-auto transition-opacity duration-1000"
                    />
                </div>
            </div>
        </div>
    );
}
