<script setup>
import { useToast } from "vue-toastification"
import { useUserStore } from '../../stores/user.js'
import { ref, watch, inject } from 'vue'
import AdminDetail from "./AdminDetail.vue"
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const axios = inject("axios")
const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
    id: {
        type: Number,
        default: null
    }
})

const newAdmin = () => {
    return {
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    }
}

const admin = ref(newAdmin())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)
let originalValueStr = ''

const inserting = (id) => !id || (id < 0)
const loadadmin = async (id) => {
    originalValueStr = ''
    errors.value = null
    if (inserting(id)) {
        admin.value = newAdmin()
    } else {
        try {
            const response = await axios.get('admins/' + id)
            admin.value = response.data.data
            originalValueStr = JSON.stringify(admin.value)
        } catch (error) {
            console.log(error)
        }
    }
}

const save = async (adminToSave) => {
    errors.value = null
    if (inserting(props.id)) {
        try {
            const response = await axios.post('admins', adminToSave)
            admin.value = response.data.data
            originalValueStr = JSON.stringify(admin.value)
            toast.success('Admin #' + admin.value.id + ' was created successfully.')
            router.back()
        } catch (error) {
            if (error.response.status == 422) {
                errors.value = error.response.data.errors
                toast.error('Admin was not created due to validation errors!')
            } else {
                toast.error('Admin was not created due to unknown server error!')
            }
        }
    } else {
        try {
            const response = await axios.put('admins/' + props.id, adminToSave)
            admin.value = response.data.data
            originalValueStr = JSON.stringify(admin.value)
            toast.success('Admin #' + admin.value.id + ' was updated successfully.')
            if (admin.value.id == userStore.adminId) {
                await userStore.loadadmin()
            }
            router.back()
        } catch (error) {
            if (error.response.status == 422) {
                errors.value = error.response.data.errors
                toast.error('Admin #' + props.id + ' was not updated due to validation errors!')
            } else {
                toast.error('Admin #' + props.id + ' was not updated due to unknown server error!')
            }
        }
    }
}

const cancel = () => {
    originalValueStr = JSON.stringify(admin.value)
    router.back()
}

watch(
    () => props.id,
    (newValue) => {
        loadadmin(newValue)
    },
    { immediate: true }
)

let nextCallBack = null
const leaveConfirmed = () => {
    if (nextCallBack) {
        nextCallBack()
    }
}

onBeforeRouteLeave((to, from, next) => {
    nextCallBack = null
    let newValueStr = JSON.stringify(admin.value)
    if (originalValueStr != newValueStr) {
        nextCallBack = next
        confirmationLeaveDialog.value.show()
    } else {
        next()
    }
})


</script>

<template>
    <confirmation-dialog ref="confirmationLeaveDialog" confirmationBtn="Discard changes and leave" msg="Do you really want to leave? You have unsaved changes!" @confirmed="leaveConfirmed">
    </confirmation-dialog>

    <admin-detail :admin="admin" :errors="errors" :inserting="inserting(id)" @save="save" @cancel="cancel"></admin-detail>
</template>
