<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ErrorLog extends Model
{
    protected $fillable = [
        'user_id',
        'topic',
        'error_pattern',
        'occurrence_count',
        'last_occurred_at',
    ];

    protected $casts = [
        'last_occurred_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
