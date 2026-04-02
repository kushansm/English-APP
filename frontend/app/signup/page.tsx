'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SignupPage() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(99,102,241,0.3)',
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Ambient orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
                style={{ background: 'radial-gradient(circle, #8b5cf6, #6366f1)' }} />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-15 blur-[120px]"
                style={{ background: 'radial-gradient(circle, #ec4899, #6366f1)' }} />

            <div className="relative w-full max-w-md">
                <div
                    className="rounded-2xl p-8 border"
                    style={{
                        background: 'rgba(17, 17, 40, 0.85)',
                        backdropFilter: 'blur(24px)',
                        borderColor: 'rgba(99, 102, 241, 0.25)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="text-3xl">🎓</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                LinguaPath
                            </span>
                        </div>
                        <h1 className="text-xl font-semibold text-white">Create your account</h1>
                        <p className="text-sm text-gray-400 mt-1">Start your personalized English learning journey</p>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 justify-center mb-7">
                        {['AI-Powered 🤖', 'CEFR Aligned 📊', 'Adaptive 🎯'].map(feat => (
                            <span key={feat} className="text-xs px-3 py-1 rounded-full font-medium"
                                style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                                {feat}
                            </span>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="rounded-lg px-4 py-3 text-sm text-red-300 border"
                                style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Alex Johnson"
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                                style={inputStyle}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.7)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                                style={inputStyle}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.7)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password <span className="text-gray-500 font-normal">(min. 8 characters)</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                                style={inputStyle}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.7)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account…
                                </span>
                            ) : 'Create Account →'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
