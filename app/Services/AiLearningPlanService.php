<?php

namespace App\Services;

use App\Models\Assessment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiLearningPlanService
{
    protected ?string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
        $this->model = config('services.openai.model', 'gpt-4o-mini');
    }

    /**
     * Generate a learning profile summary and plan using AI.
     */
    public function generatePlan(Assessment $assessment, array $preferences): array
    {
        if (!$this->apiKey) {
            Log::warning('OpenAI API key not set. Returning fallback plan.');
            return $this->getFallbackPlan($assessment, $preferences);
        }

        $skillScores = $assessment->skillScores->pluck('score', 'skill')->toArray();
        $cefrLevel = $assessment->cefr_level;

        $prompt = $this->buildPrompt($cefrLevel, $skillScores, $preferences);

        try {
            $response = Http::withToken($this->apiKey)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => $this->model,
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are an expert English language tutor. Provide structured advice in JSON format.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'temperature' => 0.7,
                ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                return json_decode($content, true);
            }

            Log::error('OpenAI API error: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('AI Service Exception: ' . $e->getMessage());
        }

        return $this->getFallbackPlan($assessment, $preferences);
    }

    protected function buildPrompt(string $level, array $skills, array $prefs): string
    {
        $skillsText = collect($skills)->map(fn($score, $skill) => "- $skill: $score%")->implode("\n");
        $interests = implode(', ', $prefs['interests'] ?? []);
        $focus = implode(', ', $prefs['focus_areas'] ?? []);

        return <<<PROMPT
Generate a personalized English learning profile based on these results:
- CEFR Level: $level
- Skill Scores:
$skillsText
- Preferences:
  - Goal: {$prefs['target_exam']}
  - Daily Commitment: {$prefs['daily_minutes']} minutes
  - Learning Style: {$prefs['learning_style']}
  - Interests: $interests
  - Focus Areas: $focus

Return a JSON object with:
{
  "summary": "A 1-2 sentence overview of their strengths and weaknesses.",
  "recommendations": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
}
PROMPT;
    }

    protected function getFallbackPlan(Assessment $assessment, array $preferences): array
    {
        $weakestSkill = $assessment->skillScores->sortBy('score')->first()?->skill ?? 'general skills';
        
        return [
            'summary' => "You have reached a {$assessment->cefr_level} level. You are strongest in some areas but could improve your $weakestSkill.",
            'recommendations' => [
                "Practice $weakestSkill exercises for 15 minutes daily.",
                "Maintain your {$preferences['daily_minutes']} minute daily commitment.",
                "Focus on your interests in " . implode(', ', $preferences['interests'] ?? []) . " to stay motivated."
            ]
        ];
    }
}
