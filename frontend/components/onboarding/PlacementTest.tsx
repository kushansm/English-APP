"use client";

import React, { useState, useEffect } from "react";

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
            const res = await fetch("http://127.0.0.1:8000/api/onboarding/assessment/start", {
                method: "POST",
                headers: { "Accept": "application/json" }
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
            const res = await fetch("http://127.0.0.1:8000/api/onboarding/assessment/answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
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
            <div className="flex flex-col items-center justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
            </div>
        );
    }

    if (state?.status === "completed" && state.result) {
        return (
            <div className="max-w-md mx-auto space-y-8 py-12 animate-in fade-in duration-700">
                <div className="text-center space-y-2">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Assessment Complete</h2>
                    <div className="text-6xl font-black text-slate-900">{state.result.cefr_level}</div>
                    <p className="text-slate-500 font-medium italic">Confirmed Proficiency Level</p>
                </div>

                <div className="space-y-6 pt-8">
                    {state.result.skill_scores.map((skill) => (
                        <div key={skill.skill} className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-slate-600">
                                <span>{skill.skill}</span>
                                <span>{skill.score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-slate-800 rounded-full transition-all duration-1000"
                                    style={{ width: `${skill.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onComplete}
                    className="w-full mt-12 py-4 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                    Continue to Preferences
                </button>
            </div>
        );
    }

    if (!state?.question) return null;

    const isFillInBlank = !state.question.options || state.question.options.length === 0;

    return (
        <div className="max-w-xl mx-auto space-y-12 py-8">
            {/* Progress */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-3xl font-black text-slate-900">
                        {state.progress?.current}
                        <span className="text-slate-200 ml-1 italic font-normal text-xl">/ {state.progress?.total}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1">
                        Adaptive Assessment • {state.question.skill}
                    </span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-slate-800 transition-all duration-500"
                        style={{ width: `${(state.progress!.current / state.progress!.total) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Area */}
            <div className="space-y-10">
                <h3 className="text-2xl font-medium text-slate-800 leading-relaxed">
                    {state.question.question_text}
                </h3>

                {isFillInBlank ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={textAnswer}
                            onChange={(e) => setTextAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submitAnswer(textAnswer)}
                            placeholder="Type your answer here..."
                            autoFocus
                            className="w-full p-4 text-xl border-b-2 border-slate-200 focus:border-slate-800 outline-none bg-transparent transition-colors placeholder:text-slate-200"
                        />
                        <p className="text-xs text-slate-400 italic">Press Enter to submit</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {state.question.options?.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => submitAnswer(option)}
                                disabled={isSubmitting}
                                className="group p-5 rounded-xl border border-slate-100 bg-white hover:border-slate-800 hover:bg-slate-50 transition-all duration-150 text-left flex items-center gap-6 disabled:opacity-50"
                            >
                                <span className="text-xs font-bold text-slate-300 group-hover:text-slate-800 transition-colors uppercase tracking-widest">
                                    Option {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-lg font-medium text-slate-700 group-hover:text-slate-900 font-serif">
                                    {option}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Minimal Subtext */}
            <div className="pt-12 text-center">
                <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em] font-bold">
                    English Proficiency Diagnostic • Academic Standard
                </p>
            </div>
        </div>
    );
}
