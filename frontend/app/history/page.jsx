'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, History, Search, Calendar, TrendingUp, Loader2, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { getHistory } from '../lib/api';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860').replace('0.0.0.0', 'localhost');

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
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
                <Navbar onAuthClick={() => setShowAuthModal(true)} />
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

                <div className="pt-28 pb-16">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <div className="glass-card p-12 rounded-2xl">
                            <History className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Sign In Required
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Please sign in to view your analysis history
                            </p>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-8 py-4 bg-gradient-purple-pink hover:shadow-glow text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
            <Navbar onAuthClick={() => setShowAuthModal(true)} />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            <div className="pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 dark:text-white font-medium">History</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                                Analysis History
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                View and manage your past image analyses
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span>{history.length} Analyses</span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="glass-card p-12 rounded-2xl text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-purple-pink/10 dark:bg-gradient-purple-pink/20 rounded-2xl flex items-center justify-center">
                                <History className="w-12 h-12 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                No History Yet
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                You haven't analyzed any images yet. Start analyzing to build your history!
                            </p>
                            <Link
                                href="/classifier"
                                className="inline-flex items-center px-8 py-4 bg-gradient-purple-pink hover:shadow-glow text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                Analyze New Image
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((item) => (
                                <div key={item.id} className="glass-card rounded-xl overflow-hidden hover:shadow-glass transition-all duration-300 group">
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                                                {item.prediction}
                                            </h3>
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-lg">
                                                {item.confidence.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            <Clock className="w-3 h-3" />
                                            {new Date(item.timestamp).toLocaleString()}
                                        </div>
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
