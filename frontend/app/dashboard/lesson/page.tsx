"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type Question = {
    id: number;
    question_text: string;
    options: string[];
    correct_option: string;
    difficulty_level?: number;
    skill?: string;
    type?: string;
};

type LessonState = "loading" | "ready" | "answering" | "feedback" | "completed" | "error";

function LessonContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const task = searchParams.get("task") || "";
    const taskKey = searchParams.get("key") || "";

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [textAnswer, setTextAnswer] = useState("");
    const [feedback, setFeedback] = useState<{ correct: boolean; reason: string; next_difficulty: number } | null>(null);
    const [state, setState] = useState<LessonState>("loading");
    const [score, setScore] = useState(0);
    const [topic, setTopic] = useState("");
    const [skill, setSkill] = useState("Grammar");

    useEffect(() => {
        async function loadQuestions() {
            try {
                // Extract a usable topic from the task description
                const extractedTopic = task.split("–")[0].split(":")[0].trim() || task;
                setTopic(extractedTopic);

                const res = await fetch(
                    `http://127.0.0.1:8000/api/exercise/questions?topic=${encodeURIComponent(extractedTopic)}`
                );

                if (res.ok) {
                    const data = await res.json();
                    if (data.questions && data.questions.length > 0) {
                        setQuestions(data.questions);
                        setSkill(data.questions[0]?.skill || "Grammar");
                        setState("ready");
                    } else {
                        // No topic-specific questions: fall back to generic questions
                        await loadGenericQuestions();
                    }
                } else {
                    await loadGenericQuestions();
                }
            } catch {
                await loadGenericQuestions();
            }
        }

        async function loadGenericQuestions() {
            try {
                const res = await fetch(
                    `http://127.0.0.1:8000/api/exercise/questions?topic=grammar`
                );
                if (res.ok) {
                    const data = await res.json();
                    setQuestions(data.questions || []);
                    setSkill(data.questions?.[0]?.skill || "Grammar");
                    setState(data.questions?.length > 0 ? "ready" : "error");
                } else {
                    setState("error");
                }
            } catch {
                setState("error");
            }
        }

        loadQuestions();
    }, [task]);

    const currentQ = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const isFillBlank = !currentQ?.options || currentQ.options.length === 0;

    const handleAnswer = async (answer: string) => {
        if (state === "feedback") return;
        setSelected(answer);
        setState("feedback");

        const isCorrect = answer.trim().toLowerCase() === currentQ.correct_option.trim().toLowerCase();
        if (isCorrect) setScore((s) => s + 1);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/exercise/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    topic: topic || "General",
                    skill: skill,
                    is_correct: isCorrect,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setFeedback({
                    correct: isCorrect,
                    reason: data.data.recommendation_reason,
                    next_difficulty: data.data.next_difficulty,
                });
            }
        } catch {
            setFeedback({ correct: isCorrect, reason: "", next_difficulty: 1 });
        }
    };

    const handleNext = async () => {
        if (isLastQuestion) {
            // Mark task complete
            if (taskKey) {
                await fetch("http://127.0.0.1:8000/api/plan/task/toggle", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({ task_key: taskKey }),
                });
            }
            setState("completed");
        } else {
            setCurrentIndex((i) => i + 1);
            setSelected(null);
            setTextAnswer("");
            setFeedback(null);
            setState("answering");
        }
    };

    if (state === "loading") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center space-y-4">
                    <p className="text-sm font-bold text-slate-600">No questions available for this topic yet.</p>
                    <Link href="/dashboard" className="text-xs font-black text-slate-900 underline uppercase tracking-widest">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (state === "completed") {
        const accuracy = Math.round((score / questions.length) * 100);
        return (
            <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center px-6">
                <div className="max-w-lg w-full text-center space-y-10">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Lesson Complete</p>
                        <p className="text-4xl font-black tracking-tight">{accuracy}%</p>
                        <p className="text-sm text-slate-500 mt-2">{score} of {questions.length} correct</p>
                    </div>
                    <div className="h-0.5 w-full bg-slate-200" />
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-slate-700">This task has been marked <span className="font-black text-slate-900">complete</span> in your curriculum.</p>
                        <Link
                            href="/dashboard"
                            className="inline-block px-10 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <Link href="/dashboard" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
                    ← Exit Lesson
                </Link>
                <div className="flex-1 mx-8">
                    <div className="h-0.5 w-full bg-slate-100 overflow-hidden">
                        <div
                            className="h-full bg-slate-900 transition-all duration-500"
                            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {currentIndex + 1} / {questions.length}
                </p>
            </header>

            {/* Content */}
            <main className="max-w-2xl mx-auto px-6 py-16 space-y-10">
                {/* Task label */}
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        {skill} · Difficulty Level {currentQ.difficulty_level || 1}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{task}</p>
                </div>

                {/* Question */}
                <div className="space-y-8">
                    <p className="text-xl font-bold leading-snug text-slate-900">{currentQ.question_text}</p>

                    {/* Options or Fill-blank */}
                    {isFillBlank ? (
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={textAnswer}
                                onChange={(e) => setTextAnswer(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && textAnswer.trim() && state !== "feedback" && handleAnswer(textAnswer.trim())}
                                placeholder="Type your answer…"
                                disabled={state === "feedback"}
                                className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-base font-medium outline-none focus:border-slate-900 transition-all placeholder-slate-300 disabled:opacity-50"
                            />
                            {state !== "feedback" && (
                                <button
                                    onClick={() => textAnswer.trim() && handleAnswer(textAnswer.trim())}
                                    className="px-8 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-40"
                                    disabled={!textAnswer.trim()}
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {currentQ.options.map((opt, i) => {
                                const isSelected = selected === opt;
                                const isCorrect = feedback && opt === currentQ.correct_option;
                                const isWrong = feedback && isSelected && !feedback.correct;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => state !== "feedback" && handleAnswer(opt)}
                                        disabled={state === "feedback"}
                                        className={`w-full text-left px-6 py-4 border text-sm font-medium transition-all ${isCorrect
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                                : isWrong
                                                    ? "border-red-400 bg-red-50 text-red-900"
                                                    : isSelected
                                                        ? "border-slate-900 bg-slate-50"
                                                        : "border-slate-200 hover:border-slate-400 hover:bg-white bg-white"
                                            }`}
                                    >
                                        <span className="text-[10px] font-black text-slate-300 uppercase mr-3">{String.fromCharCode(65 + i)}</span>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Feedback panel */}
                {feedback && (
                    <div className={`p-6 border space-y-3 ${feedback.correct ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                        <p className={`text-xs font-black uppercase tracking-widest ${feedback.correct ? "text-emerald-700" : "text-red-700"}`}>
                            {feedback.correct ? "✓ Correct" : "✗ Incorrect — Correct answer: " + currentQ.correct_option}
                        </p>
                        {feedback.reason && (
                            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">{feedback.reason}</p>
                        )}
                        <button
                            onClick={handleNext}
                            className="mt-2 px-8 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                            {isLastQuestion ? "Finish Lesson" : "Next Question →"}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function LessonPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LessonContent />
        </Suspense>
    );
}
