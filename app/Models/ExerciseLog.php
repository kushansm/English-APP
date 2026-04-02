<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExerciseLog extends Model
{
    protected $fillable = [
        'user_id',
        'topic',
        'skill',
        'is_correct',
        'difficulty',
        'mastery_score_at_time',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
