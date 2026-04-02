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

export default function LearningProfileScreen() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [profileRes, assessmentRes] = await Promise.all([
                    fetch("http://127.0.0.1:8000/api/onboarding/profile/latest", {
                        headers: { "Accept": "application/json" }
                    }),
                    fetch("http://127.0.0.1:8000/api/onboarding/assessment/result", {
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
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to synchronize with learning data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

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

                {/* 1. AI Summary Box - Highlighted Card */}
                <section className="space-y-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">AI Performance Synthesis</h2>
                    <div className="bg-slate-900 text-white p-10 rounded shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <p className="text-2xl font-serif leading-relaxed italic text-slate-100">
                                "{profile?.ai_summary || "Our AI is currently synthesizing your performance data to generate a custom roadmap."}"
                            </p>
                            <div className="pt-4 flex items-center gap-2">
                                <div className="h-1 w-8 bg-slate-700"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Adaptive Tutor Intelligence</span>
                            </div>
                        </div>
                        {/* Subtle background graphic */}
                        <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none">
                            <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" /></svg>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                    {/* 2. Skill Breakdown - Precision Bars */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Diagnostic Competencies</h2>
                        <div className="bg-white border border-slate-200 p-8 space-y-8">
                            {assessment?.skill_scores && assessment.skill_scores.length > 0 ? (
                                assessment.skill_scores.map((skill) => (
                                    <div key={skill.skill} className="space-y-3">
                                        <div className="flex justify-between items-baseline">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{skill.skill}</label>
                                            <span className="text-sm font-black text-slate-900">{skill.score}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full bg-slate-900 transition-all duration-1000 ease-out"
                                                style={{ width: `${skill.score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic">Quantitative data pending assessment finalization.</p>
                            )}
                        </div>
                    </section>

                    {/* 3. Recommended Plan - Bullet List */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Strategic Roadmap</h2>
                        <div className="bg-white border border-slate-200 p-8">
                            <ul className="space-y-6">
                                {profile?.learning_plan && profile.learning_plan.length > 0 ? (
                                    profile.learning_plan.map((item, idx) => (
                                        <li key={idx} className="flex gap-4 group">
                                            <span className="text-xs font-black text-slate-300 transition-colors group-hover:text-slate-900">{String(idx + 1).padStart(2, '0')}</span>
                                            <p className="text-sm text-slate-700 leading-relaxed font-medium transition-colors group-hover:text-slate-900">{item}</p>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Actionable insights will appear here after your first lesson.</p>
                                )}
                            </ul>
                        </div>
                    </section>
                </div>

                {/* 4. User Custom Focus */}
                <section className="space-y-6 border-t border-slate-200 pt-12">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Learner Priorities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white border border-slate-200 p-6 space-y-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Self-Defined Focus</h3>
                            <p className="text-sm font-bold text-slate-800">{profile?.custom_focus || "No specific priorities provided."}</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 space-y-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Commitment</h3>
                            <p className="text-sm font-bold text-slate-800">{profile?.daily_minutes} minutes / session</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 space-y-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Focus Areas</h3>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {profile?.focus_areas.map((area, i) => (
                                    <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 uppercase">{area}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Action */}
                <div className="pt-12 text-center">
                    <button className="px-12 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl">
                        Initialize First Lesson
                    </button>
                    <p className="pt-6 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Academic Framework v1.0 • Data Synchronized</p>
                </div>
            </main>
        </div>
    );
}
