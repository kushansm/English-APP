<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Assessment;
use App\Models\LearnerProfile;
use App\Models\LearningPlan;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the learner profiles for the user.
     */
    public function learnerProfiles(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LearnerProfile::class);
    }

    /**
     * Get the latest learner profile for the user.
     */
    public function latestLearnerProfile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(LearnerProfile::class)->latestOfMany('version');
    }

    /**
     * Get the assessments for the user.
     */
    public function assessments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Assessment::class);
    }

    public function learningPlans()
    {
        return $this->hasMany(LearningPlan::class);
    }

    public function latestLearningPlan()
    {
        return $this->hasOne(LearningPlan::class)->latestOfMany();
    }
}
