<?php

use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\LearnerProfileController;
use App\Http\Controllers\Api\LearningPlanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('onboarding')->group(function () {
    Route::post('/profile', [LearnerProfileController::class, 'store']);
    Route::get('/profile/latest', [LearnerProfileController::class, 'latest']);
    
    Route::post('/assessment/start', [AssessmentController::class, 'start']);
    Route::post('/assessment/answer', [AssessmentController::class, 'answer']);
    Route::get('/assessment/result', [AssessmentController::class, 'result']);
});

Route::post('/plan/generate', [LearningPlanController::class, 'generate']);
Route::get('/plan', [LearningPlanController::class, 'show']);
Route::post('/plan/task/toggle', [LearningPlanController::class, 'toggleTask']);

Route::post('/exercise/submit', [App\Http\Controllers\Api\ExerciseController::class, 'submitResult']);
Route::get('/mastery/overview', [App\Http\Controllers\Api\ExerciseController::class, 'overview']);
