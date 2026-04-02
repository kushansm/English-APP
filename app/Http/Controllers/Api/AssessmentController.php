<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PlacementTestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssessmentController extends Controller
{
    protected $testService;

    public function __construct(PlacementTestService $testService)
    {
        $this->testService = $testService;
    }

    /**
     * Start a new placement assessment.
     */
    public function start(Request $request): JsonResponse
    {
        // For now, using the first user as a mock for authenticated user
        $user = $request->user();

        try {
            $data = $this->testService->startTest($user);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Submit an answer to a question.
     */
    public function answer(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'question_id' => 'required|exists:questions,id',
            'answer' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // For now, using the first user as a mock for authenticated user
        $user = $request->user();

        try {
            $data = $this->testService->submitAnswer(
                $user,
                $request->input('question_id'),
                $request->input('answer')
            );
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Get the latest assessment result.
     */
    public function result(Request $request): JsonResponse
    {
        // For now, using the first user as a mock for authenticated user
        $user = $request->user();
        
        $assessment = $user->assessments()->latest()->with('skillScores')->first();

        if (!$assessment) {
            return response()->json(['error' => 'No assessment found.'], 404);
        }

        return response()->json($assessment);
    }
}
