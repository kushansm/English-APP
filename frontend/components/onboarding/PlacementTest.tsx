"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

type Question = {
    id: number;
    question_text: string;
    options: string[] | null;
    skill: string;
};

type SkillScore = {
    skill: string;
    score: number;
};

type AssessmentResult = {
    cefr_level: string;
    overall_score: number;
    skill_scores: SkillScore[];
};

type TestState = {
    status: "in_progress" | "completed";
    question?: Question;
    progress?: {
        current: number;
        total: number;
    };
    result?: AssessmentResult;
};

export function PlacementTest({ onComplete }: { onComplete: () => void }) {
    const [state, setState] = useState<TestState | null>(null);
    const [loading, setLoading] = useState(true);
    const [textAnswer, setTextAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        startTest();
    }, []);

    const startTest = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/onboarding/assessment/start", {
                method: "POST"
            });
            const data = await res.json();
            setState(data);
        } catch (err) {
            console.error("Test start error:", err);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async (answer: string) => {
        if (!answer || !state?.question || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await apiFetch("/onboarding/assessment/answer", {
                method: "POST",
                body: JSON.stringify({
                    question_id: state.question.id,
                    answer: answer
                })
            });
            const data = await res.json();
            setState(data);
            setTextAnswer("");
        } catch (err) {
            console.error("Answer submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500"></div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Initializing AI Diagnostic...</p>
            </div>
        );
    }

    if (state?.status === "completed" && state.result) {
        return (
            <div className="max-w-md mx-auto space-y-10 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-4">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">Assessment Complete</span>
                    <div className="relative inline-block mt-4">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                        <div className="relative z-10 text-8xl font-black text-white tracking-tighter italic">
                            {state.result.cefr_level}
                        </div>
                    </div>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed">
                        Your proficiency level is confirmed as <span className="text-white font-bold">{state.result.cefr_level}</span>.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 p-8 space-y-8">
                    {state.result.skill_scores.map((skill) => (
                        <div key={skill.skill} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>{skill.skill}</span>
                                <span className="text-gray-300">{skill.score}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                    style={{ width: `${skill.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onComplete}
                    className="group relative w-full py-6 rounded-[30px] font-black text-xl text-white transition-all transform active:scale-[0.98] overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        boxShadow: '0 20px 40px -10px rgba(99,102,241,0.5)'
                    }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-3 tracking-tight">
                        Continue to Preferences
                        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        );
    }

    if (!state?.question) return null;

    const isFillInBlank = !state.question.options || state.question.options.length === 0;

    return (
        <div className="max-w-xl mx-auto space-y-12 py-4 animate-in fade-in duration-500">
            {/* Progress */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white tracking-tighter">
                            {state.progress?.current}
                        </span>
                        <span className="text-gray-600 font-bold text-xl uppercase tracking-widest italic">
                            / {state.progress?.total}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                            AI Diagnostic Engine
                        </span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Module • {state.question.skill}
                        </span>
                    </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        style={{ width: `${(state.progress!.current / state.progress!.total) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Area */}
            <div className="space-y-10 min-h-[300px] flex flex-col justify-center">
                <h3 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                    {state.question.question_text}
                </h3>

                {isFillInBlank ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={textAnswer}
                            onChange={(e) => setTextAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submitAnswer(textAnswer)}
                            placeholder="Type your response..."
                            autoFocus
                            className="w-full py-6 text-3xl font-bold bg-transparent border-b-2 border-white/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-700 text-white"
                        />
                        <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-[9px]">
                            <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10">Enter</kbd>
                            <span>to confirm answer</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {state.question.options?.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => submitAnswer(option)}
                                disabled={isSubmitting}
                                className="group relative p-6 rounded-[30px] bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left flex items-center gap-6 disabled:opacity-50 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black text-gray-400 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-xl font-bold text-gray-300 group-hover:text-white transition-colors">
                                    {option}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="pt-8 text-center">
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] font-black">
                    Linguapath Academic Standard • V4.2
                </p>
            </div>
        </div>
    );
}
