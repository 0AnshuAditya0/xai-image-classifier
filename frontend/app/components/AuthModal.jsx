'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function AuthModal({ isOpen, onClose }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                name: isSignUp ? name : undefined,
                isSignUp: isSignUp.toString(),
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                onClose();
                setEmail('');
                setPassword('');
                setName('');
            }
        } catch (err) {
            setError('System error. Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
            <div className="bg-[#0A0A0A] w-full max-w-md relative p-8 border border-[#1E293B]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-[#919191] hover:text-white transition-none"
                >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="w-16 h-16 mb-8 bg-[#111111] border border-[#1E293B] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[24px]">shield_person</span>
                </div>

                <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                    {isSignUp ? 'INITIALIZE RECORD' : 'AUTHENTICATE'}
                </h2>
                <p className="text-[#919191] text-[11px] tracking-widest uppercase mb-8">
                    {isSignUp ? 'Create new secure credential' : 'Enter system credentials'}
                </p>

                {error && (
                    <div className="bg-red-950/20 border border-red-900/50 p-4 mb-6">
                        <p className="text-red-500 text-[10px] font-bold tracking-widest uppercase text-center">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Operator Name
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-[#919191] text-[18px]">person</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={isSignUp}
                                    className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#1E293B] text-white placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] transition-none text-sm"
                                    placeholder="J. DOE"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Secure Email
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-[#919191] text-[18px]">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#1E293B] text-white placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] transition-none text-sm"
                                placeholder="OPERATOR@DOMAIN.COM"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Access Code
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-[#919191] text-[18px]">lock</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-10 py-3 bg-[#111111] border border-[#1E293B] text-white placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] transition-none text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#919191] hover:text-white transition-none"
                            >
                                <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white font-bold py-4 text-[11px] tracking-widest uppercase transition-none disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'PROCESSING...' : isSignUp ? 'GENERATE CREDENTIAL' : 'VERIFY ACCESS'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#1E293B]"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] tracking-widest uppercase">
                            <span className="px-2 bg-[#0A0A0A] text-slate-500">OR PROCEED WITH</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn('google')}
                        className="w-full bg-[#111111] border border-[#1E293B] hover:border-[#3B82F6] text-white py-3 transition-none flex items-center justify-center gap-3"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-[11px] font-bold tracking-widest uppercase">GOOGLE OAUTH</span>
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-[#1E293B]">
                    <span className="text-slate-500 text-[10px] tracking-widest uppercase">
                        {isSignUp ? 'CREDENTIAL EXISTS? ' : "NO CREDENTIAL PRESENT? "}
                    </span>
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                        }}
                        className="text-[#3B82F6] hover:text-white text-[10px] font-bold tracking-widest uppercase transition-none"
                    >
                        {isSignUp ? 'SIGN IN' : 'SIGN UP'}
                    </button>
                </div>
            </div>
        </div>
    );
}
