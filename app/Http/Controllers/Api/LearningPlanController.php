<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LearningPlan;
use App\Services\LearningPlanGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LearningPlanController extends Controller
{
    protected LearningPlanGeneratorService $generator;

    public function __construct(LearningPlanGeneratorService $generator)
    {
        $this->generator = $generator;
    }

    /**
     * Generate and store a new personalized learning plan.
     */
    public function generate(Request $request): JsonResponse
    {
        // Mocked user for demonstration
        $user = User::first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            $planData = $this->generator->generate($user);

            $learningPlan = LearningPlan::create([
                'user_id' => $user->id,
                'plan_data' => $planData,
                'version' => ($user->latestLearningPlan?->version ?? 0) + 1,
            ]);

            return response()->json([
                'message' => 'Learning plan generated successfully',
                'plan' => $learningPlan
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate plan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the latest learning plan for the user.
     */
    public function show(Request $request): JsonResponse
    {
        $user = User::first(); // Mocked

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $plan = $user->latestLearningPlan;

        if (!$plan) {
            return response()->json(['message' => 'No learning plan found'], 404);
        }

        return response()->json($plan);
    }
}
