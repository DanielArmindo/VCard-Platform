<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import AdminTable from "./AdminTable.vue"

const axios = inject('axios')
const router = useRouter()
const admins = ref([])

const loadAdmins = async (page = 1) => {
    try {
        const response = await axios.get(`admins?page=${page}`)
        //admins.value = response.data
        admins.value = response.data.data
    } catch (error) {
        console.log(error)
    }
}

const deletedAdmin = (deletedAdmin) => {
    // let idx = admins.value.data.findIndex((admin) => admin.id === deletedAdmin.id)
    let idx = admins.value.findIndex((admin) => admin.id === deletedAdmin.id)
    if (idx >= 0) {
        // admins.value.data.splice(idx, 1)
        admins.value.splice(idx, 1)
    }
}

const editAdmin = (admin) => {
    router.push({ name: 'Admin', params: { id: admin.id } })
}

const addAdmin = () => {
    router.push({ name: 'NewAdmin' })
}

const totalAdmins = computed(() => {
    //return admins.value.meta.total ?? 0
    //return admins.value.data ? admins.value.data.length : 0;
    //return admins.value.meta ? admins.value.meta.total : 0;
    return admins.value.length
})

onMounted(() => {
    loadAdmins()
})

// const handlePageChange = (page) => {
//     loadAdmins(page)
// }
</script>

<template>
    <div class="d-flex justify-content-between">
        <div class="mx-2">
            <h3 class="mt-4">Admins</h3>
        </div>
        <div class="mx-2 total-filtro">
            <h5 class="mt-4">Total: {{ totalAdmins }}</h5>
        </div>
    </div>
    <hr>
    <div class="mb-3 d-flex justify-content-between flex-wrap">
        <div class="mx-2 mt-2">
            <button type="button" class="btn btn-success px-4 btn-addadmin" @click="addAdmin"><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Admin</button>
        </div>
    </div>
    <!-- <admin-table :admins="admins.data" @deleted="deletedAdmin" @edit="editAdmin"></admin-table> -->
    <admin-table :admins="admins" @deleted="deletedAdmin" @edit="editAdmin"></admin-table>
    <!-- <Pagination :data="admins" @pagination-change-page="handlePageChange" /> -->
</template>

<style scoped>
.total-filtro {
    margin-top: 0.35rem;
}

.btn-addadmin {
    margin-top: 1.85rem;
}
</style>