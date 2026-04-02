"use client";

import React, { useState, useEffect } from "react";
import { GoalStep } from "./GoalStep";
import { LevelStep } from "./LevelStep";
import { TestStep } from "./TestStep";
import { PreferencesStep } from "./PreferencesStep";
import { SummaryStep } from "./SummaryStep";
import { ProgressBar } from "../ui/ProgressBar";
import { apiFetch } from "@/lib/api";

import { useAuth } from "@/context/AuthContext";

export type OnboardingData = {
    goal: string;
    levelEstimationSkip: boolean;
    dailyMinutes: number;
    learningStyle: "Active" | "Passive" | "Balanced";
    interests: string[];
    focusAreas: string[];
    customFocus: string;
};

const INITIAL_DATA: OnboardingData = {
    goal: "",
    levelEstimationSkip: false,
    dailyMinutes: 20,
    learningStyle: "Balanced",
    interests: [],
    focusAreas: [],
    customFocus: "",
};

const STEPS = [
    "Goal Selection",
    "Level Assessment",
    "Diagnostic Test",
    "Preferences",
    "Finish",
];

export default function OnboardingFlow() {
    const { updateProfileStatus } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<OnboardingData>(INITIAL_DATA);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("onboarding_progress");
        if (saved) {
            const { step, data } = JSON.parse(saved);
            setCurrentStep(step);
            setFormData(data);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded && !isSuccess) {
            localStorage.setItem(
                "onboarding_progress",
                JSON.stringify({ step: currentStep, data: formData })
            );
        }
    }, [currentStep, formData, isLoaded, isSuccess]);

    const updateFormData = (newData: Partial<OnboardingData>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Map frontend data to backend fields
            const backendData = {
                target_exam: formData.goal,
                target_level: "B1", // Placeholder - will be updated by diagnostic test result in real flow
                daily_minutes: formData.dailyMinutes,
                learning_style: formData.learningStyle.toLowerCase(),
                interests: formData.interests,
                focus_areas: formData.focusAreas,
                custom_focus: formData.customFocus,
                target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
                age_group: "25-34",
            };

            const response = await apiFetch("/onboarding/profile", {
                method: "POST",
                body: JSON.stringify(backendData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (responseData.errors) {
                    const errorMessages = Object.values(responseData.errors).flat().join("\n");
                    throw new Error(errorMessages);
                }
                throw new Error(responseData.message || "Failed to save profile");
            }

            // Trigger Learning Plan Generation
            await apiFetch("/plan/generate", {
                method: "POST"
            });

            // Mark profile as completed in AuthContext
            updateProfileStatus(true);

            setIsSuccess(true);
            localStorage.removeItem("onboarding_progress");

            // Redirect after a delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2500);

        } catch (error) {
            console.error("Submission error:", error);
            alert(error instanceof Error ? error.message : "An error occurred while saving your profile.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-[#07090f] text-white selection:bg-indigo-500/30 overflow-x-hidden pt-6">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12 relative z-10 flex flex-col min-h-screen">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-sm rounded-xl shadow-lg">LP</div>
                        <h1 className="text-xl font-black tracking-tighter uppercase">LinguaPath</h1>
                    </div>
                    {!isSuccess && (
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            Step {currentStep} of {STEPS.length}
                        </div>
                    )}
                </div>

                {!isSuccess && <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} />}

                <div className="flex-grow mt-12">
                    {currentStep === 1 && (
                        <GoalStep
                            value={formData.goal}
                            onChange={(goal) => updateFormData({ goal })}
                            onNext={nextStep}
                        />
                    )}
                    {currentStep === 2 && (
                        <LevelStep
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 3 && (
                        <TestStep
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 4 && (
                        <PreferencesStep
                            data={formData}
                            onChange={updateFormData}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 5 && (
                        <SummaryStep
                            data={formData}
                            onBack={prevStep}
                            onComplete={handleSubmit}
                            isLoading={isLoading}
                            isSuccess={isSuccess}
                        />
                    )}
                </div>

                {!isSuccess && (
                    <div className="mt-12 text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Precision Language Learning &bull; AI Powered
                    </div>
                )}
            </div>
        </div>
    );
}

