<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Passport\HasApiTokens;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "categories";
    public $timestamps = false;

    protected $fillable = [
        'name',
        'type',
        'vcard',
    ];


    public function vcard(): BelongsTo
    {
        return $this->belongsTo(Vcard::class, 'vcard', 'phone_number');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'category_id');
    }
}
