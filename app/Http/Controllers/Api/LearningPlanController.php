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
        $user = $request->user();

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
        $user = $request->user();

        $plan = $user->latestLearningPlan;

        if (!$plan) {
            return response()->json(['message' => 'No learning plan found'], 404);
        }

        return response()->json($plan);
    }

    /**
     * Toggle the completion status of a specific task.
     */
    public function toggleTask(Request $request): JsonResponse
    {
        $user = $request->user();
        $taskKey = $request->input('task_key'); // Format: "Week 1:Day 1:0"

        if (!$taskKey) {
            return response()->json(['message' => 'Task key required'], 400);
        }

        $plan = $user->latestLearningPlan;
        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        $completed = $plan->completed_tasks ?? [];

        // Toggle logic
        if (in_array($taskKey, $completed)) {
            $completed = array_values(array_diff($completed, [$taskKey]));
        } else {
            $completed[] = $taskKey;
        }

        $plan->update(['completed_tasks' => $completed]);

        return response()->json([
            'message' => 'Task toggled successfully',
            'completed_tasks' => $completed
        ]);
    }
}
