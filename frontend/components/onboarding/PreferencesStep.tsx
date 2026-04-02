import React from "react";
import { OnboardingData } from "./OnboardingFlow";

const INTERESTS = ["Technology", "Business", "Entertainment", "Travel", "Science", "Music", "Art", "Culture", "Sports", "Gaming"];
const FOCUS_AREAS = ["Speaking", "Listening", "Reading", "Writing", "Vocabulary", "Grammar", "Pronunciation"];

export function PreferencesStep({
    data,
    onChange,
    onNext,
    onBack
}: {
    data: OnboardingData;
    onChange: (d: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void
}) {

    const toggleInterest = (interest: string) => {
        const next = data.interests.includes(interest)
            ? data.interests.filter(i => i !== interest)
            : [...data.interests, interest];
        onChange({ interests: next });
    };

    const toggleFocus = (area: string) => {
        const next = data.focusAreas.includes(area)
            ? data.focusAreas.filter(a => a !== area)
            : [...data.focusAreas, area];
        onChange({ focusAreas: next });
    };

    return (
        <div className="space-y-8 py-4">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Preferences</h2>
                <p className="mt-2 text-slate-500">Customize your learning experience.</p>
            </div>

            <div className="space-y-8">
                {/* Daily Time */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Daily study time</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {[10, 20, 30, 60].map(mins => (
                            <button
                                key={mins}
                                onClick={() => onChange({ dailyMinutes: mins })}
                                className={`py-3 px-2 rounded-xl border-2 font-bold transition-all duration-200 ${data.dailyMinutes === mins
                                    ? "border-sky-500 bg-sky-50 text-sky-700"
                                    : "border-slate-100 bg-white hover:border-slate-200 text-slate-600"
                                    }`}
                            >
                                {mins}m
                            </button>
                        ))}
                    </div>
                </section>

                {/* Learning Style */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Learning style</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {["Active", "Passive", "Balanced"].map(style => (
                            <button
                                key={style}
                                onClick={() => onChange({ learningStyle: style as any })}
                                className={`py-3 px-2 rounded-xl border-2 font-bold transition-all duration-200 ${data.learningStyle === style
                                    ? "border-sky-500 bg-sky-50 text-sky-700"
                                    : "border-slate-100 bg-white hover:border-slate-200 text-slate-600"
                                    }`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Interests */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Interests</h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {INTERESTS.map(interest => (
                            <button
                                key={interest}
                                onClick={() => toggleInterest(interest)}
                                className={`py-1.5 px-4 rounded-full border-2 font-semibold transition-all duration-200 ${data.interests.includes(interest)
                                    ? "border-sky-500 bg-sky-500 text-white"
                                    : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                                    }`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Focus Areas */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Focus areas</h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {FOCUS_AREAS.map(area => (
                            <button
                                key={area}
                                onClick={() => toggleFocus(area)}
                                className={`py-1.5 px-4 rounded-full border-2 font-semibold transition-all duration-200 ${data.focusAreas.includes(area)
                                    ? "border-sky-500 bg-sky-500 text-white"
                                    : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                                    }`}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Custom Focus */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Anything specific?</h3>
                    <textarea
                        value={data.customFocus}
                        onChange={(e) => onChange({ customFocus: e.target.value })}
                        placeholder="Tell us what you want to focus on..."
                        className="w-full h-24 p-4 rounded-xl border-2 border-slate-100 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 bg-white placeholder:text-slate-400 text-slate-700"
                    />
                </section>
            </div>

            <div className="pt-8 space-y-4 pb-12">
                <button
                    onClick={onNext}
                    className="w-full py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all duration-200 shadow-lg"
                >
                    Review Summary
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
