'use client';

import { useCallback } from 'react';
import { Upload } from 'lucide-react';

export default function ImageUpload({ onImageSelect, preview }) {
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);
        }
    }, [onImageSelect]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleFileInput = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    }, [onImageSelect]);

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative group h-[400px]"
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
            />
            <label
                htmlFor="file-upload"
                className="block cursor-pointer h-full"
            >
                {preview ? (
                    <div className="relative h-full bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden group-hover:shadow-lg transition-all duration-300 flex items-center justify-center border border-gray-200 dark:border-slate-700">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain p-4"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-white text-center">
                                <Upload className="w-10 h-10 mx-auto mb-3 text-blue-500" />
                                <p className="text-lg font-medium">Click to change image</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full bg-gray-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-blue-500/50 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg flex flex-col items-center justify-center transition-all duration-300">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        </div>

                        <p className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
                            Drop your image here
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            or click to browse
                        </p>

                        <span className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 shadow-sm">
                            Browse Files
                        </span>

                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-6">
                            JPG, PNG, WebP supported • No size limit
                        </p>
                    </div>
                )}
            </label>
        </div>
    );
}
