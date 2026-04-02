import React, { useState } from "react";
import { PlacementTest } from "./PlacementTest";

export function TestStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const [isTesting, setIsTesting] = useState(false);

    if (isTesting) {
        return <PlacementTest onComplete={onNext} />;
    }

    return (
        <div className="space-y-12 py-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-pink-500/10 border border-pink-500/20 shadow-[0_0_40px_rgba(236,72,153,0.1)] text-pink-400 mb-6 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                    </svg>
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">
                    Diagnostic <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">Assessment</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                    This short AI-driven test will pinpoint your exact CEFR level to customize your curriculum.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                <button
                    onClick={() => setIsTesting(true)}
                    className="group relative w-full py-5 px-6 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #6366f1 100%)',
                        boxShadow: '0 10px 40px -10px rgba(236,72,153,0.5)'
                    }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Start Now
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
        </div>
    );
}

