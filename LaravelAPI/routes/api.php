<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VCardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DefaultCategoryController;


Route::post('auth/login', [AuthController::class, 'login']);

Route::post('vcards', [VCardController::class, 'store']);

// -- TAES --   (Rota Extra de outra Unidade Curricular)
Route::get('vcards/verify-phone-numbers', [VCardController::class, 'verifyPhoneNumbers']);

Route::middleware('auth:api')->group(function () {

    Route::post('logout', [AuthController::class, 'logout']);

    //User
    Route::get('users/me', [UserController::class, 'show_me']);
    Route::get('users', [UserController::class, 'index'])->middleware('can:isAdmin');
    Route::get('users/{user}', [UserController::class, 'show'])->middleware('can:view,user');
    Route::patch('users/{user}/password', [UserController::class, 'updatePassword'])->middleware('can:updatePassword,user');

    //Admins
    Route::middleware('can:isAdmin')->group(function () {
        Route::get('admins', [AdminController::class, 'index']);
        Route::get('admins/statistics', [AdminController::class, 'getStatistics']);
        Route::get('admins/{admin}', [AdminController::class, 'show']);
        Route::put('admins/{admin}', [AdminController::class, 'update']);
        Route::delete('admins/{admin}', [AdminController::class, 'destroy']);
        Route::post('admins', [AdminController::class, 'store']);
    });

    //Vcards
    Route::get('vcards', [VCardController::class, 'index'])->middleware('can:isAdmin');
    Route::get('vcards/{vcard}', [VCardController::class, 'show'])->middleware('can:view,vcard');
    Route::put('vcards/{vcard}', [VCardController::class, 'update'])->middleware('can:update,vcard');
    Route::patch('vcards/{vcard}', [VCardController::class, 'partialUpdate'])->middleware('can:isAdmin');
    Route::delete('vcards/{vcard}', [VCardController::class, 'destroy'])->middleware('can:delete,vcard');
    Route::patch('vcards/{vcard}/confirmation_code', [VCardController::class, 'updateConfirmationCode'])->middleware('can:updateConfirmationCode,vcard');
    Route::get('vcards/{vcard}/statistics', [VCardController::class, 'getStatistics'])->middleware('can:viewHimSelf,vcard');

    //Vcard - PiggyBank
    Route::get('vcards/{vcard}/piggybank', [VCardController::class, 'getPiggyBank'])->middleware('can:view,vcard');
    Route::patch('vcards/{vcard}/piggybank/debit', [VCardController::class, 'debitPiggyBank'])->middleware('can:update,vcard');
    Route::patch('vcards/{vcard}/piggybank/credit', [VCardController::class, 'creditPiggyBank'])->middleware('can:update,vcard');
    Route::patch('vcards/{vcard}/piggybank/sparechange', [VCardController::class, 'patchPiggyBankSpareChange'])->middleware('can:update,vcard');

    //Transactions
    Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->middleware('can:view,transaction');
    Route::post('transactions/credit', [TransactionController::class, 'credit'])->middleware('can:isAdmin');
    Route::post('transactions/debit', [TransactionController::class, 'debit'])->middleware('can:isVCard');
    Route::get('vcards/{vcard}/transactions', [TransactionController::class, 'getTransactionsOfVCard'])->middleware('can:viewHimSelf,vcard');
    Route::get('vcards/{vcard}/transactions/last', [TransactionController::class, 'getLastTransactionOfVCard'])->middleware('can:viewHimSelf,vcard');
    Route::patch('transactions/{transaction}', [TransactionController::class, 'partialUpdate'])->middleware('can:update,transaction');

    //Default Categories
    Route::apiResource('default-categories', DefaultCategoryController::class)->middleware('can:isAdmin');

    //Categories
    Route::get('categories/statistics', [CategoryController::class, 'getGlobalStatistics'])
        ->middleware('can:isAdmin'); // Global Statistics
    Route::apiResource('categories', CategoryController::class)->middleware('can:isVCard');
    Route::get('vcards/{vcard}/categories', [CategoryController::class, 'getCategoriesOfVCard']);
    Route::get('vcards/{vcard}/categories/{statistics}', [CategoryController::class, 'getStatisticsOfVCard'])
        ->middleware('can:viewHimSelf,vcard'); // Statistics of a VCard


    // -- TAES --   (Rotas Extra de outra Unidade Curricular)
    Route::get('vcards/{vcard}/name', [VCardController::class, 'showName']);
    Route::post('vcards/{vcard}/delete', [VCardController::class, 'deleteVcard']);
});
