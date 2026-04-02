import React from "react";

export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Onboarding Progress</span>
                    <span className="text-2xl font-black text-white tracking-tighter italic">
                        {Math.round(percentage)}% <span className="text-gray-700 font-normal">Complete</span>
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        Step {currentStep} <span className="text-gray-500">of</span> {totalSteps}
                    </span>
                </div>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

