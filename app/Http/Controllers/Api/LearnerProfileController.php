<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\LearnerProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LearnerProfileController extends Controller
{
    protected LearnerProfileService $profileService;

    public function __construct(LearnerProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Get the latest learner profile for the authenticated user.
     */
    public function latest(Request $request): JsonResponse
    {
        // For demonstration, we'll use a mocked user or the first user in the system.
        // In a real application, this would be $request->user().
        $user = User::first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $profile = $this->profileService->getLatestProfile($user);

        if (!$profile) {
            return response()->json(['message' => 'No profile found for this user'], 404);
        }

        return response()->json($profile);
    }

    /**
     * Create a new version of the learner profile.
     */
    public function store(Request $request): JsonResponse
    {
        $user = User::first(); // Mocked for demonstration.

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'target_exam' => 'required|string|in:IELTS,TOEFL,Business,Academic,General',
            'target_level' => 'required|string|regex:/^[A-C][1-2]$/',
            'target_date' => 'required|date|after:today',
            'daily_minutes' => 'required|integer|min:1',
            'learning_style' => 'required|string|in:active,passive,balanced',
            'age_group' => 'required|string',
            'interests' => 'required|array',
            'focus_areas' => 'required|array',
            'custom_focus' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $profile = $this->profileService->createNewVersion($user, $validator->validated());

        return response()->json([
            'message' => 'Profile created successfully',
            'profile' => $profile
        ], 201);
    }
}
