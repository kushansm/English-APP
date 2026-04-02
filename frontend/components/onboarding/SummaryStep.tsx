import React from "react";
import { OnboardingData } from "./OnboardingFlow";

export function SummaryStep({
    data,
    onBack,
    onComplete
}: {
    data: OnboardingData;
    onBack: () => void;
    onComplete: () => void
}) {
    return (
        <div className="space-y-8 py-4">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profile Summary</h2>
                <p className="mt-2 text-slate-500">Review your choices before we generate your plan.</p>
            </div>

            <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-sm">
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Learning Goal</span>
                        <span className="text-slate-900 font-bold bg-sky-50 px-3 py-1 rounded-lg text-sky-700">{data.goal}</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Daily Commitment</span>
                        <span className="text-slate-900 font-bold">{data.dailyMinutes} minutes</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Learning Style</span>
                        <span className="text-slate-900 font-bold">{data.learningStyle}</span>
                    </div>

                    <div className="space-y-2 pb-4 border-b border-slate-50">
                        <span className="text-slate-500 font-medium block">Interests</span>
                        <div className="flex flex-wrap gap-2">
                            {data.interests.length > 0 ? data.interests.map(i => (
                                <span key={i} className="px-2 py-1 bg-slate-100 rounded-md text-xs font-semibold text-slate-600">
                                    {i}
                                </span>
                            )) : <span className="text-slate-400 text-sm">None selected</span>}
                        </div>
                    </div>

                    <div className="space-y-2 pb-4 border-b border-slate-50">
                        <span className="text-slate-500 font-medium block">Focus Areas</span>
                        <div className="flex flex-wrap gap-2">
                            {data.focusAreas.length > 0 ? data.focusAreas.map(a => (
                                <span key={a} className="px-2 py-1 bg-indigo-50 rounded-md text-xs font-semibold text-indigo-600">
                                    {a}
                                </span>
                            )) : <span className="text-slate-400 text-sm">None selected</span>}
                        </div>
                    </div>

                    {data.customFocus && (
                        <div className="space-y-2">
                            <span className="text-slate-500 font-medium block">Additional Focus</span>
                            <p className="text-sm text-slate-700 italic bg-slate-50 p-3 rounded-xl">
                                "{data.customFocus}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-8 space-y-4 pb-12">
                <button
                    onClick={onComplete}
                    className="w-full py-5 px-6 rounded-2xl bg-sky-600 text-white font-bold text-lg hover:bg-sky-700 transition-all duration-200 shadow-lg hover:shadow-sky-500/20 transform active:scale-[0.98]"
                >
                    Generate My Learning Plan
                </button>
                <button
                    onClick={onBack}
                    className="w-full py-4 px-6 rounded-2xl bg-white text-slate-600 font-semibold border-2 border-slate-100 hover:bg-slate-50 transition-all duration-200"
                >
                    Back
                </button>
            </div>
        </div>
    );
}
