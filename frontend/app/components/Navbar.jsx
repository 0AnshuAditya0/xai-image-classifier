'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Moon, Sun, Menu, X, Layers } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar({ onAuthClick }) {
    const { data: session } = useSession();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            XAI Classifier
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium text-sm"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#features"
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium text-sm"
                        >
                            Features
                        </Link>
                        <Link
                            href="/#how-it-works"
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium text-sm"
                        >
                            Docs
                        </Link>
                        <Link
                            href="/classifier"
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium text-sm"
                        >
                            Classify
                        </Link>
                    </div>

                    {/* Right Section: Theme Toggle + Auth */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Auth Section */}
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/history"
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white font-medium text-sm"
                                >
                                    History
                                </Link>
                                {/* User Profile Display */}
                                <div className="flex items-center space-x-3 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {session.user?.name || 'User'}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {session.user?.email}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all duration-300 text-sm"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onAuthClick}
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition-all duration-300 text-sm"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-900 dark:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f172a]">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-left text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                            >
                                Features
                            </button>
                            <Link
                                href="#"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                            >
                                Docs
                            </Link>
                            <Link
                                href="/classifier"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                            >
                                Classify
                            </Link>
                            {session ? (
                                <>
                                    <Link
                                        href="/history"
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        History
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md text-left w-full"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onAuthClick}
                                    className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md w-full"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
