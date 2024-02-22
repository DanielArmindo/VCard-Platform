<script setup>
import { useToast } from "vue-toastification"
import { ref, watch, computed, inject } from "vue"
import { useUserStore } from "../../stores/user.js"

const axios = inject("axios")

const userStore = useUserStore()
const toast = useToast()


const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: true,
  },
  showName: {
    type: Boolean,
    default: true,
  },
  showType: {
    type: Boolean,
    default: true,
  },

  showEditButton: {
    type: Boolean,
    default: true,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["edit", "deleted"]);

const editingCategories = ref(props.categories);

const categoryToDelete = ref(null);

const deleteConfirmationDialog = ref(null);

watch(
  () => props.categories,
  (newCategories) => {
    editingCategories.value = newCategories;
  }
);

const editClick = (category) => {
  emit("edit", category);
};

const deleteClick = (category) => {
  categoryToDelete.value = category;
  deleteConfirmationDialog.value.show();
};

const deleteCategoryConfirmed = async () => {
  let url = userStore.userType === 'V' ? `categories` : 'default-categories'
  try {
    const response = await axios.delete(url + '/' + categoryToDelete.value.id);
    let deletedCategory = response.data.data;
    toast.info(`Category ${categoryToDeleteName.value} was deleted.`);
    emit("deleted", deletedCategory);
  } catch (error) {
    console.log(error);
    toast.error("Error deleting category" + categoryToDeleteName.value);
  }
}

const categoryToDeleteName = computed(() => categoryToDelete.value ?
  `#${categoryToDelete.value.id} ${categoryToDelete.value.name}`
  : "")


</script>

<template>
  <confirmation-dialog ref="deleteConfirmationDialog" confirmationBtn="Delete category" :msg="`Are you sure you want to delete the category ${categoryToDeleteName}?`" @confirmed="deleteCategoryConfirmed"></confirmation-dialog>

  <table class="table">
    <thead>
      <tr>
        <th v-if="showId">Id</th>
        <th>Name</th>
        <th>Type</th>
        <th v-if="showEditButton || showDeleteButton"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in editingCategories" :key="category.id">
        <td v-if="showId">{{ category.id }}</td>
        <td>{{ category.name }}</td>
        <td>{{ category.type }}</td>
        <td class="text-end" v-if="showEditButton || showDeleteButton">
          <div class="d-flex justify-content-end">
            <button class="btn btn-xs btn-light" @click="editClick(category)" v-if="showEditButton">
              <i class="bi bi-xs bi-pencil"></i>
            </button>
            <button class="btn btn-xs btn-light" @click="deleteClick(category)" v-if="showDeleteButton">
              <i class="bi bi-xs bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}
</style>