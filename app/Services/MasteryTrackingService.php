<?php

namespace App\Services;

use App\Models\User;
use App\Models\MasteryRecord;
use App\Models\ErrorLog;
use Carbon\Carbon;

class MasteryTrackingService
{
    protected AdaptiveLearningService $adaptiveService;

    public function __construct(AdaptiveLearningService $adaptiveService)
    {
        $this->adaptiveService = $adaptiveService;
    }

    /**
     * Record the result of an exercise and update mastery.
     */
    public function recordExercise(User $user, string $topic, string $skill, bool $isCorrect, ?string $errorPattern = null): array
    {
        $record = MasteryRecord::firstOrCreate(
            ['user_id' => $user->id, 'topic' => $topic],
            ['skill' => $skill, 'mastery_score' => 0, 'streak' => 0, 'current_difficulty' => 1]
        );

        // Update adaptive counters first
        $this->adaptiveService->updateCounters($record, $isCorrect);

        if ($isCorrect) {
            $record->streak += 1;
            $increment = 5 + ($record->streak * 2);
            $record->mastery_score = min(100, $record->mastery_score + $increment);
        } else {
            $record->streak = 0;
            $record->mastery_score = max(0, $record->mastery_score - 10);
            
            if ($errorPattern) {
                $this->logError($user, $topic, $errorPattern);
            }
        }

        // Get adaptive recommendation
        $recommendation = $this->adaptiveService->getRecommendation($record);
        
        // Update current difficulty in record
        $record->current_difficulty = $recommendation['next_difficulty'];
        $record->last_attempted_at = Carbon::now();
        $record->save();

        // Historical Logging
        \App\Models\ExerciseLog::create([
            'user_id' => $user->id,
            'topic' => $topic,
            'skill' => $skill,
            'is_correct' => $isCorrect,
            'difficulty' => $record->current_difficulty,
            'mastery_score_at_time' => $record->mastery_score,
        ]);

        return array_merge($recommendation, [
            'mastery_score' => $record->mastery_score,
            'streak' => $record->streak,
            'needs_review' => $this->checkIfNeedsReview($user, $topic),
        ]);
    }

    protected function logError(User $user, string $topic, string $errorPattern): void
    {
        $log = ErrorLog::firstOrNew([
            'user_id' => $user->id,
            'topic' => $topic,
            'error_pattern' => $errorPattern,
        ]);

        $log->occurrence_count += 1;
        $log->last_occurred_at = Carbon::now();
        $log->save();
    }

    protected function checkIfNeedsReview(User $user, string $topic): bool
    {
        // Simple rule: if more than 3 errors logged for this topic 
        // OR mastery score dropped significantly.
        $errorCount = ErrorLog::where('user_id', $user->id)
            ->where('topic', $topic)
            ->sum('occurrence_count');

        return $errorCount >= 3;
    }
}
