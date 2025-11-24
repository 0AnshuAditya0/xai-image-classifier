'use client';

import { FileImage, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function ImagePreview({ file, metadata, errors, onRemove }) {
    const hasErrors = errors && errors.length > 0;

    return (
        <div className={`glass-card rounded-2xl overflow-hidden ${hasErrors ? 'border-2 border-red-500' : 'border border-gray-200 dark:border-gray-700'}`}>
            {/* Image Preview */}
            <div className="relative bg-black/5 dark:bg-black/20 aspect-video flex items-center justify-center">
                {metadata?.preview ? (
                    <img
                        src={metadata.preview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <FileImage className="w-16 h-16 text-gray-400" />
                )}

                {/* Remove Button */}
                <button
                    onClick={onRemove}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                    {hasErrors ? (
                        <div className="px-3 py-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Invalid
                        </div>
                    ) : (
                        <div className="px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Valid
                        </div>
                    )}
                </div>
            </div>

            {/* Metadata */}
            <div className="p-4 space-y-3">
                {/* Filename */}
                <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={metadata?.filename}>
                        {metadata?.filename || file?.name}
                    </p>
                </div>

                {/* Metadata Grid */}
                {metadata && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="glass-card p-2 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">Size</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{metadata.sizeFormatted}</p>
                        </div>
                        <div className="glass-card p-2 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">Format</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{metadata.format}</p>
                        </div>
                        <div className="glass-card p-2 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">Dimensions</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{metadata.dimensions}</p>
                        </div>
                        <div className="glass-card p-2 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">Aspect Ratio</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{metadata.aspectRatio}</p>
                        </div>
                    </div>
                )}

                {/* Errors */}
                {hasErrors && (
                    <div className="space-y-1">
                        {errors.map((error, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
