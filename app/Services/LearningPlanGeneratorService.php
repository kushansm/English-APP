<?php

namespace App\Services;

use App\Models\User;
use App\Models\Assessment;
use App\Models\LearnerProfile;

class LearningPlanGeneratorService
{
    /**
     * Generate a personalized learning plan.
     */
    public function generate(User $user): array
    {
        $profile = $user->latestLearnerProfile;
        $assessment = $user->assessments()->latest()->first();

        if (!$profile || !$assessment) {
            throw new \Exception("Incomplete user profile or assessment data.");
        }

        $skillScores = $assessment->skillScores->pluck('score', 'skill')->toArray();
        $goal = $profile->target_exam;
        $dailyMinutes = $profile->daily_minutes;

        return $this->buildPlan($goal, $skillScores, $dailyMinutes);
    }

    protected function buildPlan(string $goal, array $skills, int $dailyMinutes): array
    {
        $weeks = 4;
        $plan = [];

        // Identify weak skills (score < 60)
        $weakSkills = array_keys(array_filter($skills, fn($s) => $s < 60));
        if (empty($weakSkills)) {
            // If no weak skills, pick the lowest one
            asort($skills);
            $weakSkills = [array_key_first($skills)];
        }

        // Adjust task count based on daily time
        // 10-20m: 2 tasks, 30-40m: 3 tasks, 60m+: 4 tasks
        $tasksPerDay = match (true) {
            $dailyMinutes <= 20 => 2,
            $dailyMinutes <= 45 => 3,
            default => 4,
        };

        for ($w = 1; $w <= $weeks; $w++) {
            $weekTitle = "Week $w: " . $this->getWeekFocus($w, $goal);
            $days = [];

            for ($d = 1; $d <= 7; $d++) {
                $days["Day $d"] = $this->generateDailyTasks($tasksPerDay, $goal, $weakSkills, $w, $d);
            }

            $plan[$weekTitle] = $days;
        }

        return $plan;
    }

    protected function getWeekFocus(int $week, string $goal): string
    {
        $foci = [
            'IELTS' => ['Foundations & Strategy', 'Deep Dive: Listening & Reading', 'Intensive: Writing & Speaking', 'Full Mock & Final Polish'],
            'TOEFL' => ['Academic Basics', 'Campus Situations & Audio', 'Integrated Tasks Focus', 'Timed Practice'],
            'General' => ['Daily Communication', 'Expanding Vocabulary', 'Grammar in Context', 'Fluency Building'],
            'Business' => ['Professional Introduction', 'Meetings & Proposals', 'Negotiation Skills', 'Global Business Etiquette'],
            'Academic' => ['Lecture Comprehension', 'Academic Writing Style', 'Research & Citations', 'Presentation Skills'],
        ];

        return $foci[$goal][$week - 1] ?? $foci['General'][$week - 1];
    }

    protected function generateDailyTasks(int $count, string $goal, array $weakSkills, int $week, int $day): array
    {
        $tasks = [];
        
        // Priority 1: Weak Skills (at least one task per day focused on a weak skill)
        $weakSkill = $weakSkills[($day - 1) % count($weakSkills)];
        $tasks[] = $this->getTaskBySkill($weakSkill, $goal);

        // Priority 2: Goal Specific (Template based)
        if ($count > 1) {
            $tasks[] = $this->getGoalSpecificTask($goal, $week, $day);
        }

        // Priority 3: General Variety
        while (count($tasks) < $count) {
            $skills = ['grammar', 'vocabulary', 'reading', 'listening', 'speaking'];
            $randomSkill = $skills[array_rand($skills)];
            $tasks[] = $this->getTaskBySkill($randomSkill, $goal);
        }

        // Remove duplicates and ensure unique tasks
        return array_values(array_unique($tasks));
    }

    protected function getTaskBySkill(string $skill, string $goal): string
    {
        $templates = [
            'grammar' => ['Practice Perfect Tenses', 'Mastering Conditionals', 'Noun Clauses Workshop', 'Passive Voice in Context'],
            'vocabulary' => ['Collocations for ' . $goal, 'Phrasal Verbs Challenge', 'Academic Word List Study', 'Contextual Synonyms'],
            'reading' => ['Skimming & Scanning Drill', 'Detail Hunting in Long Texts', 'Inference Questions Practice', 'Vocabulary in Context Exercise'],
            'listening' => ['Podcast Note-taking', 'News Item Summary', 'Dialogue Detail Analysis', 'Lecture Comprehension'],
            'speaking' => ['Shadowing Exercise', 'Topic Monologue (2 mins)', 'Pronunciation: Minimal Pairs', 'Opinion Formation Drill'],
        ];

        $list = $templates[$skill] ?? $templates['grammar'];
        return $list[array_rand($list)];
    }

    protected function getGoalSpecificTask(string $goal, int $week, int $day): string
    {
        $goalTemplates = [
            'IELTS' => [
                'Writing Task 1: Data Description',
                'Speaking Part 2 Mock',
                'Reading: True/False/Not Given Practice',
                'Listening: Multiple Choice Drill',
                'Writing Task 2: Essay Structure',
            ],
            'Business' => [
                'Writing a Professional Email',
                'Roleplay: Negotiating a Deal',
                'Business Vocabulary: Finance',
                'Reviewing a Meeting Agenda',
                'Listening: Corporate Presentation',
            ],
            'General' => [
                'Common Idioms in Daily Life',
                'Telling a Personal Story',
                'Ordering in a Restaurant (Roleplay)',
                'Asking for and Giving Directions',
                'Writing a Friendly Message',
            ],
        ];

        $list = $goalTemplates[$goal] ?? $goalTemplates['General'];
        return $list[array_rand($list)];
    }
}
