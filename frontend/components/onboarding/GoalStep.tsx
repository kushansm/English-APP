import React from "react";

const GOALS = [
    { id: "General", title: "General English", desc: "Improve daily communication and confidence.", emoji: "🌍" },
    { id: "Business", title: "Business English", desc: "Scale your career with professional communication.", emoji: "💼" },
    { id: "IELTS", title: "IELTS Preparation", desc: "Prepare for the International English Language Testing System.", emoji: "📝" },
    { id: "TOEFL", title: "TOEFL Preparation", desc: "Prepare for the Test of English as a Foreign Language.", emoji: "🎓" },
];

export function GoalStep({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-3">
                <h2 className="text-4xl font-extrabold text-white tracking-tight">
                    What is your <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">learning goal?</span>
                </h2>
                <p className="text-gray-400 text-lg">Choose the path that best matches your objectives.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                {GOALS.map((goal) => (
                    <button
                        key={goal.id}
                        onClick={() => onChange(goal.id)}
                        className={`group relative flex flex-col items-start p-6 rounded-3xl border transition-all duration-300 text-left overflow-hidden ${value === goal.id
                            ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                            : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                            }`}
                    >
                        {/* Status ring */}
                        <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all ${value === goal.id ? "border-indigo-400 bg-indigo-400" : "border-white/10"
                            }`}>
                            {value === goal.id && (
                                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white p-0.5" stroke="currentColor" strokeWidth="4">
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>

                        <span className="text-3xl mb-3">{goal.emoji}</span>
                        <span className={`text-xl font-bold transition-colors ${value === goal.id ? "text-white" : "text-gray-200"}`}>
                            {goal.title}
                        </span>
                        <span className="text-sm text-gray-400 mt-2 leading-relaxed">{goal.desc}</span>

                        {/* Active glow */}
                        {value === goal.id && (
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 pointer-events-none" />
                        )}
                    </button>
                ))}
            </div>

            <div className="pt-10">
                <button
                    onClick={onNext}
                    disabled={!value}
                    className="w-full py-5 rounded-2xl font-bold text-lg text-white transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        boxShadow: value ? '0 10px 40px -10px rgba(99,102,241,0.5)' : 'none'
                    }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Continue to Level Check
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </div>
    );
}

