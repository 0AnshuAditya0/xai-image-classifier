'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Upload, Eye, ArrowRight, Layers, Shield, BarChart3, Grid } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

export default function Home() {
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white font-sans selection:bg-blue-500/30 transition-colors duration-300">
            <Navbar onAuthClick={() => setShowAuthModal(true)} />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Left Content */}
                        <div className="w-full lg:w-1/2 text-left">
                            {/* Tagline */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-full mb-8">
                                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Powered by ResNet52 + Grad-CAM</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight leading-tight text-gray-900 dark:text-white">
                                AI-Powered Image<br />
                                Classification
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed font-normal">
                                Upload any image and get instant predictions with explainable AI visualizations.
                                See exactly what the AI is looking at with Grad-CAM heatmaps.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <Link
                                    href="/classifier"
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-md transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                >
                                    Try It Now
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white font-medium transition-colors px-6 py-4"
                                >
                                    <Eye className="w-5 h-5" />
                                    <span>View Demo</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Image - Brighter in light mode */}
                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                            <div className="relative w-full max-w-2xl">
                                <div className="relative">
                                    <img
                                        src="/mundophone.jpeg"
                                        alt="AI Visualization"
                                        className="w-full h-auto object-cover opacity-100 dark:opacity-90 mix-blend-normal dark:mix-blend-lighten transition-all duration-300 brightness-110 dark:brightness-100"
                                    />
                                    {/* Minimal gradient for edge blending only */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40 dark:from-[#0f172a] dark:via-transparent dark:to-[#0f172a] pointer-events-none"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent dark:from-[#0f172a] dark:via-transparent dark:to-transparent pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 px-4 bg-gray-50 dark:bg-[#0f172a]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-10 border-l-4 border-blue-500 flex flex-col items-center justify-center text-center h-48 shadow-sm dark:shadow-none transition-colors duration-300">
                            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">82.3%</div>
                            <div className="text-gray-500 dark:text-gray-400 font-medium">Top-1 Accuracy</div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-10 border-l-4 border-blue-500 flex flex-col items-center justify-center text-center h-48 shadow-sm dark:shadow-none transition-colors duration-300">
                            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">1000</div>
                            <div className="text-gray-500 dark:text-gray-400 font-medium">Object Categories</div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-10 border-l-4 border-blue-500 flex flex-col items-center justify-center text-center h-48 shadow-sm dark:shadow-none transition-colors duration-300">
                            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">60M</div>
                            <div className="text-gray-500 dark:text-gray-400 font-medium">Model Parameters</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 bg-white dark:bg-[#0f172a] transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Core Features
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Professional tools for transparent AI classification
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-white/5 p-8 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg dark:hover:shadow-none">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                Fast Analysis
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                GPU-accelerated processing for instant results
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-white/5 p-8 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg dark:hover:shadow-none">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                                <Grid className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                1000 Categories
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                ImageNet classes for comprehensive classification
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-white/5 p-8 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg dark:hover:shadow-none">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-lg flex items-center justify-center mb-6">
                                <Eye className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                Explainable AI
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Grad-CAM heatmaps show what the AI sees
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-white/5 p-8 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg dark:hover:shadow-none">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                Top 5 Results
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Confidence scores for accurate predictions
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-4 bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            How it works
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Three simple steps to understand your images
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div>
                            <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded flex items-center justify-center mb-6 text-2xl font-bold text-white shadow-lg shadow-blue-500/20 dark:shadow-none">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                Upload Image
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Drop any JPG, PNG, or WebP image file
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div>
                            <div className="w-16 h-16 bg-blue-400 rounded flex items-center justify-center mb-6 text-2xl font-bold text-white shadow-lg shadow-blue-400/20 dark:shadow-none">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                AI Analysis
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Our model processes and classifies your image
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div>
                            <div className="w-16 h-16 bg-orange-500 rounded flex items-center justify-center mb-6 text-2xl font-bold text-white shadow-lg shadow-orange-500/20 dark:shadow-none">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                View Results
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Get predictions with visual explanations
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-24 bg-blue-600 dark:bg-blue-500 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl shadow-xl dark:shadow-none">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to try it out?
                            </h2>
                            <p className="text-blue-100 text-lg">
                                Start classifying images with explainable AI today
                            </p>
                        </div>
                        <Link
                            href="/classifier"
                            className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
