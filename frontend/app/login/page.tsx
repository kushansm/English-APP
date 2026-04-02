'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#07090f] text-white flex items-center justify-center px-4 relative overflow-hidden selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-700">
                {/* Glass Container */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-2xl shadow-2xl space-y-10">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-xs rounded-xl shadow-lg">LP</div>
                            <span className="text-2xl font-black tracking-tighter uppercase">LinguaPath</span>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-xl font-black tracking-tight italic">System <span className="text-indigo-400">Entry</span></h1>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Synchronize Learning Profile</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-4 text-xs font-bold text-red-400 animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Access Identifier</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@identity.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Security Key</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full py-5 rounded-2xl font-black text-xs text-white uppercase tracking-[0.3em] transition-all transform active:scale-95 overflow-hidden disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                boxShadow: '0 20px 40px -10px rgba(99,102,241,0.4)'
                            }}
                        >
                            <span className="relative z-10">{loading ? 'Processing...' : 'Establish Connection'}</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        <Link href="/signup" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.2em] transition-colors">
                            Initialize New Account <span className="text-indigo-400 ml-1">→</span>
                        </Link>
                    </div>
                </div>

                <p className="mt-12 text-center text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">
                    Academic Framework v2.1 • Secure Core
                </p>
            </div>
        </div>
    );
}
