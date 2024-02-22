<script setup>
import { ref, computed, inject } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'
import { useToast } from "vue-toastification"
import { useUserStore } from "../../stores/user";

const axios = inject('axios')
const socket = inject("socket")
const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()
const toast = useToast()

const props = defineProps({
    admins: {
        type: Array,
        default: () => [],
    },
    showId: {
        type: Boolean,
        default: true,
    },
    showEmail: {
        type: Boolean,
        default: true,
    },
    showPhoto: {
        type: Boolean,
        default: true,
    },
    showDeleteButton: {
        type: Boolean,
        default: true,
    },
    showEditButton: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(["deleted", "edit"])

const adminToDelete = ref(null)
const deleteConfirmationDialog = ref(null)

const deleteClick = (admin) => {
    adminToDelete.value = admin
    deleteConfirmationDialog.value.show()
}

const editClick = (admin) => {
    emit("edit", admin)
}

const deleteAdminConfirmed = async () => {
    try {
        const response = await axios.delete('admins/' + adminToDelete.value.id)
        let deletedAdmin = response.data.data
        toast.info(`Admin ${adminToDeleteName.value} was deleted`)
        socket.emit("deletedAdmin", userStore.user, deletedAdmin)
        emit("deleted", deletedAdmin)
    } catch (error) {
        console.log(error)
        toast.error(`It was not possible to delete the Admin ${adminToDeleteName.value}!`)
    }
}

const adminToDeleteName = computed(() => adminToDelete.value ? `#${adminToDelete.value.id} (${adminToDelete.value.name})` : " ")

const photoFullUrl = (admin) => { return admin.photo_url ? serverBaseUrl + "/storage/fotos/" + admin.photo_url : avatarNoneUrl; };
</script>


<template>
    <confirmation-dialog ref="deleteConfirmationDialog" confirmationBtn="Delete Admin" :msg="`Do you really want to delete the Admin ${adminToDeleteName}?`" @confirmed="deleteAdminConfirmed">
    </confirmation-dialog>

    <table class="table">
        <thead>
            <tr>
                <th v-if="showId" class="align-middle">#</th>
                <th v-if="showPhoto" class="align-middle">Photo</th>
                <th class="align-middle">Name</th>
                <th v-if="showEmail" class="align-middle">Email</th>
                <th v-if="showDeleteButton"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="admin in admins" :key="admin.id">
                <td v-if="showId" class="align-middle">{{ admin.id }}</td>
                <td v-if="showPhoto" class="align-middle">
                    <img :src="photoFullUrl(admin)" class="rounded-circle img_photo" />
                </td>
                <td class="align-middle">{{ admin.name }}</td>
                <td v-if="showEmail" class="align-middle">{{ admin.email }}</td>
                <td class="text-end" v-if="showDeleteButton || showEditButton">
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-xs btn-light" @click="editClick(admin)" v-if="showEditButton && (admin.id == userStore.userId)">
                            <i class="bi bi-xs bi-pencil"></i>
                        </button>
                        <button class="btn btn-xs btn-light" @click="deleteClick(admin)" v-if="showDeleteButton && (admin.id != userStore.userId)">
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

.img_photo {
    width: 3.2rem;
    height: 3.2rem;
}
</style>
