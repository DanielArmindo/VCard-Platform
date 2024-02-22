<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Transaction;

class TransactionPolicy
{
    public function view(User $user, Transaction $model)
    {
        return $user->username == $model->vcard;
    }

    public function update(User $user, Transaction $model)
    {
        return $user->username == $model->vcard;
    }

    public function delete(User $user, Transaction $model)
    {
        return false;
    }
}
