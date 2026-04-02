"use client";

import React, { useState, useEffect } from "react";

type Question = {
    id: number;
    question_text: string;
    options: string[];
    skill: string;
};

type TestState = {
    status: "in_progress" | "completed";
    question?: Question;
    progress?: {
        current: number;
        total: number;
    };
    result?: any;
};

export function PlacementTest({ onComplete }: { onComplete: () => void }) {
    const [state, setState] = useState<TestState | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
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

    const submitAnswer = async () => {
        if (!selectedOption || !state?.question) return;

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
                    answer: selectedOption
                })
            });
            const data = await res.json();

            if (data.status === "completed") {
                onComplete();
            } else {
                setState(data);
                setSelectedOption(null);
            }
        } catch (err) {
            console.error("Answer submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-slate-500 font-medium italic">Preparing your personalized test...</p>
            </div>
        );
    }

    if (!state?.question) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Header */}
            <div className="flex justify-between items-center bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
                <span className="text-sm font-bold text-indigo-700">Question {state.progress?.current} of {state.progress?.total}</span>
                <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{state.question.skill}</span>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-8">
                    {state.question.question_text}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                    {state.question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedOption(option)}
                            className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 text-left font-bold flex items-center gap-4 ${selectedOption === option
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100"
                                    : "border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-600"
                                }`}
                        >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${selectedOption === option ? "bg-indigo-600 text-white" : "bg-white text-slate-400 group-hover:bg-slate-200"
                                }`}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Footer */}
            <div className="flex gap-4">
                <button
                    onClick={submitAnswer}
                    disabled={!selectedOption || isSubmitting}
                    className="flex-grow py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>}
                    {state.progress?.current === state.progress?.total ? "Finish Test" : "Next Question"}
                </button>
            </div>
        </div>
    );
}
