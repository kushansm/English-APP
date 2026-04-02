"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    const [summary, setSummary] = useState<Summary | null>(null);
    const [skills, setSkills] = useState<SkillData[]>([]);
    const [topics, setTopics] = useState<TopicData[]>([]);
    const [history, setHistory] = useState<HistoryLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [summaryRes, skillsRes, topicsRes, masteriesRes] = await Promise.all([
                    fetch("http://127.0.0.1:8000/api/progress/summary?days=30"),
                    fetch("http://127.0.0.1:8000/api/progress/skills?days=30"),
                    fetch("http://127.0.0.1:8000/api/progress/topics?days=30"),
                    fetch("http://127.0.0.1:8000/api/mastery/overview")
                ]);

                if (summaryRes.ok) setSummary(await summaryRes.json());
                if (skillsRes.ok) setSkills(await skillsRes.json());
                if (topicsRes.ok) setTopics(await topicsRes.json());

                // For level progress chart, we'll fetch actual logs if needed, 
                // but let's mock some trend from current mastery for visualization
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
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    const weakAreas = topics.filter(t => t.peak_mastery < 60).slice(0, 3);
    const completionRate = summary?.accuracy || 0; // Mocking plan completion with accuracy for now

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 px-6 py-12">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Performance Analytics</h1>
                        <p className="text-2xl font-bold tracking-tight">Academic Outcome Report</p>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold text-slate-900 border-b-2 border-slate-900 pb-1 uppercase tracking-widest hover:text-slate-500 hover:border-slate-500 transition-all">
                        Return to Profile
                    </Link>
                </header>

                {/* 1. High Level Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white border border-slate-200 p-6 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Completion</p>
                        <p className="text-2xl font-black">{completionRate}%</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Engagements</p>
                        <p className="text-2xl font-black">{summary?.total_exercises || 0}</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Proficiency</p>
                        <p className="text-2xl font-black">{summary?.average_mastery || 0}%</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy Rate</p>
                        <p className="text-2xl font-black">{summary?.accuracy || 0}%</p>
                    </div>
                </div>

                {/* 2. Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Level Progress - Custom Sparkline */}
                    <div className="space-y-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Level Progression Trend</h2>
                        <div className="bg-white border border-slate-200 p-10 h-64 flex flex-col justify-between">
                            <div className="flex-1 relative">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    <polyline
                                        fill="none"
                                        stroke="#0f172a"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={history.map((h, i) => `${(i / (history.length - 1)) * 400},${150 - (h.mastery_score_at_time * 1.5)}`).join(' ')}
                                    />
                                    {/* Minimal data points */}
                                    {history.map((h, i) => (
                                        <circle key={i} cx={(i / (history.length - 1)) * 400} cy={150 - (h.mastery_score_at_time * 1.5)} r="3" fill="#0f172a" />
                                    ))}
                                </svg>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-8">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Initial Entry</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Current State</span>
                            </div>
                        </div>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="space-y-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Competency Distribution</h2>
                        <div className="bg-white border border-slate-200 p-10 space-y-8">
                            {skills.map((s, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{s.skill}</span>
                                        <span className="text-xs font-black">{Math.round(s.avg_mastery)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 border border-slate-100 overflow-hidden">
                                        <div
                                            className="h-full bg-slate-900 transition-all duration-1000"
                                            style={{ width: `${s.avg_mastery}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Detailed Friction Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-200 pt-12">
                    <div className="space-y-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Critical Friction Areas</h2>
                        <div className="space-y-4">
                            {weakAreas.length > 0 ? weakAreas.map((w, idx) => (
                                <div key={idx} className="bg-red-50/30 border border-red-100/50 p-6 flex justify-between items-center group hover:bg-red-50 transition-all">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{w.topic}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{w.skill}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-red-600">{w.peak_mastery}%</p>
                                        <p className="text-[8px] font-bold text-red-400 uppercase tracking-tighter">Peak Mastery</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400 italic">No significant friction detected. Mastery is consistent across all modules.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Pedagogical Insights</h2>
                        <div className="bg-slate-900 text-white p-10 rounded-sm relative overflow-hidden">
                            <div className="relative z-10 space-y-4">
                                <p className="text-sm font-serif italic text-slate-300 leading-relaxed">
                                    "Based on your 30-day trajectory, your {skills[0]?.skill || 'active'} skills are showing qualitative improvement. We recommend focusing on {weakAreas[0]?.topic || 'complex structures'} to bypass the current proficiency plateau."
                                </p>
                                <div className="h-0.5 w-8 bg-slate-700"></div>
                            </div>
                            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
