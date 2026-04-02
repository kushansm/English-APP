import React from "react";

const GOALS = [
    { id: "General", title: "General English", desc: "Improve daily communication and confidence." },
    { id: "Business", title: "Business English", desc: "Scale your career with professional communication." },
    { id: "Academic", title: "Academic English", desc: "Prepare for studies in English-speaking institutions." },
    { id: "IELTS", title: "IELTS Preparation", desc: "Get ready for the International English Language Testing System." },
    { id: "TOEFL", title: "TOEFL Preparation", desc: "Prepare for the Test of English as a Foreign Language." },
];

export function GoalStep({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">What is your learning goal?</h2>
                <p className="mt-2 text-slate-500">Select the option that best describes your objective.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-8">
                {GOALS.map((goal) => (
                    <button
                        key={goal.id}
                        onClick={() => onChange(goal.id)}
                        className={`flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-200 ${value === goal.id
                                ? "border-sky-500 bg-sky-50 ring-4 ring-sky-500/10"
                                : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                            }`}
                    >
                        <span className={`text-lg font-bold ${value === goal.id ? "text-sky-700" : "text-slate-800"}`}>
                            {goal.title}
                        </span>
                        <span className="text-sm text-slate-500 mt-1">{goal.desc}</span>
                    </button>
                ))}
            </div>

            <div className="pt-6">
                <button
                    onClick={onNext}
                    disabled={!value}
                    className="w-full py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all duration-200 shadow-lg hover:shadow-xl transform active:scale-[0.98]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
