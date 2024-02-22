<script setup>
import { ref, watch, computed, inject } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'

const serverBaseUrl = inject("serverBaseUrl");

const props = defineProps({
    admin: {
        type: Object,
        required: true,
    },
    inserting: {
        type: Boolean,
        default: false,
    },
    errors: {
        type: Object,
        required: false,
    },
});

const emit = defineEmits(["save", "cancel"]);

const editingAdmin = ref(props.admin)

const inputPhotoFile = ref(null)
const editingImageAsBase64 = ref(null)
const deletePhotoOnTheServer = ref(false)

watch(
    () => props.admin,
    (newAdmin) => {
        editingAdmin.value = newAdmin
    },
    { immediate: true }
)

const photoFullUrl = computed(() => {
    if (deletePhotoOnTheServer.value) {
        return avatarNoneUrl
    }
    if (editingImageAsBase64.value) {
        return editingImageAsBase64.value
    } else {
        return editingAdmin.value.photo_url
            ? serverBaseUrl + "/storage/fotos/" + editingAdmin.value.photo_url
            : avatarNoneUrl
    }
})

const adminTitle = computed(() => {
    if (!editingAdmin.value) {
        return ''
    }
    return props.inserting ? 'Register a new admin' : 'Admin #' + editingAdmin.value.id
})

const save = () => {
    const adminToSave = editingAdmin.value
    adminToSave.deletePhotoOnServer = deletePhotoOnTheServer.value
    adminToSave.base64ImagePhoto = editingImageAsBase64.value
    emit("save", adminToSave);
}

const cancel = () => {
    emit("cancel", editingAdmin.value);
}

// When changing the photo file, change the editingImageAsBase64.value
const changePhotoFile = () => {
    try {
        const file = inputPhotoFile.value.files[0]
        if (!file) {
            editingImageAsBase64.value = null
        } else {
            const reader = new FileReader()
            reader.addEventListener(
                'load',
                () => {
                    // convert image file to base64 string
                    editingImageAsBase64.value = reader.result
                    deletePhotoOnTheServer.value = false
                },
                false,
            )
            if (file) {
                reader.readAsDataURL(file)
            }
        }
    } catch (error) {
        editingImageAsBase64.value = null
    }
}

</script>

<template>
    <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
        <h3 class="mt-5 mb-3">{{ adminTitle }}</h3>
        <hr />
        <div class="d-flex flex-wrap justify-content-between">
            <div class="w-75 pe-4">
                <div class="mb-3">
                    <label for="inputName" class="form-label">Name</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['name'] : false }" id="inputName" placeholder="User Name" required v-model="editingAdmin.name" />
                    <field-error-message :errors="errors" fieldName="name"></field-error-message>
                </div>

                <div class="mb-3 px-1">
                    <label for="inputEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" :class="{ 'is-invalid': errors ? errors['email'] : false }" id="inputEmail" placeholder="Email" required v-model="editingAdmin.email" />
                    <field-error-message :errors="errors" fieldName="email"></field-error-message>
                </div>
                <div class="mb-3" v-if="inserting">
                    <label for="inputPassword" class="form-label">Password</label>
                    <input type="password" class="form-control" :class="{ 'is-invalid': errors ? errors['password'] : false }" id="inputPassword" v-model="editingAdmin.password" />
                    <field-error-message :errors="errors" fieldName="password"></field-error-message>
                </div>
                <div class="mb-3" v-if="inserting">
                    <label for="inputPasswordConfirmation" class="form-label">Password Confirmation</label>
                    <input type="password" class="form-control" :class="{ 'is-invalid': errors ? errors['password_confirmation'] : false }" id="inputPasswordConfirmation" v-model="editingAdmin.password_confirmation" />
                    <field-error-message :errors="errors" fieldName="password_confirmation"></field-error-message>
                </div>
            </div>
            <div class="w-25">
                <div class="d-flex flex-column">
                    <label class="form-label">Photo</label>
                    <div class="form-control text-center">
                        <img :src="photoFullUrl" class="w-100" />
                    </div>
                    <div>
                        <field-error-message :errors="errors" fieldName="base64ImagePhoto"></field-error-message>
                    </div>
                </div>
            </div>
        </div>
        <hr />
        <div class="mt-2 d-flex justify-content-end">
            <button type="button" class="btn btn-primary px-5 mx-2" @click="save">Save</button>
            <button type="button" class="btn btn-light px-5 mx-2" @click="cancel">Cancel</button>
        </div>
    </form>
    <input type="file" style="visibility:hidden;" id="inputPhoto" ref="inputPhotoFile" @change="changePhotoFile" />
</template>

<style scoped>
.total_hours {
    width: 26rem;
}
</style>
