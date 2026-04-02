"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

type Profile = {
    target_exam: string;
    daily_minutes: number;
    learning_style: string;
    interests: string[];
    focus_areas: string[];
    custom_focus?: string;
    ai_summary?: string;
    learning_plan?: string[];
};

type SkillScore = {
    skill: string;
    score: number;
};

type Assessment = {
    cefr_level: string;
    overall_score: number;
    skill_scores: SkillScore[];
};

type LearningPlan = {
    id: number;
    plan_data: {
        [week: string]: {
            [day: string]: string[];
        };
    };
    completed_tasks: string[] | null;
    created_at: string;
};

type MasteryRecord = {
    topic: string;
    skill: string;
    mastery_score: number;
    streak: number;
    last_attempted_at: string;
};

type ErrorLog = {
    topic: string;
    error_pattern: string;
    occurrence_count: number;
};

export default function LearningProfileScreen() {
    const { user, profile, assessment, refreshProfile } = useAuth();
    const [plan, setPlan] = useState<LearningPlan | null>(null);
    const [masteryData, setMasteryData] = useState<{ mastery: MasteryRecord[], errors: ErrorLog[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeWeek, setActiveWeek] = useState<string | null>(null);

    // Get current day of week (1-7, where 1 is Monday)
    const todayNum = new Date().getDay() || 7;
    const todayLabel = `Day ${todayNum}`;

    useEffect(() => {
        async function fetchData() {
            try {
                const [planRes, masteryRes] = await Promise.all([
                    apiFetch("/plan"),
                    apiFetch("/mastery/overview")
                ]);

                if (planRes.ok) {
                    const planData = await planRes.json();
                    setPlan(planData);
                    const sortedWeeks = Object.keys(planData.plan_data).sort((a, b) => {
                        const numA = parseInt(a.replace(/\D/g, '')) || 0;
                        const numB = parseInt(b.replace(/\D/g, '')) || 0;
                        return numA - numB;
                    });
                    setActiveWeek(sortedWeeks[0]);
                } else if (planRes.status === 404) {
                    console.log("Learning plan not yet generated.");
                }

                if (masteryRes.ok) {
                    const mData = await masteryRes.json();
                    setMasteryData(mData);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to synchronize with learning data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleInitialize = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/plan/generate", {
                method: "POST",
            });
            if (res.ok) {
                const data = await res.json();
                setPlan(data.plan);
                setActiveWeek(Object.keys(data.plan.plan_data)[0]);
            }
        } catch (err) {
            console.error("Initialization error:", err);
            setError("Critical synchronization error.");
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (taskKey: string) => {
        if (!plan) return;

        // Optimistic UI update
        const currentCompleted = plan.completed_tasks || [];
        const isCompleted = currentCompleted.includes(taskKey);
        const nextCompleted = isCompleted
            ? currentCompleted.filter((k: string) => k !== taskKey)
            : [...currentCompleted, taskKey];

        setPlan({ ...plan, completed_tasks: nextCompleted });

        try {
            const res = await apiFetch("/plan/task/toggle", {
                method: "POST",
                body: JSON.stringify({ task_key: taskKey })
            });
            if (!res.ok) {
                // Rollback on failure
                setPlan({ ...plan, completed_tasks: currentCompleted });
            }
        } catch (err) {
            setPlan({ ...plan, completed_tasks: currentCompleted });
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
        <div className="min-h-screen bg-[#07090f] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/5 blur-[120px] rounded-full" />
            </div>

            {/* Premium Header */}
            <header className="relative z-20 sticky top-0 bg-black/20 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-xs rounded-xl shadow-lg">LP</div>
                            <h1 className="text-lg font-black tracking-tighter uppercase hidden sm:block">LinguaPath</h1>
                        </div>
                        <nav className="flex gap-6">
                            <Link href="/dashboard" className="text-[10px] font-black text-white uppercase tracking-widest border-b-2 border-indigo-500 pb-1">
                                Roadmap
                            </Link>
                            <Link href="/dashboard/analytics" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors pb-1">
                                Analytics
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{profile?.target_exam} English • {profile?.daily_minutes}m Daily</p>
                            <p className="text-sm font-bold text-indigo-400 italic">{assessment?.cefr_level || "N/A"} Proficiency</p>
                        </div>

                        {user && (
                            <Link href="/dashboard/settings" className="flex items-center gap-3 border-l border-white/5 pl-6 group transition-all">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold group-hover:text-indigo-400 transition-colors">{user.name}</span>
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Settings</span>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all shadow-lg uppercase">
                                    {user.name.charAt(0)}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-16">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        {error}
                    </div>
                )}

                {/* 1. Header Hero section with AI Summary */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-[40px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative bg-[#0a0c14]/80 backdrop-blur-2xl border border-white/10 p-12 rounded-[40px] overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M2 12h20" /></svg>
                            </div>

                            <div className="max-w-3xl space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-2">
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">Current AI Synthesis</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight italic font-serif">
                                    "{profile?.ai_summary || "Our AI is currently synthesizing your performance data to generate a custom roadmap."}"
                                </h2>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Adaptive Intelligence Engine v2.1</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Interactive Learning Plan */}
                {plan && (
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
                            <div>
                                <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Active Curriculum</h2>
                                <p className="text-2xl font-black tracking-tight italic">Structured Weekly <span className="text-indigo-400">Targets</span></p>
                            </div>
                            <div className="flex gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
                                {Object.keys(plan.plan_data).sort((a, b) => {
                                    const numA = parseInt(a.replace(/\D/g, '')) || 0;
                                    const numB = parseInt(b.replace(/\D/g, '')) || 0;
                                    return numA - numB;
                                }).map((week) => (
                                    <button
                                        key={week}
                                        onClick={() => setActiveWeek(week)}
                                        className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all ${activeWeek === week
                                            ? "bg-white text-black shadow-lg"
                                            : "text-gray-500 hover:text-white"
                                            }`}
                                    >
                                        {week.split(':')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-xl overflow-hidden divide-y divide-white/5">
                            {activeWeek && Object.entries(plan.plan_data[activeWeek]).sort((a, b) => {
                                const numA = parseInt(a[0].replace(/\D/g, '')) || 0;
                                const numB = parseInt(b[0].replace(/\D/g, '')) || 0;
                                return numA - numB;
                            }).map(([day, tasks]) => {
                                const isToday = day === todayLabel;
                                return (
                                    <div key={day} className={`group ${isToday ? "bg-white/5" : "hover:bg-white/[0.02]"} transition-colors`}>
                                        <div className="flex flex-col md:flex-row md:items-start p-10 gap-12">
                                            <div className="w-32 shrink-0 space-y-2">
                                                <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${isToday ? "text-indigo-400" : "text-gray-600 group-hover:text-gray-400"}`}>
                                                    {day}
                                                </h4>
                                                {isToday && (
                                                    <span className="inline-flex px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                                        Today
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                {(tasks as string[]).map((task: string, i: number) => {
                                                    const taskKey = `${activeWeek}:${day}:${i}`;
                                                    const isDone = plan.completed_tasks?.includes(taskKey);
                                                    return (
                                                        <div
                                                            key={i}
                                                            onClick={() => toggleTask(taskKey)}
                                                            className="flex items-center gap-6 cursor-pointer group/task"
                                                        >
                                                            <div className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all duration-300 ${isDone
                                                                ? "bg-indigo-500 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                                                                : "border-white/10 group-hover/task:border-white/30 bg-white/5"
                                                                }`}>
                                                                {isDone && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>}
                                                            </div>
                                                            <span className={`text-base font-medium transition-all duration-300 ${isDone ? "text-gray-600 line-through" : "text-gray-300 group-hover/task:text-white"
                                                                }`}>
                                                                {task}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* 3. Mastery & Expertise Overview */}
                {masteryData && masteryData.mastery.length > 0 && (
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] px-2">Mastery & Expertise Status</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Topic Proficiency */}
                            <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl space-y-10">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Topic Proficiency Index</h3>
                                <div className="space-y-8">
                                    {masteryData.mastery.map((m, idx) => (
                                        <div key={idx} className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-4">
                                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">{m.topic}</label>
                                                    {m.streak > 1 && (
                                                        <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-[8px] font-black uppercase tracking-widest border border-orange-500/20 rounded-full">🔥 {m.streak} Day Streak</span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-black text-white italic">{m.mastery_score}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all duration-1000 ease-out"
                                                    style={{ width: `${m.mastery_score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Error Patterns & Reviews */}
                            <div className="space-y-8">
                                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl h-full space-y-8">
                                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Detected Error Patterns</h3>
                                    <div className="space-y-6">
                                        {masteryData.errors.length > 0 ? (
                                            masteryData.errors.map((e, idx) => {
                                                const needsReview = e.occurrence_count >= 3;
                                                return (
                                                    <div key={idx} className={`p-6 rounded-2xl border transition-all ${needsReview ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">{e.topic}</span>
                                                            {needsReview && (
                                                                <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">Critical Review</span>
                                                            )}
                                                        </div>
                                                        <p className={`text-sm font-bold leading-relaxed ${needsReview ? "text-red-300" : "text-gray-200"}`}>{e.error_pattern}</p>
                                                        <p className="text-[9px] text-gray-500 font-bold mt-4 uppercase tracking-[0.2em]">Recurrence Frequency: {e.occurrence_count}</p>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="h-40 flex flex-col items-center justify-center text-center opacity-40">
                                                <p className="text-xs text-gray-500 italic">No significant deviations detected.</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Performance consistent</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 4. Diagnostic Overview */}
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] px-2">Learner Priorities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[30px] backdrop-blur-md space-y-4">
                            <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Self-Defined Focus</h3>
                            <p className="text-sm font-bold text-gray-200 leading-relaxed italic">"{profile?.custom_focus || "No specific priorities provided."}"</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[30px] backdrop-blur-md space-y-4">
                            <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Daily Commitment</h3>
                            <p className="text-xl font-black text-indigo-400">{profile?.daily_minutes || 0} <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">mins / day</span></p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[30px] backdrop-blur-md space-y-4">
                            <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Competency Areas</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile?.focus_areas?.map((area, i) => (
                                    <span key={i} className="text-[9px] font-bold bg-white/5 text-gray-400 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">{area}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Action */}
                {!plan ? (
                    <div className="pt-20 text-center pb-20">
                        <button
                            onClick={handleInitialize}
                            className="group relative px-16 py-6 rounded-2xl font-black text-sm text-white transition-all transform active:scale-95 overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                boxShadow: '0 20px 40px -10px rgba(99,102,241,0.5)'
                            }}
                        >
                            <span className="relative z-10 uppercase tracking-[0.3em]">Initialize First Lesson</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <p className="pt-8 text-[10px] text-gray-700 font-bold uppercase tracking-[0.5em]">Academic Framework v2.1 • Cloud Core Synched</p>
                    </div>
                ) : (
                    <div className="pt-20 text-center pb-20 text-[10px] text-gray-800 font-black uppercase tracking-[0.5em] animate-pulse">
                        Active Education Cycle Engaged
                    </div>
                )}
            </main>
        </div>
    );
}
