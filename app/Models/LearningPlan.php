<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningPlan extends Model
{
    protected $fillable = [
        'user_id',
        'plan_data',
        'version',
    ];

    protected $casts = [
        'plan_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
