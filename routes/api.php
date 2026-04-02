<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\LearnerProfileController;
use App\Http\Controllers\Api\LearningPlanController;
use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\Api\ProgressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Auth Routes
|--------------------------------------------------------------------------
*/
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (require Sanctum token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Onboarding
    Route::prefix('onboarding')->group(function () {
        Route::post('/profile',           [LearnerProfileController::class, 'store']);
        Route::get('/profile/latest',     [LearnerProfileController::class, 'latest']);

        Route::post('/assessment/start',  [AssessmentController::class, 'start']);
        Route::post('/assessment/answer', [AssessmentController::class, 'answer']);
        Route::get('/assessment/result',  [AssessmentController::class, 'result']);
    });

    // Learning Plan
    Route::post('/plan/generate',      [LearningPlanController::class, 'generate']);
    Route::get('/plan',                [LearningPlanController::class, 'show']);
    Route::post('/plan/task/toggle',   [LearningPlanController::class, 'toggleTask']);

    // Exercise / Mastery
    Route::post('/exercise/submit',   [ExerciseController::class, 'submitResult']);
    Route::get('/mastery/overview',   [ExerciseController::class, 'overview']);

    // Progress Reporting
    Route::get('/progress/summary',   [ProgressController::class, 'summary']);
    Route::get('/progress/skills',    [ProgressController::class, 'skills']);
    Route::get('/progress/topics',    [ProgressController::class, 'topics']);
});
