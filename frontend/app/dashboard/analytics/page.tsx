"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

type Summary = {
    total_exercises: number;
    accuracy: number;
    average_mastery: number;
    streak_active: number;
};

type SkillData = {
    skill: string;
    total: number;
    correct: number;
    avg_mastery: number;
};

type TopicData = {
    topic: string;
    skill: string;
    total: number;
    correct: number;
    peak_mastery: number;
};

type HistoryLog = {
    mastery_score_at_time: number;
    created_at: string;
};

export default function AnalyticsDashboard() {
    const { profile, assessment } = useAuth();
    const [summary, setSummary] = useState<Summary | null>(null);
    const [skills, setSkills] = useState<SkillData[]>([]);
    const [topics, setTopics] = useState<TopicData[]>([]);
    const [history, setHistory] = useState<HistoryLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [summaryRes, skillsRes, topicsRes, masteriesRes] = await Promise.all([
                    apiFetch("/progress/summary?days=30"),
                    apiFetch("/progress/skills?days=30"),
                    apiFetch("/progress/topics?days=30"),
                    apiFetch("/mastery/overview")
                ]);

                if (summaryRes.ok) setSummary(await summaryRes.json());
                if (skillsRes.ok) setSkills(await skillsRes.json());
                if (topicsRes.ok) setTopics(await topicsRes.json());

                if (masteriesRes.ok) {
                    const mData = await masteriesRes.json();
                    setHistory(mData.mastery.map((m: any) => ({
                        mastery_score_at_time: m.mastery_score,
                        created_at: m.last_attempted_at
                    })));
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#07090f] flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const weakAreas = topics.filter(t => t.peak_mastery < 60).slice(0, 3);
    const completionRate = summary?.accuracy || 0;

    return (
        <div className="min-h-screen bg-[#07090f] text-white selection:bg-indigo-500/30 overflow-x-hidden pb-20">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/5 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-20 sticky top-0 bg-black/20 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-xs rounded-xl shadow-lg">LP</div>
                            <h1 className="text-lg font-black tracking-tighter uppercase hidden sm:block">LinguaPath</h1>
                        </div>
                        <nav className="flex gap-6">
                            <Link href="/dashboard" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors pb-1">
                                Roadmap
                            </Link>
                            <Link href="/dashboard/analytics" className="text-[10px] font-black text-white uppercase tracking-widest border-b-2 border-indigo-500 pb-1">
                                Analytics
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{profile?.target_exam} English • {profile?.daily_minutes}m Daily</p>
                            <p className="text-sm font-bold text-indigo-400 italic">{assessment?.cefr_level || "N/A"} Proficiency</p>
                        </div>

                        <Link href="/dashboard" className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-16">
                <div>
                    <h1 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-3">Academic Performance Synthesis</h1>
                    <p className="text-4xl font-black tracking-tight italic">Progressive <span className="text-indigo-400">Outcomes</span></p>
                </div>

                {/* 1. Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Plan Completion", val: `${completionRate}%`, color: "indigo" },
                        { label: "Total Engagements", val: summary?.total_exercises || 0, color: "purple" },
                        { label: "Avg Proficiency", val: `${summary?.average_mastery || 0}%`, color: "pink" },
                        { label: "Accuracy Rate", val: `${summary?.accuracy || 0}%`, color: "emerald" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[30px] backdrop-blur-xl relative group">
                            <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-indigo-500 transition-colors" />
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                            <p className="text-3xl font-black">{stat.val}</p>
                        </div>
                    ))}
                </div>

                {/* 2. Visualization Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Level Progress */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-2">Knowledge Velocity</h2>
                        <div className="bg-white/5 border border-white/10 p-12 rounded-[40px] backdrop-blur-2xl h-80 flex flex-col justify-between group">
                            <div className="flex-1 relative">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#ec4899" />
                                        </linearGradient>
                                    </defs>
                                    <polyline
                                        fill="none"
                                        stroke="url(#lineGrad)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                        points={history.map((h, i) => `${(i / (history.length - 1)) * 480},${180 - (h.mastery_score_at_time * 1.8)}`).join(' ')}
                                    />
                                    {history.map((h, i) => (
                                        <circle key={i} cx={(i / (history.length - 1)) * 480} cy={180 - (h.mastery_score_at_time * 1.8)} r="4" fill="white" className="drop-shadow-lg" />
                                    ))}
                                </svg>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/5 pt-8">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Entry Baseline</span>
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Current Momentum</span>
                            </div>
                        </div>
                    </section>

                    {/* Skill Distribution */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-2">Competency Distribution</h2>
                        <div className="bg-white/5 border border-white/10 p-12 rounded-[40px] backdrop-blur-2xl space-y-10 group">
                            {skills.map((s, idx) => (
                                <div key={idx} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-gray-200 uppercase tracking-widest">{s.skill}</span>
                                        <span className="text-sm font-black text-indigo-400 italic">{Math.round(s.avg_mastery)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-1000 ease-out"
                                            style={{ width: `${s.avg_mastery}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* 3. Deep Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-white/5 pt-16">
                    <section className="space-y-8">
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-2">Targeted Friction points</h2>
                        <div className="space-y-4">
                            {weakAreas.length > 0 ? weakAreas.map((w, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl flex justify-between items-center group hover:bg-white/10 transition-all">
                                    <div>
                                        <p className="text-base font-bold text-white mb-1">{w.topic}</p>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{w.skill}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-pink-500">{w.peak_mastery}%</p>
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Mastery Low</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-10 text-center bg-white/5 border border-white/10 rounded-3xl opacity-50">
                                    <p className="text-xs text-gray-500 italic">Uniform proficiency detected across all quadrants.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-2">AI Pedagogical Strategy</h2>
                        <div className="bg-[#0a0c14] border border-indigo-500/20 p-10 rounded-[40px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                            </div>
                            <div className="relative z-10 space-y-6">
                                <p className="text-lg font-serif italic text-gray-300 leading-relaxed">
                                    "Your current performance data indicates a high velocity in {skills[0]?.skill || 'general aptitude'}. To accelerate mastery, our engine will inject {weakAreas[0]?.topic || 'advanced structures'} into your next Roadmap cycle."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="h-0.5 w-6 bg-indigo-500"></div>
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Strategy Generated by LCore 4.0</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
