<?php

namespace App\Services;

use App\Models\LearnerProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LearnerProfileService
{
    /**
     * Get the latest learner profile for a user.
     */
    public function getLatestProfile(User $user): ?LearnerProfile
    {
        return $user->latestLearnerProfile;
    }

    /**
     * Create a new version of the learner profile.
     */
    public function createNewVersion(User $user, array $data): LearnerProfile
    {
        return DB::transaction(function () use ($user, $data) {
            $latestProfile = $this->getLatestProfile($user);
            $newVersion = $latestProfile ? $latestProfile->version + 1 : 1;

            $data['user_id'] = $user->id;
            $data['version'] = $newVersion;

            return LearnerProfile::create($data);
        });
    }
}
