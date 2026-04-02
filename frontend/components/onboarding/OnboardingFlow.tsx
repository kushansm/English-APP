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
                target_level: "B1", // Placeholder
                daily_minutes: formData.dailyMinutes,
                learning_style: formData.learningStyle.toLowerCase(),
                interests: formData.interests,
                focus_areas: formData.focusAreas,
                custom_focus: formData.customFocus,
                target_date: "2026-12-31", // Placeholder
                age_group: "25-34", // Placeholder
            };

            const response = await fetch("http://127.0.0.1:8000/api/onboarding/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(backendData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Handle Laravel validation errors
                if (responseData.errors) {
                    const errorMessages = Object.values(responseData.errors).flat().join("\n");
                    throw new Error(errorMessages);
                }
                throw new Error(responseData.message || "Failed to save profile");
            }

            setIsSuccess(true);
            localStorage.removeItem("onboarding_progress");

            // Optional: Redirect after a delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 3000);

        } catch (error) {
            console.error("Submission error:", error);
            alert(error instanceof Error ? error.message : "An error occurred while saving your profile.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
            {!isSuccess && <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} />}

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
                        onComplete={handleSubmit}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                    />
                )}
            </div>
        </div>
    );
}
