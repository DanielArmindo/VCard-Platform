<?php

namespace App\Http\Controllers;

use App\Models\DefaultCategory;
use App\Http\Resources\CategoryResource;
use App\Http\Requests\StoreUpdateDefaultCategoryRequest;

class DefaultCategoryController extends Controller
{

    //Referece sempre à tabela default_categories

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CategoryResource::Collection(DefaultCategory::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUpdateDefaultCategoryRequest $request)
    {
        $newCategory = DefaultCategory::create($request->validated());
        return new CategoryResource($newCategory);
    }

    /**
     * Display the specified resource.
     */
    public function show(DefaultCategory $defaultCategory)
    {
        return new CategoryResource($defaultCategory);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUpdateDefaultCategoryRequest $request, DefaultCategory $defaultCategory)
    {
        $data = $request->validated();
        $defaultCategory->update($data);
        return new CategoryResource($defaultCategory);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DefaultCategory $defaultCategory)
    {
        $defaultCategory->delete();
        return new CategoryResource($defaultCategory);
    }
}
