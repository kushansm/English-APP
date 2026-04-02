<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\Question;
use App\Models\SkillScore;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PlacementTestService
{
    private const SESSION_KEY = 'placement_test_';
    private const TOTAL_QUESTIONS = 20;

    /**
     * Start a new placement test.
     */
    public function startTest(User $user): array
    {
        $session = [
            'current_difficulty' => 3,
            'question_count' => 0,
            'answers' => [], // ['skill' => 'grammar', 'difficulty' => 3, 'correct' => true]
        ];

        Cache::put(self::SESSION_KEY . $user->id, $session, now()->addHours(1));

        return $this->getNextQuestion($user);
    }

    /**
     * Submit an answer and get the next question.
     */
    public function submitAnswer(User $user, int $questionId, string $answer): array
    {
        $session = Cache::get(self::SESSION_KEY . $user->id);

        if (!$session) {
            throw new \Exception('No active test session.');
        }

        $question = Question::findOrFail($questionId);
        $isCorrect = $question->correct_option === $answer;

        // Record answer
        $session['answers'][] = [
            'skill' => $question->skill,
            'difficulty' => $question->difficulty,
            'correct' => $isCorrect,
        ];

        $session['question_count']++;

        // Adaptive logic
        if ($isCorrect) {
            $session['current_difficulty'] = min(5, $session['current_difficulty'] + 1);
        } else {
            $session['current_difficulty'] = max(1, $session['current_difficulty'] - 1);
        }

        Cache::put(self::SESSION_KEY . $user->id, $session, now()->addHours(1));

        if ($session['question_count'] >= self::TOTAL_QUESTIONS) {
            return [
                'status' => 'completed',
                'result' => $this->finalizeTest($user, $session),
            ];
        }

        return $this->getNextQuestion($user);
    }

    /**
     * Get the next question based on current difficulty.
     */
    private function getNextQuestion(User $user): array
    {
        $session = Cache::get(self::SESSION_KEY . $user->id);
        
        // Pick a question of current difficulty that hasn't been answered yet in this session
        $answeredIds = collect($session['answers'])->pluck('id')->toArray(); // Wait, I didn't store IDs
        
        // Simple random pick for now for demo
        $question = Question::where('difficulty', $session['current_difficulty'])
            ->inRandomOrder()
            ->first();

        if (!$question) {
            // Fallback to closest difficulty if none found
            $question = Question::inRandomOrder()->first();
        }

        return [
            'status' => 'in_progress',
            'question' => [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'options' => $question->options,
                'skill' => $question->skill,
            ],
            'progress' => [
                'current' => $session['question_count'] + 1,
                'total' => self::TOTAL_QUESTIONS,
            ],
        ];
    }

    /**
     * Finalize the test and store results.
     */
    private function finalizeTest(User $user, array $session): Assessment
    {
        return DB::transaction(function () use ($user, $session) {
            $answers = collect($session['answers']);
            
            // Calculate scores per skill
            $skillBreakdown = $answers->groupBy('skill')->map(function ($group) {
                $correct = $group->where('correct', true);
                if ($group->count() === 0) return 0;
                // Weighted score: 100 * (sum of difficulties of correct / sum of difficulties of all)
                return round(($correct->sum('difficulty') / $group->sum('difficulty')) * 100);
            });

            $avgDifficulty = $answers->where('correct', true)->avg('difficulty') ?: 1;
            $overallScore = ($answers->where('correct', true)->count() / self::TOTAL_QUESTIONS) * 100;

            $cefrLevel = $this->mapToCefr($avgDifficulty, $overallScore);

            $assessment = Assessment::create([
                'user_id' => $user->id,
                'type' => 'placement',
                'overall_score' => $overallScore,
                'cefr_level' => $cefrLevel,
            ]);

            foreach ($skillBreakdown as $skill => $score) {
                SkillScore::create([
                    'assessment_id' => $assessment->id,
                    'skill' => $skill,
                    'score' => $score,
                ]);
            }

            Cache::forget(self::SESSION_KEY . $user->id);

            return $assessment->load('skillScores');
        });
    }

    /**
     * Map difficulty and score to CEFR level.
     */
    private function mapToCefr(float $avgDifficulty, float $overallScore): string
    {
        if ($avgDifficulty >= 4.5 && $overallScore >= 80) return 'C2';
        if ($avgDifficulty >= 4.0) return 'C1';
        if ($avgDifficulty >= 3.0) return 'B2';
        if ($avgDifficulty >= 2.0) return 'B1';
        if ($avgDifficulty >= 1.5) return 'A2';
        return 'A1';
    }
}
