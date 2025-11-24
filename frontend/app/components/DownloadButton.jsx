'use client';

import { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DownloadButton({ result, imagePreview }) {
    const [showMenu, setShowMenu] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const downloadJSON = () => {
        const data = {
            analysis_id: result.analysis_id || `A${Date.now()}`,
            timestamp: new Date().toISOString(),
            predictions: result.prediction.top_predictions,
            metadata: result.metadata,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `xai-analysis-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setShowMenu(false);
    };

    const downloadPNG = async () => {
        setDownloading(true);
        try {
            // Create a canvas with results
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1200;
            canvas.height = 800;

            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Title
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 32px Inter, sans-serif';
            ctx.fillText('XAI Image Classification Results', 40, 60);

            // Prediction
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.fillText(`Top Prediction: ${result.prediction.class}`, 40, 120);

            ctx.font = '20px Inter, sans-serif';
            ctx.fillText(`Confidence: ${result.prediction.confidence.toFixed(2)}%`, 40, 160);

            // Top 5 Predictions
            ctx.font = 'bold 18px Inter, sans-serif';
            ctx.fillText('Top 5 Predictions:', 40, 220);

            ctx.font = '16px Inter, sans-serif';
            result.prediction.top_predictions.slice(0, 5).forEach((pred, idx) => {
                ctx.fillText(
                    `${idx + 1}. ${pred.class} - ${pred.confidence.toFixed(2)}%`,
                    40,
                    260 + (idx * 30)
                );
            });

            // Download
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `xai-results-${Date.now()}.png`;
            a.click();
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setDownloading(false);
            setShowMenu(false);
        }
    };

    const downloadPDF = async () => {
        setDownloading(true);
        try {
            const pdf = new jsPDF();

            // Title
            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            pdf.text('XAI Image Classification Report', 20, 20);

            // Timestamp
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

            // Main Prediction
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Top Prediction', 20, 50);

            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Category: ${result.prediction.class}`, 20, 60);
            pdf.text(`Confidence: ${result.prediction.confidence.toFixed(2)}%`, 20, 70);

            // Top 5 Predictions
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Top 5 Predictions', 20, 90);

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            result.prediction.top_predictions.slice(0, 5).forEach((pred, idx) => {
                pdf.text(
                    `${idx + 1}. ${pred.class} - ${pred.confidence.toFixed(2)}%`,
                    20,
                    105 + (idx * 10)
                );
            });

            // Metadata
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Analysis Metadata', 20, 160);

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Model: ${result.metadata.model}`, 20, 170);
            pdf.text(`Precision: ${result.metadata.precision}`, 20, 180);
            pdf.text(`Device: ${result.metadata.device}`, 20, 190);

            pdf.save(`xai-report-${Date.now()}.pdf`);
        } catch (error) {
            console.error('PDF generation failed:', error);
        } finally {
            setDownloading(false);
            setShowMenu(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={downloading}
                className="px-6 py-3 bg-gradient-purple-pink hover:shadow-glow text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
                <Download className="w-5 h-5" />
                <span>{downloading ? 'Downloading...' : 'Download'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-glass-lg overflow-hidden z-10">
                    <button
                        onClick={downloadPNG}
                        className="w-full px-4 py-3 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Download as PNG
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="w-full px-4 py-3 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Download as PDF
                    </button>
                    <button
                        onClick={downloadJSON}
                        className="w-full px-4 py-3 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Download as JSON
                    </button>
                </div>
            )}
        </div>
    );
}
