<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vcard',
        'type',
        'value',
        'date',
        'datetime',
        'old_balance',
        'new_balance',
        'payment_type',
        'payment_reference',
        'pair_transaction',
        'pair_vcard',
        'category_id',
        'description',
        'custom_options',
        'custom_data'
    ];

    public function vcardRef(): BelongsTo
    {
        return $this->belongsTo(Vcard::class, 'vcard', 'phone_number');
    }

    public function pair_vcardRef(): BelongsTo
    {
        return $this->belongsTo(Vcard::class, 'pair_vcard', 'phone_number');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id')->withTrashed();
    }

    public function pair_transactionRef(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'pair_transaction', 'id');
    }
}
