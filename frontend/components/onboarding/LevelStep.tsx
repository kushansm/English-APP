import React from "react";

export function LevelStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    return (
        <div className="space-y-12 py-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)] text-indigo-400 mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">
                    Level <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Assessment</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                    To build your perfect roadmap, we need to understand your current English proficiency.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                <button
                    onClick={onNext}
                    className="group relative w-full py-5 px-6 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        boxShadow: '0 10px 40px -10px rgba(99,102,241,0.5)'
                    }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Get Started
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                    onClick={onBack}
                    className="w-full py-4 px-6 rounded-2xl bg-white/5 text-gray-400 font-semibold border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                    Go Back
                </button>
            </div>

            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                Takes approximately 5-7 minutes
            </p>
        </div>
    );
}

