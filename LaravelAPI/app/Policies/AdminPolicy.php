<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Admin;

class AdminPolicy
{
    public function viewAny(User $user)
    {
        return $user->user_type == "A";
    }

    public function view(User $user, Admin $model)
    {
        return $user->user_type == "A" && $user->id == $model->id;
    }

    public function create(User $user)
    {
        return $user->user_type == "A";
    }

    public function update(User $user, Admin $model)
    {
        return $user->user_type == "A" && $user->id == $model->id;
    }

    public function delete(User $user)
    {
        return $user->user_type == "A";
    }
}
