<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function view(User $user, User $model): bool
    {
        return $user->username == $model->id || $user->user_type == "A";
    }

    public function updatePassword(User $user, User $model)
    {
        return $user->id == $model->id;
    }
}
