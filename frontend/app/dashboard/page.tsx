"use client";

import React, { useEffect, useState } from "react";

type Profile = {
    target_exam: string;
    daily_minutes: number;
    learning_style: string;
    interests: string[];
    focus_areas: string[];
    cefr_level?: string;
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

export default function Dashboard() {
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
                console.error("Dashboard fetch error:", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-sky-600 rounded-xl flex items-center justify-center text-white font-black text-xl">E</div>
                        <span className="text-xl font-bold text-slate-800">Elmali English</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900">John Doe</p>
                            <p className="text-xs text-sky-600 font-medium capitalize">{profile?.learning_style} Learner</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-slate-200 uppercase flex items-center justify-center font-bold text-slate-400">JD</div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-50 border-2 border-red-100 text-red-700 p-4 rounded-2xl mb-8 font-medium">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Welcome Card & AI Summary */}
                        <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h1 className="text-3xl font-extrabold mb-2">Welcome back, John!</h1>
                                <p className="text-sky-100 mb-6 max-w-xl text-lg leading-relaxed italic">
                                    "{profile?.ai_summary || `You're making great progress towards your ${profile?.target_exam} goal. Ready for today's challenge?`}"
                                </p>
                                <button className="bg-white text-sky-700 px-6 py-3 rounded-xl font-bold hover:bg-sky-50 transition-colors">
                                    Start Lesson
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                            </div>
                        </div>

                        {/* AI Recommended Plan */}
                        {profile?.learning_plan && (
                            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-8 w-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">AI Recommended Plan</h2>
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profile.learning_plan.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0"></div>
                                            <span className="text-sm text-slate-700 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Skill Breakdown */}
                        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Skill Breakdown</h2>
                            <div className="space-y-6">
                                {assessment?.skill_scores && assessment.skill_scores.length > 0 ? (
                                    assessment.skill_scores.map((skill) => (
                                        <div key={skill.skill} className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-slate-700 capitalize">{skill.skill}</span>
                                                <span className="text-slate-500">{skill.score}%</span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-sky-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${skill.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 italic">No skill scores available yet. Take a test to see your breakdown.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Level Card */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">Current Level</h3>
                            <div className="w-32 h-32 rounded-full border-8 border-sky-100 flex items-center justify-center text-4xl font-black text-sky-600 mb-4 bg-sky-50">
                                {assessment?.cefr_level || "A1"}
                            </div>
                            <p className="font-bold text-slate-900 mb-1">Advanced Intermediate</p>
                            <p className="text-sm text-slate-500">Based on your latest placement test</p>
                        </div>

                        {/* Daily Commitment */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-slate-900 font-bold mb-4">Learning Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                                    <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Daily Goal</p>
                                        <p className="text-sm font-bold text-slate-900">{profile?.daily_minutes || 20}m / day</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                                    <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Current Streak</p>
                                        <p className="text-sm font-bold text-slate-900">0 Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
