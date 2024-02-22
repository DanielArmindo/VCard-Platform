<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use App\Models\Category;
use App\Models\Vcard;
use App\Policies\VCardPolicy;
use App\Policies\CategoryPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Vcard::class => VCardPolicy::class,
        Category::class => CategoryPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('isAdmin', function ($user) {
            return $user->user_type === 'A';
        });

        Gate::define('isVCard', function ($user) {
            return $user->user_type === 'V';
        });

        
    }
}
