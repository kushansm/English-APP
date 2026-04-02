import React from "react";

export function LevelStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    return (
        <div className="space-y-8 py-4">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 text-sky-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quick estimation (optional)</h2>
                <p className="text-lg text-slate-600 max-w-md mx-auto">
                    We will adjust your level with a short test later. For now, we can skip this step or use a quick assessment.
                </p>
            </div>

            <div className="pt-8 space-y-4">
                <button
                    onClick={onNext}
                    className="w-full py-4 px-6 rounded-2xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-all duration-200 shadow-lg hover:shadow-xl transform active:scale-[0.98]"
                >
                    Sounds good, let's continue
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
