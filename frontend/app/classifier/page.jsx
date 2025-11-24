'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChevronRight, Sparkles, Trash2, Zap, Grid, Eye, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import UsageLimitBanner from '../components/UsageLimitBanner';
import ImageUpload from '../components/ImageUpload';
import ImagePreview from '../components/ImagePreview';
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
            setValidationErrors([...fileErrors, 'Failed to load image metadata']);
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
            const data = await classifyImage(selectedImage, userEmail);
            setResult(data);

            if (!session) {
                incrementUsageCount();
            }
        } catch (err) {
            setError(err.message || 'Failed to classify image');
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
    };

    const handleCancelAnalysis = () => {
        setLoading(false);
        setError('Analysis cancelled');
    };

    // Show results view
    if (result && !loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white transition-colors duration-300">
                <Navbar onAuthClick={() => setShowAuthModal(true)} />
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

                <div className="pt-28 pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <EnhancedResults
                            result={result}
                            imagePreview={imagePreview}
                            imageMetadata={imageMetadata}
                            onBack={handleClear}
                            onAnalyzeAnother={handleClear}
                        />
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white font-sans transition-colors duration-300">
            <Navbar onAuthClick={() => setShowAuthModal(true)} />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            <div className="pt-32 pb-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 dark:text-white font-medium">Classifier</span>
                    </div>

                    <UsageLimitBanner
                        session={session}
                        onSignInClick={() => setShowAuthModal(true)}
                    />

                    {loading ? (
                        <AnalysisProgress onCancel={handleCancelAnalysis} />
                    ) : (
                        <div className="mb-12">
                            {selectedImage && imageMetadata ? (
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-none">
                                    <ImagePreview
                                        file={selectedImage}
                                        metadata={imageMetadata}
                                        errors={validationErrors}
                                        onRemove={handleClear}
                                    />

                                    <div className="mt-6 flex gap-4">
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={validationErrors.length > 0}
                                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                                        >
                                            <Sparkles className="w-5 h-5" />
                                            <span>Analyze Image</span>
                                        </button>

                                        <button
                                            onClick={handleClear}
                                            className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-white font-semibold rounded-md transition-all flex items-center gap-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {validationErrors.length > 0 && (
                                        <p className="text-xs text-red-500 dark:text-red-400 text-center mt-3">
                                            Please fix validation errors before analyzing
                                        </p>
                                    )}
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <div className="bg-red-50 dark:bg-slate-800 border-l-4 border-red-500 p-6 rounded-lg max-w-md mx-auto shadow-sm dark:shadow-none">
                                        <p className="text-red-600 dark:text-red-400 font-medium mb-4">⚠️ {error}</p>
                                        <button
                                            onClick={handleClear}
                                            className="px-6 py-2.5 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold rounded-lg transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ImageUpload
                                        onImageSelect={handleImageSelect}
                                        preview={imagePreview}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                                        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700/50 hover:shadow-md dark:hover:shadow-none transition-shadow">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Fast Analysis</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">GPU-accelerated</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700/50 hover:shadow-md dark:hover:shadow-none transition-shadow">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                                <Grid className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">1000 Categories</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">ImageNet classes</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700/50 hover:shadow-md dark:hover:shadow-none transition-shadow">
                                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                                                <Eye className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Explainable AI</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Grad-CAM heatmaps</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700/50 hover:shadow-md dark:hover:shadow-none transition-shadow">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                                <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Top 5 Results</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">With confidence</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
