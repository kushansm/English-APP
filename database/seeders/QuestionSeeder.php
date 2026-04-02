<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            // === GRAMMAR — Difficulty 1 ===
            ['question_text' => 'She ___ to the store yesterday.', 'options' => ['go', 'goes', 'went', 'gone'], 'correct_option' => 'went', 'difficulty' => 1, 'skill' => 'grammar'],
            ['question_text' => 'They ___ happy about the news.', 'options' => ['is', 'are', 'was', 'be'], 'correct_option' => 'are', 'difficulty' => 1, 'skill' => 'grammar'],
            ['question_text' => 'He ___ his homework every day.', 'options' => ['do', 'does', 'did', 'doing'], 'correct_option' => 'does', 'difficulty' => 1, 'skill' => 'grammar'],
            ['question_text' => 'We ___ lunch at noon.', 'options' => ['have', 'has', 'had', 'having'], 'correct_option' => 'have', 'difficulty' => 1, 'skill' => 'grammar'],
            ['question_text' => 'The cat ___ on the sofa.', 'options' => ['sit', 'sits', 'sat', 'sitting'], 'correct_option' => 'sits', 'difficulty' => 1, 'skill' => 'grammar'],

            // === GRAMMAR — Difficulty 2 ===
            ['question_text' => 'I ___ to the cinema last night.', 'options' => [], 'correct_option' => 'went', 'difficulty' => 2, 'skill' => 'grammar'],
            ['question_text' => 'Could you ___ me a favor?', 'options' => [], 'correct_option' => 'do', 'difficulty' => 2, 'skill' => 'grammar'],
            ['question_text' => 'She has been working here ___ five years.', 'options' => [], 'correct_option' => 'for', 'difficulty' => 2, 'skill' => 'grammar'],
            ['question_text' => 'By the time he arrived, they ___ already left.', 'options' => ['have', 'had', 'has', 'were'], 'correct_option' => 'had', 'difficulty' => 2, 'skill' => 'grammar'],
            ['question_text' => 'She is used to ___ early.', 'options' => ['wake', 'wakes', 'waking', 'woke'], 'correct_option' => 'waking', 'difficulty' => 2, 'skill' => 'grammar'],

            // === GRAMMAR — Difficulty 3 ===
            ['question_text' => 'If I ___ you, I would take the job.', 'options' => ['am', 'was', 'were', 'be'], 'correct_option' => 'were', 'difficulty' => 3, 'skill' => 'grammar'],
            ['question_text' => 'The report ___ finished by tomorrow.', 'options' => ['must be', 'must have', 'must been', 'must being'], 'correct_option' => 'must be', 'difficulty' => 3, 'skill' => 'grammar'],
            ['question_text' => 'He spoke as though he ___ the answer.', 'options' => ['knows', 'knew', 'had known', 'knowing'], 'correct_option' => 'knew', 'difficulty' => 3, 'skill' => 'grammar'],

            // === GRAMMAR — Difficulty 5 ===
            ['question_text' => 'Hardly ___ the office when it started to rain.', 'options' => ['had I left', 'I had left', 'did I leave', 'I left'], 'correct_option' => 'had I left', 'difficulty' => 5, 'skill' => 'grammar'],
            ['question_text' => 'Not only ___ the report but also submitted it early.', 'options' => ['he completed', 'did he complete', 'he did complete', 'completed he'], 'correct_option' => 'did he complete', 'difficulty' => 5, 'skill' => 'grammar'],

            // === VOCABULARY — Difficulty 1 ===
            ['question_text' => 'The opposite of "large" is ___.', 'options' => ['big', 'small', 'huge', 'wide'], 'correct_option' => 'small', 'difficulty' => 1, 'skill' => 'vocabulary'],
            ['question_text' => 'Which word means "to be very happy"?', 'options' => ['sad', 'elated', 'bored', 'tired'], 'correct_option' => 'elated', 'difficulty' => 1, 'skill' => 'vocabulary'],
            ['question_text' => 'A "car" is a type of ___.', 'options' => ['animal', 'vehicle', 'food', 'building'], 'correct_option' => 'vehicle', 'difficulty' => 1, 'skill' => 'vocabulary'],
            ['question_text' => 'Which word is a synonym for "fast"?', 'options' => ['slow', 'quick', 'heavy', 'quiet'], 'correct_option' => 'quick', 'difficulty' => 1, 'skill' => 'vocabulary'],

            // === VOCABULARY — Difficulty 3 ===
            ['question_text' => 'The CEO made a ___ decision that changed the company.', 'options' => ['pivotal', 'small', 'easy', 'quick'], 'correct_option' => 'pivotal', 'difficulty' => 3, 'skill' => 'vocabulary'],
            ['question_text' => 'The scientist made a ___ discovery.', 'options' => ['mundane', 'groundbreaking', 'trivial', 'ordinary'], 'correct_option' => 'groundbreaking', 'difficulty' => 3, 'skill' => 'vocabulary'],
            ['question_text' => 'The new policy was met with significant ___.', 'options' => ['elation', 'consternation', 'indifference', 'enthusiasm'], 'correct_option' => 'consternation', 'difficulty' => 3, 'skill' => 'vocabulary'],

            // === VOCABULARY — Difficulty 5 ===
            ['question_text' => 'His ___ behavior led to many misunderstandings.', 'options' => ['equivocal', 'clear', 'kind', 'rude'], 'correct_option' => 'equivocal', 'difficulty' => 5, 'skill' => 'vocabulary'],
            ['question_text' => 'The politician\'s speech was full of ___ statements.', 'options' => ['perspicuous', 'obfuscating', 'simple', 'direct'], 'correct_option' => 'obfuscating', 'difficulty' => 5, 'skill' => 'vocabulary'],

            // === READING — Difficulty 1 ===
            ['question_text' => 'Read: "Plants need water and sunlight." What do plants need?', 'options' => ['Air', 'Water and sunlight', 'Soil only', 'Nothing'], 'correct_option' => 'Water and sunlight', 'difficulty' => 1, 'skill' => 'reading'],
            ['question_text' => 'Read: "Tom went to the park. He played football." What did Tom do?', 'options' => ['Slept', 'Played football', 'Swam', 'Studied'], 'correct_option' => 'Played football', 'difficulty' => 1, 'skill' => 'reading'],

            // === READING — Difficulty 3 ===
            ['question_text' => 'Read: "Despite the economic downturn, the tech sector remains resilient." How is the tech sector?', 'options' => ['Failing', 'Weak', 'Strong/Recovering', 'Static'], 'correct_option' => 'Strong/Recovering', 'difficulty' => 3, 'skill' => 'reading'],
            ['question_text' => 'Read: "The summit aimed to forge a consensus on climate policy, but delegates remained polarized." What was the outcome?', 'options' => ['Agreement reached', 'No consensus', 'Summit cancelled', 'Policy implemented'], 'correct_option' => 'No consensus', 'difficulty' => 3, 'skill' => 'reading'],
        ];

        foreach ($questions as $q) {
            \App\Models\Question::create($q);
        }
    }
}
