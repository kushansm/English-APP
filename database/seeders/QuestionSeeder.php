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
            // Grammar
            ['question_text' => 'She ___ to the store yesterday.', 'options' => ['go', 'goes', 'went', 'gone'], 'correct_option' => 'went', 'difficulty' => 1, 'skill' => 'grammar'],
            ['question_text' => 'If I ___ you, I would take the job.', 'options' => ['am', 'was', 'were', 'be'], 'correct_option' => 'were', 'difficulty' => 3, 'skill' => 'grammar'],
            ['question_text' => 'Hardly ___ the office when it started to rain.', 'options' => ['had I left', 'I had left', 'did I leave', 'I left'], 'correct_option' => 'had I left', 'difficulty' => 5, 'skill' => 'grammar'],
            
            // Vocabulary
            ['question_text' => 'The opposite of "large" is ___.', 'options' => ['big', 'small', 'huge', 'wide'], 'correct_option' => 'small', 'difficulty' => 1, 'skill' => 'vocabulary'],
            ['question_text' => 'The CEO made a ___ decision that changed the company.', 'options' => ['pivotal', 'small', 'easy', 'quick'], 'correct_option' => 'pivotal', 'difficulty' => 3, 'skill' => 'vocabulary'],
            ['question_text' => 'His ___ behavior led to many misunderstandings.', 'options' => ['equivocal', 'clear', 'kind', 'rude'], 'correct_option' => 'equivocal', 'difficulty' => 5, 'skill' => 'vocabulary'],
            
            // Fill in the blank (Empty options)
            ['question_text' => 'I ___ to the cinema last night.', 'options' => [], 'correct_option' => 'went', 'difficulty' => 2, 'skill' => 'grammar'],
            ['question_text' => 'Could you ___ me a favor?', 'options' => [], 'correct_option' => 'do', 'difficulty' => 2, 'skill' => 'grammar'],
            ['question_text' => 'She has been working here ___ five years.', 'options' => [], 'correct_option' => 'for', 'difficulty' => 3, 'skill' => 'grammar'],
            
            // Reading (Short snippets)
            ['question_text' => 'Read: "Plants need water and sunlight." What do plants need?', 'options' => ['Air', 'Water and sunlight', 'Soil only', 'Nothing'], 'correct_option' => 'Water and sunlight', 'difficulty' => 1, 'skill' => 'reading'],
            ['question_text' => 'Read: "Despite the economic downturn, the tech sector remains resilient." How is the tech sector?', 'options' => ['Failing', 'Weak', 'Strong/Recovering', 'Static'], 'correct_option' => 'Strong/Recovering', 'difficulty' => 3, 'skill' => 'reading'],
        ];

        foreach ($questions as $q) {
            \App\Models\Question::create($q);
        }
    }
}
