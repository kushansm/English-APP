<?php

namespace App\Services;

use App\Models\MasteryRecord;
use App\Models\User;
use Carbon\Carbon;

class AdaptiveLearningService
{
    /**
     * Calculate the next difficulty level and recommendation reason.
     */
    public function getRecommendation(MasteryRecord $record): array
    {
        $nextDifficulty = $record->current_difficulty;
        $reason = "Maintain current challenge level based on consistent performance.";
        $needsMicroLesson = false;

        // Rule: 3 correct -> harder
        if ($record->consecutive_correct >= 3) {
            if ($nextDifficulty < 5) {
                $nextDifficulty++;
                $reason = "Excellent streak! Increasing complexity to reach Next Level Proficiency.";
            } else {
                $reason = "Maximum mastery reached for this topic. Focus on fluency and speed.";
            }
        }

        // Rule: 2 wrong -> easier + micro lesson
        if ($record->consecutive_incorrect >= 2) {
            $needsMicroLesson = true;
            if ($nextDifficulty > 1) {
                $nextDifficulty--;
                $reason = "Detected persistent friction. Recalibrating to foundational level for conceptual reinforcement.";
            } else {
                $reason = "Foundational reinforcement required. Initiating Micro-Lesson for core clarity.";
            }
        }

        // Rule: Spaced repetition after 3 days
        $daysSinceLast = $record->last_attempted_at ? $record->last_attempted_at->diffInDays(Carbon::now()) : 0;
        if ($daysSinceLast >= 3) {
            $reason = "Spaced Repetition Trigger: It has been {$daysSinceLast} days. Reviewing now will solidify long-term retention.";
        }

        return [
            'next_difficulty' => $nextDifficulty,
            'recommendation_reason' => $reason,
            'needs_micro_lesson' => $needsMicroLesson,
        ];
    }

    /**
     * Update the consecutive counters for a record.
     */
    public function updateCounters(MasteryRecord $record, bool $isCorrect): void
    {
        if ($isCorrect) {
            $record->consecutive_correct += 1;
            $record->consecutive_incorrect = 0;
        } else {
            $record->consecutive_incorrect += 1;
            $record->consecutive_correct = 0;
        }
    }
}
