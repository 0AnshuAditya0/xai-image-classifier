'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar({ onAuthClick }) {
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full h-16 border-b border-[#1E293B] z-50 bg-[#0A0A0A] flex justify-between items-center px-8 transition-all duration-300">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-black tracking-tighter text-white uppercase flex items-center gap-2 transition-all hover:text-[#3B82F6]">
                    XAI Classifier
                </Link>
                <div className="hidden md:flex gap-6">
                    <Link href="/classifier" className="text-[#919191] font-bold text-[10px] tracking-widest hover:text-white transition-colors uppercase">
                        Analyze
                    </Link>
                    <Link href="/#features" className="text-[#919191] font-bold text-[10px] tracking-widest hover:text-white transition-colors uppercase">
                        Features
                    </Link>
                    <Link href="/#how-it-works" className="text-[#919191] font-bold text-[10px] tracking-widest hover:text-white transition-colors uppercase">
                        How It Works
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {session ? (
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/history" className="text-[#919191] font-bold text-[10px] tracking-widest uppercase hover:text-white transition-colors">
                            History
                        </Link>
                        <div className="flex items-center gap-3 px-3 py-1 border border-[#1E293B] bg-[#111111] hover:border-[#3B82F6]/50 transition-colors">
                            <span className="material-symbols-outlined text-[#3B82F6] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                            <span className="text-[10px] font-black text-white tracking-widest uppercase">
                                {session.user?.name || 'USER'}
                            </span>
                        </div>
                        <button onClick={() => signOut()} className="text-[#919191] hover:text-red-500 transition-colors flex items-center">
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </button>
                    </div>
                ) : (
                    <button onClick={onAuthClick} className="hidden md:flex text-white bg-[#111111] border border-[#1E293B] hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 px-4 py-1 flex items-center justify-center transition-all duration-300 gap-2 hover:scale-105">
                        <span className="material-symbols-outlined text-[14px]">login</span>
                        <span className="text-[10px] font-black tracking-widest uppercase">Get Started</span>
                    </button>
                )}

                <div className="md:hidden flex items-center">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#919191] hover:text-white transition-colors flex items-center">
                        <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-[#0A0A0A] border-b border-[#1E293B] flex shadow-2xl z-40 md:hidden animate-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col w-full p-4 gap-2">
                        <Link href="/classifier" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-[#919191] hover:text-white hover:bg-[#111111] text-[10px] font-bold tracking-widest uppercase transition-colors">
                            Analyze
                        </Link>
                        <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-[#919191] hover:text-white hover:bg-[#111111] text-[10px] font-bold tracking-widest uppercase transition-colors">
                            Features
                        </Link>
                        <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-[#919191] hover:text-white hover:bg-[#111111] text-[10px] font-bold tracking-widest uppercase transition-colors">
                            How It Works
                        </Link>
                        {session ? (
                            <>
                                <Link href="/history" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-[#919191] hover:text-white hover:bg-[#111111] text-[10px] font-bold tracking-widest uppercase transition-colors">
                                    History
                                </Link>
                                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="px-4 py-3 text-red-500 hover:bg-red-950/20 text-[10px] font-bold tracking-widest uppercase text-left transition-colors">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { onAuthClick(); setMobileMenuOpen(false); }} className="mt-2 w-full text-white bg-[#111111] border border-[#1E293B] hover:border-[#3B82F6] px-4 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors">
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
