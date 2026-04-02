import React from "react";
import { OnboardingData } from "./OnboardingFlow";

export function SummaryStep({
    data,
    onBack,
    onComplete,
    isLoading,
    isSuccess
}: {
    data: OnboardingData;
    onBack: () => void;
    onComplete: () => void;
    isLoading?: boolean;
    isSuccess?: boolean;
}) {
    if (isSuccess) {
        return (
            <div className="space-y-10 py-16 text-center animate-in fade-in zoom-in duration-700">
                <div className="relative inline-flex mb-8">
                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                    <div className="relative z-10 w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-5xl font-extrabold text-white tracking-tight">
                    You're <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">ready!</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
                    Your personalized learning plan is being generated. Redirecting you to your dashboard...
                </p>
                <div className="pt-4">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-3">
                <h2 className="text-4xl font-extrabold text-white tracking-tight">
                    Profile <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Summary</span>
                </h2>
                <p className="text-gray-400 text-lg font-medium">Review your choices before we generate your plan.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-10 space-y-8">
                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Learning Goal</span>
                        <span className="text-white font-bold bg-indigo-500/10 px-4 py-2 rounded-2xl text-indigo-400 border border-indigo-500/20">{data.goal}</span>
                    </div>

                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Identified Proficiency</span>
                        <span className="text-white font-bold bg-pink-500/10 px-4 py-2 rounded-2xl text-pink-400 border border-pink-500/20">
                            {data.manualLevel ? `${data.manualLevel} Level` : "Assessment Result"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Daily Commitment</span>
                        <span className="text-white font-bold text-lg">{data.dailyMinutes} <span className="text-gray-500 text-sm font-normal">minutes</span></span>
                    </div>

                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Learning Style</span>
                        <span className="text-white font-bold">{data.learningStyle}</span>
                    </div>

                    <div className="space-y-4 pb-6 border-b border-white/5">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] block">Interests</span>
                        <div className="flex flex-wrap gap-2">
                            {data.interests.length > 0 ? data.interests.map(i => (
                                <span key={i} className="px-3 py-1.5 bg-white/5 rounded-xl text-xs font-bold text-gray-300 border border-white/5">
                                    {i}
                                </span>
                            )) : <span className="text-gray-600 text-sm">None selected</span>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] block">Focus Areas</span>
                        <div className="flex flex-wrap gap-2">
                            {data.focusAreas.length > 0 ? data.focusAreas.map(a => (
                                <span key={a} className="px-3 py-1.5 bg-pink-500/5 rounded-xl text-xs font-bold text-pink-400 border border-pink-500/10">
                                    {a}
                                </span>
                            )) : <span className="text-gray-600 text-sm">None selected</span>}
                        </div>
                    </div>

                    {data.customFocus && (
                        <div className="mt-8 p-6 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 rounded-3xl border border-white/5">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] block mb-3 text-center">Custom Objectives</span>
                            <p className="text-gray-300 text-center font-medium italic leading-relaxed">
                                "{data.customFocus}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-6 space-y-4 pb-12">
                <button
                    onClick={onComplete}
                    disabled={isLoading}
                    className="group relative w-full py-6 rounded-[30px] font-black text-xl text-white transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        boxShadow: '0 20px 40px -10px rgba(99,102,241,0.5)'
                    }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-3 tracking-tight">
                        {isLoading ? (
                            <>
                                <div className="h-6 w-6 animate-spin rounded-full border-3 border-solid border-white border-r-transparent" />
                                Customizing Your Plan...
                            </>
                        ) : (
                            <>
                                Finalize & Create Plan
                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="w-full py-5 rounded-[25px] bg-white/5 text-gray-400 font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                    Back to Edit
                </button>
            </div>
        </div>
    );
}

