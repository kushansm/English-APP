"use client";

import React, { useEffect, useState } from "react";

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

export default function LearningProfileScreen() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [plan, setPlan] = useState<LearningPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeWeek, setActiveWeek] = useState<string | null>(null);

    // Get current day of week (1-7, where 1 is Monday)
    const todayNum = new Date().getDay() || 7;
    const todayLabel = `Day ${todayNum}`;

    useEffect(() => {
        async function fetchData() {
            try {
                const [profileRes, assessmentRes, planRes] = await Promise.all([
                    fetch("http://127.0.0.1:8000/api/onboarding/profile/latest", {
                        headers: { "Accept": "application/json" }
                    }),
                    fetch("http://127.0.0.1:8000/api/onboarding/assessment/result", {
                        headers: { "Accept": "application/json" }
                    }),
                    fetch("http://127.0.0.1:8000/api/plan", {
                        headers: { "Accept": "application/json" }
                    })
                ]);

                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                if (assessmentRes.ok) {
                    const assessmentData = await assessmentRes.json();
                    setAssessment(assessmentData);
                }

                if (planRes.ok) {
                    const planData = await planRes.json();
                    setPlan(planData);
                    setActiveWeek(Object.keys(planData.plan_data)[0]);
                } else if (planRes.status === 404) {
                    console.log("Learning plan not yet generated.");
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
            const res = await fetch("http://127.0.0.1:8000/api/plan/generate", {
                method: "POST",
                headers: { "Accept": "application/json" }
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
            ? currentCompleted.filter(k => k !== taskKey)
            : [...currentCompleted, taskKey];

        setPlan({ ...plan, completed_tasks: nextCompleted });

        try {
            const res = await fetch("http://127.0.0.1:8000/api/plan/task/toggle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
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
            <div className="min-h-screen bg-white flex items-center justify-center font-sans">
                <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-slate-200">
            {/* Minimal Header */}
            <header className="bg-white border-b border-slate-200 py-6">
                <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-slate-900 flex items-center justify-center text-white font-bold text-xs">LP</div>
                        <h1 className="text-lg font-bold tracking-tight uppercase">Learning Profile</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{profile?.target_exam} Objective</p>
                        <p className="text-sm font-medium">{assessment?.cefr_level || "N/A"} Proficiency</p>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-800 p-4 text-xs font-bold uppercase tracking-widest">
                        {error}
                    </div>
                )}

                {/* 1. AI Summary Card */}
                <section className="space-y-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">AI Performance Synthesis</h2>
                    <div className="bg-slate-900 text-white p-10 rounded shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <p className="text-xl font-serif leading-relaxed italic text-slate-100 max-w-2xl">
                                "{profile?.ai_summary || "Our AI is currently synthesizing your performance data to generate a custom roadmap."}"
                            </p>
                            <div className="pt-4 flex items-center gap-2">
                                <div className="h-0.5 w-6 bg-slate-700"></div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Adaptive Tutor Intelligence</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Interactive Learning Plan */}
                {plan && (
                    <section className="space-y-8 border-t border-slate-200 pt-12">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Curricullum</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Structured Weekly Targets</p>
                            </div>
                            <div className="flex gap-2 bg-white p-1 border border-slate-200">
                                {Object.keys(plan.plan_data).map((week) => (
                                    <button
                                        key={week}
                                        onClick={() => setActiveWeek(week)}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] transition-all ${activeWeek === week
                                                ? "bg-slate-900 text-white"
                                                : "text-slate-400 hover:text-slate-900"
                                            }`}
                                    >
                                        {week.split(':')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 divide-y divide-slate-100">
                            {activeWeek && Object.entries(plan.plan_data[activeWeek]).map(([day, tasks]) => {
                                const isToday = day === todayLabel;
                                return (
                                    <div key={day} className={`group ${isToday ? "bg-slate-50/50" : ""}`}>
                                        <div className="flex flex-col md:flex-row md:items-start p-8 gap-8">
                                            <div className="w-24 shrink-0 space-y-1">
                                                <h4 className={`text-xs font-black uppercase tracking-widest ${isToday ? "text-slate-900" : "text-slate-300 group-hover:text-slate-400"}`}>
                                                    {day}
                                                </h4>
                                                {isToday && (
                                                    <span className="inline-block px-1.5 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-tighter">
                                                        Today
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                {tasks.map((task, i) => {
                                                    const taskKey = `${activeWeek}:${day}:${i}`;
                                                    const isDone = plan.completed_tasks?.includes(taskKey);
                                                    return (
                                                        <div
                                                            key={i}
                                                            onClick={() => toggleTask(taskKey)}
                                                            className="flex items-center gap-4 cursor-pointer group/task"
                                                        >
                                                            <div className={`h-4 w-4 border flex items-center justify-center transition-all ${isDone
                                                                    ? "bg-slate-900 border-slate-900"
                                                                    : "border-slate-200 group-hover/task:border-slate-400"
                                                                }`}>
                                                                {isDone && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>}
                                                            </div>
                                                            <span className={`text-sm font-medium transition-all ${isDone ? "text-slate-300 line-through" : "text-slate-700 group-hover/task:text-slate-900"
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

                {/* 3. Skill & Data Overview */}
                <section className="space-y-6 border-t border-slate-200 pt-12">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Learner Priorities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white border border-slate-200 p-6 space-y-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Self-Defined Focus</h3>
                            <p className="text-sm font-bold text-slate-800">{profile?.custom_focus || "No specific priorities provided."}</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 space-y-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Commitment</h3>
                            <p className="text-sm font-bold text-slate-800">{profile?.daily_minutes || 0} minutes / session</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 space-y-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Focus Areas</h3>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {profile?.focus_areas?.map((area, i) => (
                                    <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 uppercase">{area}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Action */}
                {!plan ? (
                    <div className="pt-12 text-center pb-12">
                        <button
                            onClick={handleInitialize}
                            className="px-12 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                        >
                            Initialize First Lesson
                        </button>
                        <p className="pt-6 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Academic Framework v1.0 • Data Synchronized</p>
                    </div>
                ) : (
                    <div className="pt-12 text-center pb-12 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                        Learning Plan Activated
                    </div>
                )}
            </main>
        </div>
    );
}
