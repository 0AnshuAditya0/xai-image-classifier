'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ImageUpload from '../components/ImageUpload';
import AnalysisProgress from '../components/AnalysisProgress';
import EnhancedResults from '../components/EnhancedResults';
import { classifyImage } from '../lib/api';
import { hasReachedLimit, incrementUsageCount } from '../lib/usageLimit';
import { validateImageFile, getImageMetadata } from '../lib/imageValidation';

export default function ClassifierPage() {
    const { data: session } = useSession();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageMetadata, setImageMetadata] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [enableAttack, setEnableAttack] = useState(false);

    const handleImageSelect = async (file) => {
        setSelectedImage(file);
        setResult(null);
        setError(null);
        setValidationErrors([]);
        setImageMetadata(null);

        const fileErrors = validateImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        try {
            const { metadata, errors: dimensionErrors } = await getImageMetadata(file);
            metadata.preview = URL.createObjectURL(file);
            setImageMetadata(metadata);

            const allErrors = [...fileErrors, ...dimensionErrors];
            setValidationErrors(allErrors);
        } catch (err) {
            setValidationErrors([...fileErrors, 'Failed to load image details']);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage || validationErrors.length > 0) return;

        if (!session && hasReachedLimit()) {
            setShowAuthModal(true);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userEmail = session?.user?.email;
            const data = await classifyImage(selectedImage, userEmail, enableAttack);
            setResult(data);

            if (!session) {
                incrementUsageCount();
            }
        } catch (err) {
            setError(err.message || 'Failed to analyze image');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setImageMetadata(null);
        setValidationErrors([]);
        setResult(null);
        setError(null);
        setEnableAttack(false);
    };

    const handleCancelAnalysis = () => {
        setLoading(false);
        setError('Analysis stopped');
    };

    return (
        <div className="antialiased bg-[#0A0A0A] text-white selection:bg-[#3B82F6] selection:text-white min-h-screen font-body relative transition-all duration-500">
            <nav className="fixed top-0 w-full h-16 border-b border-[#1E293B] z-50 bg-[#0A0A0A] flex justify-between items-center px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-semibold tracking-tighter text-white uppercase flex items-center gap-2 hover:opacity-80 transition-opacity">
                        AI Classifier
                    </Link>
                    <div className="hidden md:flex gap-6">
                        <span className="text-[#3B82F6] font-bold text-sm tracking-wide">Brain: Smart AI</span>
                        <span className="text-[#919191] font-normal text-sm tracking-wide hover:text-white transition-all cursor-default">System: Ready</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-[#919191] hover:text-white transition-all flex items-center">
                        <span className="material-symbols-outlined" data-icon="settings">settings</span>
                    </button>
                    <button className="text-[#919191] hover:text-white transition-all flex items-center">
                        <span className="material-symbols-outlined" data-icon="account_circle">{session ? "account_circle" : "login"}</span>
                    </button>
                </div>
            </nav>


            <div className="fixed top-16 left-0 w-full h-[1px] bg-[#3B82F6] opacity-30 z-40 pointer-events-none shadow-[0_0_10px_#3B82F6]"></div>

            <main className="pt-16 min-h-screen bg-[#0A0A0A] relative z-10">
                <div className="max-w-7xl mx-auto p-8 lg:p-12">
                    <section className="mb-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center px-2 py-1 border border-[#3B82F6] bg-[#3B82F6]/5 mb-4">
                                    <span className="text-[10px] font-bold text-[#3B82F6] tracking-widest uppercase">Smart AI + Focus Maps</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.04em] text-white leading-tight">
                                    Simple Image <br/>Analysis.
                                </h1>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between p-4 bg-[#111111] border border-[#1E293B] min-w-[280px] hover:border-[#3B82F6]/50 transition-colors">
                                    <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">Enable AI Stress Test</span>
                                    <div className="relative inline-block w-10 h-5 align-middle select-none">
                                        <input type="checkbox" className="sr-only" id="toggle" checked={enableAttack} onChange={() => setEnableAttack(!enableAttack)} />
                                        <label htmlFor="toggle" className={`block h-5 cursor-pointer transition-all ${enableAttack ? 'bg-red-600' : 'bg-[#1E293B]'}`}></label>
                                        <div className={`absolute top-1 left-1 bg-white w-3 h-3 transition-all transform ${enableAttack ? 'translate-x-5' : ''}`}></div>
                                    </div>
                                </div>
                                {enableAttack && (
                                    <div className="flex items-center gap-3 p-3 border border-red-900/50 bg-red-950/10 animate-pulse">
                                        <span className="material-symbols-outlined text-red-500 text-sm" data-icon="warning">warning</span>
                                        <span className="text-[10px] text-red-400 font-medium tracking-wide uppercase">Stress test active</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {error && (
                        <div className="mb-8 p-4 border border-red-900/50 bg-red-950/20 flex flex-col items-center justify-center">
                            <p className="text-red-500 text-sm font-bold tracking-widest uppercase mb-4 text-center">{error}</p>
                            <button onClick={handleClear} className="px-6 py-2 bg-red-900/40 border border-red-500/50 text-red-400 text-[10px] tracking-widest uppercase font-bold hover:bg-red-800/50 transition-all">
                                Reset System
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="w-full flex justify-center py-20">
                            <AnalysisProgress onCancel={handleCancelAnalysis} />
                        </div>
                    ) : result ? (
                        <EnhancedResults 
                            result={result}
                            imagePreview={imagePreview}
                            imageMetadata={imageMetadata}
                            onBack={handleClear}
                            onAnalyzeAnother={handleClear}
                        />
                    ) : (
                        <>
                            <ImageUpload
                                onImageSelect={handleImageSelect}
                                preview={imagePreview}
                            />

                            {selectedImage && !validationErrors.length && (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAnalyze}
                                        className={`flex-1 px-6 py-4 border transition-all font-bold text-xs tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] ${enableAttack ? 'bg-red-600 border-red-500 hover:bg-red-700 hover:border-red-400 text-white' : 'bg-[#3B82F6] border-[#2563EB] hover:bg-[#2563EB] hover:border-[#1D4ED8] text-white'}`}
                                    >
                                        {enableAttack ? 'Execute Stress Test' : 'Analyze Photo'}
                                    </button>
                                </div>
                            )}

                            {validationErrors.length > 0 && (
                                <div className="mt-4 p-4 border border-red-500 bg-red-500/10">
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-red-500 text-center">Neural Alert: Invalid Photo</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
