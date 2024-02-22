<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
    operationType: {
        type: String,
        default: 'insert'
    },
    errors: {
        type: Object,
        required: false,
    },
});

const emit = defineEmits(["save", "cancel"]);

const editingCategory = ref(props.category)

watch(
    () => props.category,
    (newCategory) => {
        editingCategory.value = newCategory
    }
)

const categotyTitle = computed(() => {
    if (!editingCategory.value) {
        return ''
    }
    return props.operationType == 'insert' ? 'New Category' : 'Category #' + editingCategory.value.id
})

const save = () => {
    emit("save", editingCategory.value);
}

const cancel = () => {
    emit("cancel", editingCategory.value);
}
</script>

<template>
    <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
        <h3 class="mt-5 mb-3">{{ categotyTitle }}</h3>
        <hr />
        <div class="mb-3">
            <label for="inputName" class="form-label">Name</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['name'] : false }" id="inputName" placeholder="Category Name" v-model="editingCategory.name" required>
            <field-error-message :errors="errors" fieldName="name"></field-error-message>
        </div>
        <div class="mb-3">
            <label for="inputType" class="form-label">Type</label>
            <select class="form-select" :class="{ 'is-invalid': errors ? errors['type'] : false }" id="inputType" v-model="editingCategory.type" required>
                <option value="C">Credit</option>
                <option value="D">Debit</option>
            </select>
            <field-error-message :errors="errors" fieldName="type"></field-error-message>
        </div>
        <div class="mb-3 d-flex justify-content-end">
            <button type="button" class="btn btn-primary px-5" @click="save">Save</button>
            <button type="button" class="btn btn-light px-5" @click="cancel">Cancel</button>
        </div>
    </form>
</template>

<style scoped></style>