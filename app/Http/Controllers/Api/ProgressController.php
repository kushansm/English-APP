<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ExerciseLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
    /**
     * Get overall progress summary.
     */
    public function summary(Request $request): JsonResponse
    {
        $days = $request->query('days', 7);
        $user = $request->user();

        $query = ExerciseLog::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->subDays($days));

        $totalExercises = $query->count();
        $correctCount = $query->where('is_correct', true)->count();
        $accuracy = $totalExercises > 0 ? round(($correctCount / $totalExercises) * 100) : 0;
        
        $avgMastery = $user->masteryRecords()->avg('mastery_score') ?: 0;

        return response()->json([
            'period_days' => (int)$days,
            'total_exercises' => $totalExercises,
            'accuracy' => $accuracy,
            'average_mastery' => round($avgMastery, 1),
            'streak_active' => $user->masteryRecords()->max('streak') ?: 0,
        ]);
    }

    /**
     * Get progress by skills.
     */
    public function skills(Request $request): JsonResponse
    {
        $days = $request->query('days', 7);
        $user = $request->user();

        $skills = ExerciseLog::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->subDays($days))
            ->select('skill', 
                DB::raw('count(*) as total'),
                DB::raw('sum(case when is_correct then 1 else 0 end) as correct'),
                DB::raw('avg(mastery_score_at_time) as avg_mastery')
            )
            ->groupBy('skill')
            ->get();

        return response()->json($skills);
    }

    /**
     * Get progress by topics.
     */
    public function topics(Request $request): JsonResponse
    {
        $days = $request->query('days', 7);
        $user = $request->user();

        $topics = ExerciseLog::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->subDays($days))
            ->select('topic', 'skill',
                DB::raw('count(*) as total'),
                DB::raw('sum(case when is_correct then 1 else 0 end) as correct'),
                DB::raw('max(mastery_score_at_time) as peak_mastery')
            )
            ->groupBy('topic', 'skill')
            ->orderBy('peak_mastery', 'desc')
            ->get();

        return response()->json($topics);
    }
}
