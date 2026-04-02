import React from "react";

export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs font-semibold text-sky-600">{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                    className="h-full bg-sky-500 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
