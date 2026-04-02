<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'overall_score',
        'cefr_level',
    ];

    /**
     * Get the user that owns the assessment.
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the skill scores for the assessment.
     */
    public function skillScores(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SkillScore::class);
    }
}
