'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0A] border-t border-[#1E293B] pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <Link href="/" className="text-xl font-semibold tracking-tighter text-white uppercase flex items-center gap-2 transition-none hover:text-[#3B82F6]">
                                XAI Classifier
                            </Link>
                        </div>
                        <p className="text-[#919191] text-[11px] uppercase tracking-widest leading-loose max-w-md mb-8">
                            AI-powered image classification with explainable AI visualizations. Built with ResNet18 and Grad-CAM for transparent, trustworthy decision-making.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/0AnshuAditya0/xai-image-classifier"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-[#1E293B] bg-[#111111] flex items-center justify-center hover:bg-[#3B82F6] hover:border-[#3B82F6] hover:text-white text-[#919191] transition-none"
                            >
                                <span className="text-[10px] font-bold tracking-widest uppercase">GIT</span>
                            </a>
                            <a
                                href="mailto:contact@xai-classifier.com"
                                className="w-10 h-10 border border-[#1E293B] bg-[#111111] flex items-center justify-center hover:bg-[#3B82F6] hover:border-[#3B82F6] hover:text-white text-[#919191] transition-none"
                            >
                                <span className="material-symbols-outlined text-[16px]">mail</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-[10px] font-bold tracking-widest uppercase mb-6">System Links</h4>
                        <div className="flex flex-col space-y-4">
                            <Link href="/" className="text-[#919191] text-[11px] font-medium tracking-widest uppercase hover:text-[#3B82F6] transition-none">
                                Matrix
                            </Link>
                            <Link href="/classifier" className="text-[#919191] text-[11px] font-medium tracking-widest uppercase hover:text-[#3B82F6] transition-none">
                                Initialization
                            </Link>
                            <a
                                href="https://github.com/0AnshuAditya0/xai-image-classifier"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#919191] text-[11px] font-medium tracking-widest uppercase hover:text-[#3B82F6] transition-none"
                            >
                                Source Logic
                            </a>
                            <a
                                href="#"
                                className="text-[#919191] text-[11px] font-medium tracking-widest uppercase hover:text-[#3B82F6] transition-none"
                            >
                                Architecture
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-[10px] font-bold tracking-widest uppercase mb-6">API & Auth</h4>
                        <div className="flex flex-col space-y-4">
                            <a href="#features" className="text-[#919191] text-[11px] font-medium tracking-widest uppercase hover:text-[#3B82F6] transition-none">
                                Capabilities
                            </a>
                            <a href="#how-it-works" className="text-[#919191] text-[11px] font-medium tracking-widest uppercase hover:text-[#3B82F6] transition-none">
                                Mechanism
                            </a>
                            <a href="#" className="text-[#919191] text-[11px] font-medium tracking-widest uppercase hover:text-[#3B82F6] transition-none">
                                API Access
                            </a>
                            <a href="#" className="text--[#919191] text-[11px] font-medium tracking-widest uppercase hover:text-[#3B82F6] transition-none">
                                Security
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#1E293B] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#475569] text-[10px] tracking-widest uppercase font-bold">
                        © {new Date().getFullYear()} AI Research Division. All parameters secured.
                    </p>
                </div>
            </div>
        </footer>
    );
}
