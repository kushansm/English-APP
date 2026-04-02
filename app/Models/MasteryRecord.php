<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasteryRecord extends Model
{
    protected $fillable = [
        'user_id',
        'topic',
        'skill',
        'mastery_score',
        'streak',
        'last_attempted_at',
    ];

    protected $casts = [
        'last_attempted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
