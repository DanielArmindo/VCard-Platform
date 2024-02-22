<script setup>
import { ref, watch, computed, inject } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'

const serverBaseUrl = inject("serverBaseUrl");
const inputPhotoFile = ref(null)
const editingImageAsBase64 = ref(null)
const deletePhotoOnTheServer = ref(false)

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    errors: {
        type: Object,
        required: false,
    },
    showName: {
        type: Boolean,
        default: true,
    },
    showEmail: {
        type: Boolean,
        default: true,
    },
    showPhoneNumber: {
        type: Boolean,
        required: true,
    },
    showPhoto: {
        type: Boolean,
        required: true,
    },
});

const editingUser = ref(props.user)

const emit = defineEmits(["save", "cancel"]);


watch(
    () => props.user,
    (newUser) => {
        editingUser.value = newUser
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
        return editingUser.value.photo_url
            ? serverBaseUrl + "/storage/fotos/" + editingUser.value.photo_url
            : avatarNoneUrl
    }
})

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

const resetToOriginalPhoto = () => {
    deletePhotoOnTheServer.value = false
    inputPhotoFile.value.value = ''
    changePhotoFile()
}

const cleanPhoto = () => {
    deletePhotoOnTheServer.value = true
}

const save = () => {
    emit("save", editingUser.value);
}

const cancel = () => {
    emit("cancel", editingUser.value);
}
</script>

<template>
    <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
        <h3 class="mt-5 mb-3">User #{{ editingUser.id }}</h3>
        <hr />
        <div class="d-flex flex-wrap justify-content-between">
            <div class="w-75 pe-4">
                <div class="mb-3" v-if="showName">
                    <label for="inputName" class="form-label">Name</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['name'] : false }" id="inputName" placeholder="User Name" required v-model="editingUser.name" />
                    <field-error-message :errors="errors" fieldName="name"></field-error-message>
                </div>
                <div class="mb-3 px-1" v-if="showEmail">
                    <label for="inputEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" :class="{ 'is-invalid': errors ? errors['email'] : false }" id="inputEmail" placeholder="Email" required v-model="editingUser.email" />
                    <field-error-message :errors="errors" fieldName="email"></field-error-message>
                </div>
            </div>
            <div class="w-25" v-if="showPhoto">
                <div class="d-flex flex-column">
                    <label class="form-label">Photo</label>
                    <div class="form-control text-center">
                        <img :src="photoFullUrl" class="w-100" />
                    </div>
                    <div class="mt-3 d-flex justify-content-between flex-wrap">
                        <label for="inputPhoto" class="btn btn-dark flex-grow-1 mx-1">Carregar</label>
                        <button class="btn btn-secondary flex-grow-1 mx-1" @click.prevent="resetToOriginalPhoto" v-if="editingUser.photo_url">Repor</button>
                        <button class="btn btn-danger flex-grow-1 mx-1" @click.prevent="cleanPhoto" v-show="editingUser.photo_url || editingImageAsBase64">Apagar</button>
                    </div>
                    <div>
                        <field-error-message :errors="errors" fieldName="base64ImagePhoto"></field-error-message>
                    </div>
                </div>
            </div>
        </div>
        <hr />
        <div class="mt-2 d-flex justify-content-start">
            <button type="button" class="btn btn-primary px-5 mx-2" @click="save">Save</button>
            <button type="button" class="btn btn-light px-5 mx-2" @click="cancel">Cancel</button>
        </div>
    </form>
    <input type="file" style="visibility:hidden;" id="inputPhoto" ref="inputPhotoFile" @change="changePhotoFile" />
</template>
