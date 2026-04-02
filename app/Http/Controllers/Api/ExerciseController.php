<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MasteryTrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    protected MasteryTrackingService $masteryService;

    public function __construct(MasteryTrackingService $masteryService)
    {
        $this->masteryService = $masteryService;
    }

    /**
     * Submit the result of a completed exercise.
     */
    public function submitResult(Request $request): JsonResponse
    {
        $request->validate([
            'topic' => 'required|string',
            'skill' => 'required|string',
            'is_correct' => 'required|boolean',
            'error_pattern' => 'nullable|string',
        ]);

        // Mocked user for demonstration
        $user = User::first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $result = $this->masteryService->recordExercise(
            $user,
            $request->topic,
            $request->skill,
            $request->is_correct,
            $request->error_pattern
        );

        return response()->json([
            'message' => 'Mastery record updated successfully',
            'data' => $result
        ]);
    }

    /**
     * Get questions for a specific topic and difficulty.
     * The 'topic' param can be a full task description or a skill keyword.
     */
    public function getQuestions(Request $request): JsonResponse
    {
        $request->validate([
            'topic' => 'required|string',
        ]);

        $user = User::first(); // Mocked
        $topic = $request->topic;

        // Detect skill from the topic string (helps when topic is a full task name)
        $skillKeywords = ['grammar', 'vocabulary', 'reading', 'writing', 'listening', 'speaking'];
        $skill = 'grammar'; // default
        foreach ($skillKeywords as $kw) {
            if (str_contains(strtolower($topic), $kw)) {
                $skill = $kw;
                break;
            }
        }

        // Get user's current difficulty for this topic
        $mastery = $user->masteryRecords()->where('topic', $topic)->first();
        $difficulty = $mastery ? $mastery->current_difficulty : 1;

        // Try exact difficulty first, then fall back to any for that skill
        $questions = \App\Models\Question::where('skill', $skill)
            ->where('difficulty', $difficulty)
            ->inRandomOrder()
            ->limit(10)
            ->get();

        if ($questions->isEmpty()) {
            $questions = \App\Models\Question::where('skill', $skill)
                ->inRandomOrder()
                ->limit(10)
                ->get();
        }

        // Final fallback: any questions at all
        if ($questions->isEmpty()) {
            $questions = \App\Models\Question::inRandomOrder()->limit(10)->get();
        }

        return response()->json([
            'topic'      => $topic,
            'skill'      => $skill,
            'difficulty' => $difficulty,
            'questions'  => $questions,
        ]);
    }

    /**
     * Get the mastery overview for the user.
     */
    public function overview(): JsonResponse
    {
        $user = User::first(); // Mocked

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $mastery = $user->masteryRecords()->orderBy('mastery_score', 'desc')->get();
        $errors = $user->errorLogs()->orderBy('occurrence_count', 'desc')->get();

        return response()->json([
            'mastery' => $mastery,
            'errors' => $errors
        ]);
    }
}
