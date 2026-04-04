'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

export default function Home() {
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-body selection:bg-[#3B82F6] selection:text-white transition-none overflow-x-hidden">
            <Navbar onAuthClick={() => setShowAuthModal(true)} />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            <section className="pt-32 pb-20 px-8 relative overflow-hidden">
                <div className="absolute top-16 left-0 w-full h-[1px] bg-[#3B82F6] opacity-30 z-10 pointer-events-none shadow-[0_0_10px_#3B82F6]"></div>

                <div className="max-w-7xl mx-auto relative z-10 border border-[#1E293B] bg-[#111111] p-12 lg:p-24">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2 text-left">
                            <div className="inline-flex items-center px-2 py-1 border border-[#3B82F6] bg-[#3B82F6]/5 mb-8">
                                <span className="text-[10px] font-bold text-[#3B82F6] tracking-widest uppercase">Powered by ResNet152 + Grad-CAM</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight leading-none text-white uppercase">
                                AI-Powered Image<br />Classification.
                            </h1>

                            <p className="text-[#919191] text-[11px] uppercase tracking-widest mb-10 max-w-xl leading-loose">
                                Upload any image and get instant predictions with explainable AI visualizations.
                                See exactly what the AI is analyzing with dynamic Grad-CAM heatmaps.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <Link
                                    href="/classifier"
                                    className="px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[11px] tracking-widest uppercase transition-none flex items-center gap-2"
                                >
                                    ANALYZE IMAGE
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </Link>
                                <button
                                    onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-[#0A0A0A] border border-[#1E293B] hover:border-[#3B82F6] text-[#919191] hover:text-white flex items-center gap-2 font-bold transition-none tracking-widest uppercase text-[11px]"
                                >
                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                    <span>VIEW INFORMATION</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                            <div className="relative w-full border border-[#1E293B] bg-[#0A0A0A] p-2">
                                <div className="absolute top-0 right-0 p-2 bg-[#111111] border-b border-l border-[#1E293B] z-20">
                                    <span className="text-[10px] text-[#919191] tracking-widest uppercase font-bold">XAI.DEMO.V1</span>
                                </div>
                                <img
                                    src="/mundophone.jpeg"
                                    alt="AI Visualization"
                                    className="w-full h-auto object-cover grayscale opacity-80 mix-blend-screen"
                                />
                                <div className="absolute inset-0 bg-[#0A0A0A]/40 mix-blend-overlay pointer-events-none"></div>
                                <div className="absolute bottom-4 left-4 border border-[#3B82F6]/50 bg-[#3B82F6]/10 px-3 py-1 backdrop-blur-sm shadow-[0_0_15px_#3B82F6_inset]">
                                    <p className="text-[10px] font-bold tracking-widest text-[#3B82F6] uppercase m-0">CAM Activation Detected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-8 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#111111] p-10 border border-[#1E293B] border-l-4 border-l-[#3B82F6] flex flex-col items-start justify-center h-48 transition-none hover:bg-[#1A1A1A]">
                            <div className="text-5xl font-light tracking-tighter text-white mb-2">82.3%</div>
                            <div className="text-[#919191] text-[10px] font-bold tracking-widest uppercase">Top-1 Accuracy</div>
                        </div>
                        <div className="bg-[#111111] p-10 border border-[#1E293B] border-l-4 border-l-[#3B82F6] flex flex-col items-start justify-center h-48 transition-none hover:bg-[#1A1A1A]">
                            <div className="text-5xl font-light tracking-tighter text-white mb-2">1000</div>
                            <div className="text-[#919191] text-[10px] font-bold tracking-widest uppercase">Object Categories</div>
                        </div>
                        <div className="bg-[#111111] p-10 border border-[#1E293B] border-l-4 border-l-[#3B82F6] flex flex-col items-start justify-center h-48 transition-none hover:bg-[#1A1A1A]">
                            <div className="text-5xl font-light tracking-tighter text-white mb-2">60M</div>
                            <div className="text-[#919191] text-[10px] font-bold tracking-widest uppercase">Model Parameters</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 px-8 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 border-l-2 border-[#3B82F6] pl-6">
                        <h2 className="text-4xl font-semibold mb-4 text-white uppercase tracking-tight">
                            Core Capabilities
                        </h2>
                        <p className="text-[11px] text-[#919191] uppercase tracking-widest">
                            Professional tools for transparent AI classification
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#111111] border border-[#1E293B] p-8 hover:border-[#3B82F6] transition-none group">
                            <span className="material-symbols-outlined text-[24px] text-[#3B82F6] mb-6 block">bolt</span>
                            <h3 className="text-[14px] font-bold mb-3 text-white uppercase tracking-widest">
                                Fast Analysis
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                GPU-accelerated processing for instant results across robust architectures
                            </p>
                        </div>

                        <div className="bg-[#111111] border border-[#1E293B] p-8 hover:border-[#3B82F6] transition-none group">
                            <span className="material-symbols-outlined text-[24px] text-[#3B82F6] mb-6 block">grid_4x4</span>
                            <h3 className="text-[14px] font-bold mb-3 text-white uppercase tracking-widest">
                                1000 Categories
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                ImageNet mapping enabling vast comprehensive classification parameters
                            </p>
                        </div>

                        <div className="bg-[#111111] border border-[#1E293B] p-8 hover:border-[#3B82F6] transition-none group">
                            <span className="material-symbols-outlined text-[24px] text-orange-500 mb-6 block">visibility</span>
                            <h3 className="text-[14px] font-bold mb-3 text-white uppercase tracking-widest">
                                Explainable AI
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Grad-CAM topological heatmaps exposing visual cortex analysis
                            </p>
                        </div>

                        <div className="bg-[#111111] border border-[#1E293B] p-8 hover:border-[#3B82F6] transition-none group">
                            <span className="material-symbols-outlined text-[24px] text-red-500 mb-6 block">security</span>
                            <h3 className="text-[14px] font-bold mb-3 text-white uppercase tracking-widest">
                                Adversarial Metrics
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Live FGSM vulnerability testing and threat simulations mapped instantly
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-24 px-8 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto border border-[#1E293B] bg-[#111111] p-12 lg:p-24">
                    <div className="mb-16 border-l-2 border-[#3B82F6] pl-6">
                        <h2 className="text-4xl font-semibold mb-4 text-white uppercase tracking-tight">
                            System Information
                        </h2>
                        <p className="text-[11px] text-[#919191] uppercase tracking-widest">
                            Execution thread pipeline from input to inference
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="border border-[#1E293B] p-6 bg-[#0A0A0A] relative">
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#3B82F6] flex items-center justify-center font-bold text-[10px] tracking-widest text-[#0A0A0A]">
                                01
                            </div>
                            <h3 className="text-[12px] font-bold mb-3 text-white mt-4 uppercase tracking-widest">
                                Input Sector
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Inject standard neural formats (JPG, PNG, WEBP) directly into the API conduit.
                            </p>
                        </div>

                        <div className="border border-[#1E293B] p-6 bg-[#0A0A0A] relative">
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white flex items-center justify-center font-bold text-[10px] tracking-widest text-[#0A0A0A]">
                                02
                            </div>
                            <h3 className="text-[12px] font-bold mb-3 text-white mt-4 uppercase tracking-widest">
                                Process Thread
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Model processes node layers. Optional adversarial corruption (FGSM) injected.
                            </p>
                        </div>

                        <div className="border border-[#1E293B] p-6 bg-[#0A0A0A] relative">
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500 flex items-center justify-center font-bold text-[10px] tracking-widest text-[#0A0A0A]">
                                03
                            </div>
                            <h3 className="text-[12px] font-bold mb-3 text-white mt-4 uppercase tracking-widest">
                                Output Matrix
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Return deterministic confidence scores with topological visual explainability layers.
                            </p>
                        </div>
                    </div>

                    <div className="mt-24 border border-[#3B82F6] bg-[#3B82F6]/5 p-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm">
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-2 uppercase tracking-tight">
                                Execute Terminal
                            </h2>
                            <p className="text-[11px] text-[#3B82F6] tracking-widest uppercase">
                                Subsystem ready for image payload parsing
                            </p>
                        </div>
                        <Link
                            href="/classifier"
                            className="px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[11px] tracking-widest uppercase transition-none flex items-center gap-2"
                        >
                            ANALYZE IMAGE
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
