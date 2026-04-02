<?php

use App\Http\Controllers\Api\LearnerProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('onboarding')->group(function () {
    Route::post('/profile', [LearnerProfileController::class, 'store']);
    Route::get('/profile/latest', [LearnerProfileController::class, 'latest']);
});
