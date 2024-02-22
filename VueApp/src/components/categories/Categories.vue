<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, inject } from 'vue'
import { useUserStore } from '../../stores/user.js'
import CategoryTable from "./CategoryTable.vue"

const axios = inject('axios')

const userStore = useUserStore()
const router = useRouter()
const categories = ref([])
const filterByName = ref('')
const filterByType = ref('')

const props = defineProps({
    categoriesTitle: {
        type: String,
        default: 'Categories'
    },
})

const loadCategories = async () => {
    let url = userStore.userType === 'V' ? `vcards/${userStore.userId}/categories` : 'default-categories'
    try {
        const response = await axios.get(url)
        categories.value = response.data.data
    } catch (error) {
        console.log(error)
    }
}

const addCategory = () => {
    router.push({ name: 'NewCategory' })
}

const editCategory = (category) => {
    router.push({ name: 'Category', params: { id: category.id } })
}

const deleteCategory = (deletedCategory) => {
    let idx = categories.value.findIndex((c) => c.id === deletedCategory.id)
    if (idx >= 0) {
        categories.value.splice(idx, 1)
    }
}


const filteredCategories = computed(() => {
    return categories.value.filter(c =>
        (filterByName.value == '' || c.name.toLowerCase().includes(filterByName.value.toLowerCase())) &&
        (filterByType.value == '' || c.type == filterByType.value))
})

const totalCategories = computed(() => {
    return filteredCategories.value.length
})

const showId = computed(() => {
    return userStore.userType == 'A'
})

onMounted(() => {
    loadCategories()
})
</script>

<template>
    <div class="d-flex justify-content-between">
        <div class="mx-2">
            <h3 class="mt-4">{{ categoriesTitle }}</h3>
        </div>
        <div class="mx-2 total-filtro">
            <h5 class="mt-4">Total: {{ totalCategories }}</h5>
        </div>
    </div>
    <hr>
    <div class="mb-3 d-flex justify-content-between flex-wrap">
        <div class="mx-2 mt-2 flex-grow-1 filter-div">
            <label for="inputName" class="form-label">Filter by name:</label>
            <input type="text" class="form-control" placeholder="Search by name" v-model="filterByName" />
        </div>
        <div class="mx-2 mt-2 flex-grow-1 filter-div">
            <label for="selectType" class="form-label">Filter by type:</label>
            <select id="selectType" class="form-select" v-model="filterByType">
                <option value="">All</option>
                <option value="C">Credit</option>
                <option value="D">Debit</option>
            </select>
        </div>
        <div class="mx-2 mt-2">
            <button type="button" class="btn btn-success px-4 btn-addcategory" @click="addCategory"><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Category</button>
        </div>
    </div>
    <category-table :categories="filteredCategories" :showId="showId" :showName="true" :showType="true" @edit="editCategory" @deleted="deleteCategory"></category-table>
</template>

<style scoped>
.filter-div {
    min-width: 12rem;
}

.total-filtro {
    margin-top: 0.35rem;
}

.btn-addcategory {
    margin-top: 1.85rem;
}
</style>