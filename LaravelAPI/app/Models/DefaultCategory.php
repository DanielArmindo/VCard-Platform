<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DefaultCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "default_categories";
    public $timestamps = false;

    protected $fillable = [
        'name',
        'type',
    ];
}
