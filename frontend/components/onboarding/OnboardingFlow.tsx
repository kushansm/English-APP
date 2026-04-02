"use client";

import React, { useState, useEffect } from "react";
import { GoalStep } from "./GoalStep";
import { LevelStep } from "./LevelStep";
import { TestStep } from "./TestStep";
import { PreferencesStep } from "./PreferencesStep";
import { SummaryStep } from "./SummaryStep";
import { ProgressBar } from "../ui/ProgressBar";

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
    "Level Estimation",
    "AI Test Entry",
    "Preferences",
    "Profile Summary",
];

export default function OnboardingFlow() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<OnboardingData>(INITIAL_DATA);
    const [isLoaded, setIsLoaded] = useState(false);

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
        if (isLoaded) {
            localStorage.setItem(
                "onboarding_progress",
                JSON.stringify({ step: currentStep, data: formData })
            );
        }
    }, [currentStep, formData, isLoaded]);

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

    if (!isLoaded) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
            <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} />

            <div className="flex-grow mt-8">
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
                        onComplete={() => alert("Generating Learning Plan...")}
                    />
                )}
            </div>
        </div>
    );
}
