'use client';

import { useCallback } from 'react';

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
        <section className="mb-12">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
            />
            <label
                className="w-full border-2 border-dashed border-[#1E293B] bg-[#111111] h-32 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-none group relative block"
                htmlFor="file-upload"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {preview ? (
                    <div className="absolute inset-0 w-full h-full bg-[#0A0A0A] p-2 flex items-center justify-center">
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="max-h-full max-w-full object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-none">
                            <span className="text-[10px] font-bold text-white tracking-widest uppercase">Click to Swap Source</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-[#919191] mb-2 group-hover:text-white transition-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                            cloud_upload
                        </span>
                        <p className="text-[11px] font-medium text-slate-400 tracking-[0.15em] uppercase group-hover:text-white transition-none">
                            Drag and drop source imagery for neural analysis
                        </p>
                    </>
                )}
            </label>
        </section>
    );
}
