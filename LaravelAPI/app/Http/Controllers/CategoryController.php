<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Resources\CategoryResource;
use App\Http\Requests\StoreUpdateCategoryRequest;
use App\Models\Vcard;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Category::class);
        return CategoryResource::Collection(Category::paginate(10));
    }

    public function getCategoriesOfVCard(Request $request, Vcard $vcard)
    {
        $this->authorize('view', $vcard);
        $categories = $vcard->categories; //->paginate(10)
        return CategoryResource::Collection($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUpdateCategoryRequest $request)
    {
        $newCategory = Category::create($request->validated());
        return new CategoryResource($newCategory);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $this->authorize('view', $category);
        CategoryResource::$format = 'withVCard';
        return new CategoryResource($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUpdateCategoryRequest $request, Category $category)
    {
        $this->authorize('update', $category);
        $category->update($request->validated());
        return new CategoryResource($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);
        if ($category->transactions()->count() == 0) {
            $category->forceDelete();
        }
        $category->delete();
        return new CategoryResource($category);
    }

    public function getStatisticsOfVCard(Vcard $vcard)
    {
        $this->authorize('view', $vcard);

        // Money spent in each category
        $categories = $vcard->categories;
        $moneySpentByCategory = [];
        foreach ($categories as $category) {
            $moneySpentByCategory[$category->name] = $category->transactions()->sum('value');
        }

        return response()->json([
            'moneySpentByCategory' => $moneySpentByCategory,
        ]);
    }
}
