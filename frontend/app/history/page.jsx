'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { getHistory } from '../lib/api';

export default function HistoryPage() {
    const { data: session } = useSession();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.email) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [session]);

    const fetchHistory = async () => {
        try {
            const data = await getHistory(session.user.email);
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#3B82F6] selection:text-white transition-none overflow-x-hidden">
                <Navbar onAuthClick={() => setShowAuthModal(true)} />
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

                <div className="pt-32 pb-16 min-h-[80vh] flex items-center justify-center font-body">
                    <div className="max-w-2xl w-full px-8">
                        <div className="bg-[#111111] border border-[#1E293B] p-12 lg:p-16 flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-[#3B82F6] text-[48px] mb-6 block">lock</span>
                            <h1 className="text-3xl font-semibold text-white mb-2 uppercase tracking-tight">
                                Authentication Required
                            </h1>
                            <p className="text-[11px] text-[#919191] tracking-widest uppercase mb-8">
                                Secure system access is mandatory to retrieve historical telemetry
                            </p>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[11px] tracking-widest uppercase transition-none w-full max-w-xs"
                            >
                                INITIALIZE SESSION
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#3B82F6] selection:text-white transition-none font-body">
            <Navbar onAuthClick={() => setShowAuthModal(true)} />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            <div className="pt-32 pb-16 px-8 min-h-[85vh]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex items-center text-[10px] text-[#919191] tracking-widest uppercase font-bold">
                        <Link href="/" className="hover:text-[#3B82F6] transition-none">
                            MATRIX
                        </Link>
                        <span className="material-symbols-outlined text-[14px] mx-2">chevron_right</span>
                        <span className="text-white">TELEMETRY LOG</span>
                    </div>

                    <div className="mb-12 border-l-2 border-[#3B82F6] pl-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-semibold text-white mb-2 uppercase tracking-tight">
                                Analysis History
                            </h1>
                            <p className="text-[11px] text-[#919191] uppercase tracking-widest">
                                Comprehensive audit log of past visual classification requests
                            </p>
                        </div>
                        <div className="hidden md:flex border border-[#1E293B] bg-[#111111] px-4 py-2 items-center gap-2">
                            <span className="material-symbols-outlined text-[#3B82F6] text-[16px]">monitoring</span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-white">{history.length} RECORDS</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20 min-h-[40vh]">
                            <div className="flex flex-col items-center gap-4">
                                <span className="material-symbols-outlined animate-spin text-[#3B82F6] text-[32px]">sync</span>
                                <span className="text-[10px] font-bold text-[#3B82F6] tracking-widest uppercase animate-pulse">EXTRACTING LOGS...</span>
                            </div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="bg-[#111111] border border-[#1E293B] p-16 text-center">
                            <div className="w-16 h-16 mx-auto mb-6 border border-[#3B82F6]/30 bg-[#3B82F6]/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#3B82F6] text-[24px]">history</span>
                            </div>
                            <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight uppercase">
                                Database Empty
                            </h2>
                            <p className="text-[#919191] text-[11px] uppercase tracking-widest mb-8 max-w-lg mx-auto leading-loose">
                                No historical diagnostic data found for your user identifier. Run an initialization scan to populate records.
                            </p>
                            <Link
                                href="/classifier"
                                className="inline-flex items-center px-8 py-4 bg-[#0A0A0A] border border-[#1E293B] hover:border-[#3B82F6] text-[#919191] hover:text-white font-bold tracking-widest uppercase text-[11px] transition-none"
                            >
                                EXECUTE NEW DIAGNOSTIC
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((item) => (
                                <div key={item.id} className="bg-[#111111] border border-[#1E293B] p-6 hover:border-[#3B82F6] hover:bg-[#1A1A1A] transition-none group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-sm font-semibold text-white tracking-widest uppercase truncate max-w-[70%] text-left" title={item.prediction}>
                                            {item.prediction}
                                        </h3>
                                        <div className="border border-green-500/50 bg-green-500/10 px-2 py-1">
                                            <span className="text-green-500 text-[10px] font-bold tracking-widest">
                                                {item.confidence.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 border-t border-[#1E293B] pt-4 mt-4">
                                        <span className="material-symbols-outlined text-[14px] text-[#919191] group-hover:text-[#3B82F6]">schedule</span>
                                        <span className="text-[10px] text-[#919191] tracking-widest font-bold uppercase">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
