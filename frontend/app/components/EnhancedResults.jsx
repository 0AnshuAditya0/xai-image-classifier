'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ViewModeToggle from './ViewModeToggle';
import AnalysisMetadata from './AnalysisMetadata';
import DownloadButton from './DownloadButton';
import PredictionResults from './PredictionResults';
import FeedbackSection from './FeedbackSection';
import { ArrowLeft, Share2, RotateCcw } from 'lucide-react';

import { submitFeedback } from '../lib/api';

export default function EnhancedResults({ result, imagePreview, imageMetadata, onBack, onAnalyzeAnother }) {
    const [viewMode, setViewMode] = useState('heatmap');

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'XAI Classification Result',
                text: `Top prediction: ${result.prediction.class} (${result.prediction.confidence.toFixed(1)}% confidence)`,
            });
        } else {
            const text = `XAI Classification: ${result.prediction.class} - ${result.prediction.confidence.toFixed(1)}% confidence`;
            navigator.clipboard.writeText(text);
            alert('Link copied to clipboard!');
        }
    };

    const handleFeedback = async (feedback) => {
        if (result.analysis_id) {
            await submitFeedback(result.analysis_id, feedback.isCorrect, feedback.correctedLabel);
        }
    };

    // Prepare data for confidence chart
    const chartData = result.prediction.top_predictions.slice(0, 5).map((pred, idx) => ({
        name: pred.class.length > 15 ? pred.class.substring(0, 15) + '...' : pred.class,
        fullName: pred.class,
        confidence: parseFloat(pred.confidence.toFixed(2)),
        rank: idx + 1,
    }));

    const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8'];

    const renderMainContent = () => {
        switch (viewMode) {
            case 'graph':
                return (
                    <div className="h-[400px] w-full flex items-center justify-center p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                                <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
                                <YAxis dataKey="name" type="category" width={150} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                    }}
                                    labelStyle={{ color: '#fff' }}
                                    formatter={(value, name, props) => [
                                        `${value}%`,
                                        props.payload.fullName
                                    ]}
                                />
                                <Bar dataKey="confidence" radius={[0, 4, 4, 0]} barSize={32}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );

            case 'comparison':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Original</h3>
                            <div className="bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-square relative">
                                <img src={imagePreview} alt="Original" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Heatmap</h3>
                            <div className="bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-square relative">
                                {result.visualizations?.main ? (
                                    <img
                                        src={`data:image/png;base64,${result.visualizations.main}`}
                                        alt="Grad-CAM"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        Heatmap visualization not available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'details':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-square relative">
                            <img src={imagePreview} alt="Original" className="w-full h-full object-contain" />
                        </div>
                        <div className="space-y-4">
                            <AnalysisMetadata metadata={result.metadata} imageMetadata={imageMetadata} />
                        </div>
                    </div>
                );

            case 'heatmap':
            default:
                return (
                    <div className="bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-video relative flex items-center justify-center">
                        {result.visualizations?.main ? (
                            <img
                                src={`data:image/png;base64,${result.visualizations.main}`}
                                alt="Grad-CAM"
                                className="max-w-full max-h-[500px] object-contain"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                Heatmap visualization not available
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                    onClick={onBack}
                    className="px-4 py-2 glass-card hover:shadow-glass text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Upload</span>
                </button>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleShare}
                        className="px-4 py-2 glass-card hover:shadow-glass text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                    </button>

                    <DownloadButton result={result} imagePreview={imagePreview} />

                    <button
                        onClick={onAnalyzeAnother}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>Analyze Another</span>
                    </button>
                </div>
            </div>

            {/* View Mode Toggle */}
            <ViewModeToggle currentMode={viewMode} onChange={setViewMode} />

            {/* Main Display Section */}
            <div className="glass-card p-6 rounded-2xl min-h-[400px]">
                {renderMainContent()}
            </div>

            {/* Predictions & Feedback */}
            <div className="grid grid-cols-1 gap-6">
                <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Predictions</h2>
                    <PredictionResults result={result} />
                </div>

                <FeedbackSection
                    prediction={result.prediction}
                    onFeedback={handleFeedback}
                />
            </div>
        </div>
    );
}
