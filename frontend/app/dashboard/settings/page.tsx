"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

type Profile = {
    target_exam: string;
    target_level: string;
    daily_minutes: number;
    learning_style: string;
    interests: string[];
    focus_areas: string[];
};

export default function SettingsPage() {
    const { user, updateUser, restartOnboarding, logout } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await apiFetch("/onboarding/profile/latest");
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        setMessage(null);

        try {
            // Update User Name if changed
            if (name !== user?.name) {
                // In a real app, we'd have an API call here. 
                // For now, we update local state via AuthContext helper.
                updateUser(name);
            }

            // Update Profile
            const res = await apiFetch("/onboarding/profile", {
                method: "POST",
                body: JSON.stringify({
                    ...profile,
                    target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Maintain 90 day window
                    age_group: "Adult", // Maintain default
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    const handleRestart = async () => {
        if (confirm("Are you sure? This will delete your current progress, assessment results, and learning plan.")) {
            await restartOnboarding();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#07090f] flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07090f] text-white selection:bg-indigo-500/30 pb-20">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/5 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Settings</h1>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Personalize your learning experience</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-12">
                {message && (
                    <div className={`p-4 rounded-2xl border backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <p className="text-sm font-bold flex items-center gap-2">
                            {message.type === 'success' ? '✓' : '⚠'} {message.text}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-12">
                    {/* 1. Account Profile */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Profile Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-xl">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm font-medium focus:border-indigo-500 focus:bg-white/10 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 2. Learning Preferences */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <div className="w-1 h-1 bg-pink-500 rounded-full" />
                            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Learning Preferences</h2>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-xl space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Learning Goal</label>
                                    <select
                                        value={profile?.target_exam}
                                        onChange={(e) => setProfile(p => p ? { ...p, target_exam: e.target.value } : null)}
                                        className="w-full bg-[#12141c] border border-white/10 rounded-2xl px-4 py-3.5 text-sm font-medium focus:border-indigo-500 outline-none transition-all appearance-none"
                                    >
                                        {['General', 'Business', 'Academic', 'IELTS', 'TOEFL'].map(goal => (
                                            <option key={goal} value={goal}>{goal} English</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Current Level (CEFR)</label>
                                    <select
                                        value={profile?.target_level}
                                        onChange={(e) => setProfile(p => p ? { ...p, target_level: e.target.value } : null)}
                                        className="w-full bg-[#12141c] border border-white/10 rounded-2xl px-4 py-3.5 text-sm font-medium focus:border-indigo-500 outline-none transition-all appearance-none"
                                    >
                                        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
                                            <option key={lvl} value={lvl}>{lvl} Level</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Daily Study Commitment</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[15, 30, 60].map(mins => (
                                        <button
                                            key={mins}
                                            type="button"
                                            onClick={() => setProfile(p => p ? { ...p, daily_minutes: mins } : null)}
                                            className={`py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${profile?.daily_minutes === mins
                                                    ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {mins} Minutes
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Action Bar */}
                    <div className="pt-6 flex items-center justify-between gap-6">
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                        >
                            Restart Onboarding
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                        >
                            {saving ? 'Updating Profile...' : 'Save All Changes'}
                        </button>
                    </div>
                </form>

                {/* Account Settings */}
                <section className="pt-12 border-t border-white/5 space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Danger Zone</h2>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-xl flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold">Sign Out</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Exit your current session</p>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all"
                        >
                            Sign Out Account
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
