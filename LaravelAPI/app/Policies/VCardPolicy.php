<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vcard;

class VCardPolicy
{
    public function view(User $user, Vcard $model)
    {
        return $user->username == $model->phone_number || $user->user_type == "A";
    }
    public function viewHimSelf(User $user, Vcard $model)
    {
        return $user->username == $model->phone_number;
    }

    public function update(User $user, Vcard $model)
    {
        return $user->username == $model->phone_number && $user->user_type == "V";
    }

    public function delete(User $user, Vcard $model)
    {
        return $user->user_type == "A" || $user->username == $model->phone_number;
    }

    public function updateConfirmationCode(User $user, Vcard $model)
    {
        return $user->username == $model->phone_number && $user->user_type == "V";
    }
}
