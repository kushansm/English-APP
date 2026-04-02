<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('learner_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('target_exam'); // IELTS, TOEFL, Business, Academic, General
            $table->string('target_level'); // A1–C2
            $table->date('target_date');
            $table->integer('daily_minutes');
            $table->string('learning_style'); // active, passive, balanced
            $table->string('age_group');
            $table->jsonb('interests');
            $table->jsonb('focus_areas');
            $table->text('custom_focus')->nullable();
            $table->integer('version')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learner_profiles');
    }
};
