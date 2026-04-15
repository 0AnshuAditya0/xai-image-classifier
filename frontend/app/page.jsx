'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

export default function Home() {
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-body selection:bg-[#3B82F6] selection:text-white transition-all duration-500 overflow-x-hidden">
            <Navbar onAuthClick={() => setShowAuthModal(true)} />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            <section className="pt-32 pb-20 px-8 relative overflow-hidden">
                <div className="absolute top-16 left-0 w-full h-[1px] bg-[#3B82F6] opacity-30 z-10 pointer-events-none shadow-[0_0_10px_#3B82F6]"></div>

                <div className="max-w-7xl mx-auto relative z-10 border border-[#1E293B] bg-[#111111] p-12 lg:p-24 hover:border-[#3B82F6]/50 transition-all duration-500">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2 text-left">
                            <div className="inline-flex items-center px-2 py-1 border border-[#3B82F6] bg-[#3B82F6]/5 mb-8">
                                <span className="text-[10px] font-bold text-[#3B82F6] tracking-widest uppercase">Powered by Smart AI</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight leading-none text-white uppercase">
                                Simple AI Image<br />Analysis.
                            </h1>

                            <p className="text-[#919191] text-[11px] uppercase tracking-widest mb-10 max-w-xl leading-loose">
                                Upload any image and get instant answers.
                                See exactly what the AI is looking at with easy focus maps.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <Link
                                    href="/classifier"
                                    className="px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[11px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2 hover:translate-x-1"
                                >
                                    START ANALYSIS
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </Link>
                                <button
                                    onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-[#0A0A0A] border border-[#1E293B] hover:border-[#3B82F6] text-[#919191] hover:text-white flex items-center gap-2 font-bold transition-all duration-300 tracking-widest uppercase text-[11px]"
                                >
                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                    <span>HOW IT WORKS</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative group">
                            <div className="relative w-full border border-[#1E293B] bg-[#0A0A0A] p-2 group-hover:border-[#3B82F6]/30 transition-all duration-700">
                                <div className="absolute top-0 right-0 p-2 bg-[#111111] border-b border-l border-[#1E293B] z-20">
                                    <span className="text-[10px] text-[#919191] tracking-widest uppercase font-bold">SMART.AI.V1</span>
                                </div>
                                <img
                                    src="/mundophone.jpeg"
                                    alt="AI Visualization"
                                    className="w-full h-auto object-cover grayscale opacity-80 mix-blend-screen group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-[#0A0A0A]/40 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-all duration-1000"></div>
                                <div className="absolute bottom-4 left-4 border border-[#3B82F6]/50 bg-[#3B82F6]/10 px-3 py-1 backdrop-blur-sm shadow-[0_0_15px_#3B82F6_inset]">
                                    <p className="text-[10px] font-bold tracking-widest text-[#3B82F6] uppercase m-0">AI is thinking...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-8 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#111111] p-10 border border-[#1E293B] border-l-4 border-l-[#3B82F6] flex flex-col items-start justify-center h-48 transition-all duration-300 hover:bg-[#1A1A1A] hover:translate-y-[-4px]">
                            <div className="text-5xl font-light tracking-tighter text-white mb-2">99%</div>
                            <div className="text-[#919191] text-[10px] font-bold tracking-widest uppercase">Accuracy</div>
                        </div>
                        <div className="bg-[#111111] p-10 border border-[#1E293B] border-l-4 border-l-[#3B82F6] flex flex-col items-start justify-center h-48 transition-all duration-300 hover:bg-[#1A1A1A] hover:translate-y-[-4px]">
                            <div className="text-5xl font-light tracking-tighter text-white mb-2">10</div>
                            <div className="text-[#919191] text-[10px] font-bold tracking-widest uppercase">Object Types</div>
                        </div>
                        <div className="bg-[#111111] p-10 border border-[#1E293B] border-l-4 border-l-[#3B82F6] flex flex-col items-start justify-center h-48 transition-all duration-300 hover:bg-[#1A1A1A] hover:translate-y-[-4px]">
                            <div className="text-5xl font-light tracking-tighter text-white mb-2">Advanced</div>
                            <div className="text-[#919191] text-[10px] font-bold tracking-widest uppercase">AI Engine</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 px-8 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 border-l-2 border-[#3B82F6] pl-6">
                        <h2 className="text-4xl font-semibold mb-4 text-white uppercase tracking-tight">
                            Main Features
                        </h2>
                        <p className="text-[11px] text-[#919191] uppercase tracking-widest">
                            Simple tools to see how AI works
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#111111] border border-[#1E293B] p-8 hover:border-[#3B82F6] transition-all duration-300 group hover:bg-[#1A1A1A]">
                            <span className="material-symbols-outlined text-[24px] text-[#3B82F6] mb-6 block group-hover:scale-110 transition-transform">bolt</span>
                            <h3 className="text-[14px] font-bold mb-3 text-white uppercase tracking-widest">
                                Fast Results
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Get answers instantly with our super fast processing engine
                            </p>
                        </div>

                        <div className="bg-[#111111] border border-[#1E293B] p-8 hover:border-[#3B82F6] transition-all duration-300 group hover:bg-[#1A1A1A]">
                            <span className="material-symbols-outlined text-[24px] text-[#3B82F6] mb-6 block group-hover:scale-110 transition-transform">grid_4x4</span>
                            <h3 className="text-[14px] font-bold mb-3 text-white uppercase tracking-widest">
                                Many Objects
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                We can identify 10 different types of common objects easily
                            </p>
                        </div>

                        <div className="bg-[#111111] border border-[#1E293B] p-8 hover:border-[#3B82F6] transition-all duration-300 group hover:bg-[#1A1A1A]">
                            <span className="material-symbols-outlined text-[24px] text-orange-500 mb-6 block group-hover:scale-110 transition-transform">visibility</span>
                            <h3 className="text-[14px] font-bold mb-3 text-white uppercase tracking-widest">
                                See AI Focus
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Colorful maps show you exactly what part of the image the AI liked
                            </p>
                        </div>

                        <div className="bg-[#111111] border border-[#1E293B] p-8 hover:border-[#3B82F6] transition-all duration-300 group hover:bg-[#1A1A1A]">
                            <span className="material-symbols-outlined text-[24px] text-red-500 mb-6 block group-hover:scale-110 transition-transform">security</span>
                            <h3 className="text-[14px] font-bold mb-3 text-white uppercase tracking-widest">
                                AI Stress Test
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Test how the AI handles tricky or modified images easily
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-24 px-8 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto border border-[#1E293B] bg-[#111111] p-12 lg:p-24">
                    <div className="mb-16 border-l-2 border-[#3B82F6] pl-6">
                        <h2 className="text-4xl font-semibold mb-4 text-white uppercase tracking-tight">
                            How It Works
                        </h2>
                        <p className="text-[11px] text-[#919191] uppercase tracking-widest">
                            Follow these easy steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="border border-[#1E293B] p-6 bg-[#0A0A0A] relative hover:border-[#3B82F6]/50 transition-all">
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#3B82F6] flex items-center justify-center font-bold text-[10px] tracking-widest text-[#0A0A0A]">
                                01
                            </div>
                            <h3 className="text-[12px] font-bold mb-3 text-white mt-4 uppercase tracking-widest">
                                Upload Image
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Just drag and drop your photo into our system.
                            </p>
                        </div>

                        <div className="border border-[#1E293B] p-6 bg-[#0A0A0A] relative hover:border-[#3B82F6]/50 transition-all">
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white flex items-center justify-center font-bold text-[10px] tracking-widest text-[#0A0A0A]">
                                02
                            </div>
                            <h3 className="text-[12px] font-bold mb-3 text-white mt-4 uppercase tracking-widest">
                                Analysis
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Our special AI looks deep into the pixels to understand it.
                            </p>
                        </div>

                        <div className="border border-[#1E293B] p-6 bg-[#0A0A0A] relative hover:border-[#3B82F6]/50 transition-all">
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500 flex items-center justify-center font-bold text-[10px] tracking-widest text-[#0A0A0A]">
                                03
                            </div>
                            <h3 className="text-[12px] font-bold mb-3 text-white mt-4 uppercase tracking-widest">
                                Results
                            </h3>
                            <p className="text-[#919191] text-[10px] uppercase tracking-widest leading-loose">
                                Get clear answers and a map showing the AI's thoughts.
                            </p>
                        </div>
                    </div>

                    <div className="mt-24 border border-[#3B82F6] bg-[#3B82F6]/5 p-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm">
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-2 uppercase tracking-tight">
                                Ready To Try?
                            </h2>
                            <p className="text-[11px] text-[#3B82F6] tracking-widest uppercase">
                                Our AI is waiting for your photo
                            </p>
                        </div>
                        <Link
                            href="/classifier"
                            className="px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[11px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2 hover:scale-105"
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
