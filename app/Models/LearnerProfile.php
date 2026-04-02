<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearnerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'target_exam',
        'target_level',
        'target_date',
        'daily_minutes',
        'learning_style',
        'age_group',
        'interests',
        'focus_areas',
        'custom_focus',
        'version',
        'ai_summary',
        'learning_plan',
    ];

    protected $casts = [
        'interests' => 'array',
        'focus_areas' => 'array',
        'target_date' => 'date',
        'learning_plan' => 'array',
    ];

    /**
     * Get the user that owns the learner profile.
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
