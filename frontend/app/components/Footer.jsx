'use client';

import Link from 'next/link';
import { Github, Mail, Twitter, Layers } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] border-t border-white/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                XAI Classifier
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                            AI-powered image classification with explainable AI visualizations.
                            Built with ResNet152 and Grad-CAM for transparent, trustworthy decision-making.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/0AnshuAditya0/xai-image-classifier"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center hover:bg-blue-500 transition-colors duration-300 group"
                            >
                                <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a
                                href="mailto:contact@xai-classifier.com"
                                className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center hover:bg-blue-500 transition-colors duration-300 group"
                            >
                                <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center hover:bg-blue-500 transition-colors duration-300 group"
                            >
                                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <div className="flex flex-col space-y-4">
                            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Home
                            </Link>
                            <Link href="/classifier" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Try Classifier
                            </Link>
                            <a
                                href="https://github.com/0AnshuAditya0/xai-image-classifier"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors text-sm"
                            >
                                GitHub
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors text-sm"
                            >
                                Documentation
                            </a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Resources</h4>
                        <div className="flex flex-col space-y-4">
                            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">
                                How It Works
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                API Docs
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} XAI Classifier. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
