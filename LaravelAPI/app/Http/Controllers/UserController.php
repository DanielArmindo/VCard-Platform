<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\UpdateUserPasswordRequest;
use App\Models\Admin;
use App\Models\Vcard;

class UserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::paginate(10));
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }


    public function show_me(Request $request)
    {
        $curent_user = $request->user();
        return new UserResource($curent_user);
    }

    public function updatePassword(UpdateUserPasswordRequest $request, User $user)
    {
        $userToUpdate = $user->user_type == 'A' ? Admin::find($user->id) : Vcard::find($user->id);
        $userToUpdate->password = $request->validated()['password'];
        $userToUpdate->save();
        return new UserResource($userToUpdate);
    }
}
