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
        Schema::table('mastery_records', function (Blueprint $table) {
            $table->integer('current_difficulty')->default(1);
            $table->integer('consecutive_correct')->default(0);
            $table->integer('consecutive_incorrect')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mastery_records', function (Blueprint $table) {
            $table->dropColumn(['current_difficulty', 'consecutive_correct', 'consecutive_incorrect']);
        });
    }
};
