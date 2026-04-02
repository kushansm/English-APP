<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SkillScore extends Model
{
    protected $fillable = [
        'assessment_id',
        'skill',
        'score',
    ];

    /**
     * Get the assessment that owns the skill score.
     */
    public function assessment(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }
}
