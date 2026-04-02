import React from "react";

export function TestStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    return (
        <div className="space-y-8 py-4 text-center">
            <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Let’s understand your English</h2>
                <p className="text-lg text-slate-600 max-w-md mx-auto">
                    Take a quick AI-powered diagnostic test to personalize your learning plan.
                </p>
            </div>

            <div className="pt-8 space-y-4">
                <button
                    onClick={onNext}
                    className="w-full py-4 px-6 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform active:scale-[0.98]"
                >
                    Start Diagnostic Test
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
