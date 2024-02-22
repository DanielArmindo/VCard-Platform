<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Passport\HasApiTokens;

class Vcard extends Model
{
    use HasFactory, SoftDeletes, HasApiTokens;

    protected $primaryKey = 'phone_number';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'phone_number',
        'name',
        'email',
        'photo_url',
        'password',
        'confirmation_code',
        'blocked',
        'balance',
        'max_debit',
        'custom_options',
        'custom_data',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'confirmation_code',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
        'confirmation_code' => 'hashed',
    ];

    protected $attributes = [
        'blocked' => 0,
        'balance' => 0,
        'max_debit' => 5000,
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'vcard', 'phone_number');
    }

    public function transactionsPairVcard(): HasMany
    {
        return $this->hasMany(Transaction::class, 'pair_vcard', 'phone_number');
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class, 'vcard', 'phone_number');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'phone_number');
    }
}
