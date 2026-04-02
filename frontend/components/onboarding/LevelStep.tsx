import React from "react";

const LEVELS = [
    { id: "A1", label: "Beginner", desc: "Basic phrases and simple sentences" },
    { id: "A2", label: "Elementary", desc: "Simple everyday topics and tasks" },
    { id: "B1", label: "Intermediate", desc: "Familiar matters and personal interests" },
    { id: "B2", label: "Upper Intermediate", desc: "Complex texts and abstract topics" },
    { id: "C1", label: "Advanced", desc: "Demanding texts and implicit meaning" },
    { id: "C2", label: "Proficient", desc: "Near-native fluency and precision" },
];

interface LevelStepProps {
    manualLevel: string | null;
    onSelectManual: (level: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export function LevelStep({ manualLevel, onSelectManual, onNext, onBack }: LevelStepProps) {
    return (
        <div className="space-y-12 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4 text-center">
                <h2 className="text-4xl font-extrabold text-white tracking-tight italic">
                    Level <span className="text-indigo-400">Assurance</span>
                </h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                    Choose your diagnostic path
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Path A: Diagnostic Test (Recommended) */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="space-y-6">
                        <div className="h-14 w-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black italic">Precision Evaluation</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Take a 5-minute adaptive test to determine your exact CEFR placement and identify knowledge gaps.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            onSelectManual(""); // Clear manual level to ensure quiz path
                            onNext();
                        }}
                        className="mt-10 group relative w-full py-4 rounded-2xl font-black text-xs text-white uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Start Diagnostic <span className="text-lg">→</span>
                        </span>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>

                {/* Path B: Manual Selection */}
                <div className="bg-[#0a0c14] border border-white/5 p-10 rounded-[40px] space-y-8 flex flex-col justify-between">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black italic text-gray-300">Manual Placement</h3>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Select your current identified level</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {LEVELS.map((lvl) => (
                            <button
                                key={lvl.id}
                                onClick={() => onSelectManual(lvl.id)}
                                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all group/btn ${manualLevel === lvl.id
                                    ? "bg-indigo-500/10 border-indigo-500/50"
                                    : "bg-white/5 border-white/5 hover:bg-white/10"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm font-black italic transition-colors ${manualLevel === lvl.id ? "text-indigo-400" : "text-gray-500 group-hover/btn:text-gray-300"}`}>{lvl.id}</span>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold">{lvl.label}</p>
                                        <p className="text-[9px] text-gray-600 uppercase tracking-tighter font-bold">{lvl.desc}</p>
                                    </div>
                                </div>
                                {manualLevel === lvl.id && (
                                    <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {manualLevel && (
                        <button
                            onClick={onNext}
                            className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-gray-200 active:scale-95"
                        >
                            Confirm Selection
                        </button>
                    )}
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    onClick={onBack}
                    className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-[0.3em] transition-colors"
                >
                    &larr; Return to Objectives
                </button>
            </div>
        </div>
    );
}
