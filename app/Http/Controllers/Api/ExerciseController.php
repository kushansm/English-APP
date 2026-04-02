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
