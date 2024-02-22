<script setup>
import { useToast } from "vue-toastification"
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, watch, computed, inject } from 'vue'
import { useUserStore } from '../../stores/user.js'
import CategoryDetail from "./CategoryDetail.vue"

const axios = inject('axios')

const userStore = useUserStore()
const toast = useToast()

const router = useRouter()

const props = defineProps({
    id: {
        type: Number,
        default: null
    }
})

const categoryToSave = () => {
    return {
        id: null,
        vcard: userStore.userType === 'V' ? userStore.userId : null,
        name: '',
        type: 'C', //Default to Credit
    }
}

const category = ref(categoryToSave())

const errors = ref(null)

const confirmationLeaveDialog = ref(null)

let originalValueStr = ''

let url = userStore.userType === 'V' ? `categories` : 'default-categories'

const loadCategory = async (id) => {
    originalValueStr = ''
    errors.value = null
    if (!id || (id < 0)) {
        category.value = categoryToSave()
        originalValueStr = JSON.stringify(category.value)
    } else {
        try {
            const response = await axios.get(url + '/' + id)
            category.value = response.data.data
            originalValueStr = JSON.stringify(category.value)
        } catch (error) {
            console.log(error)
        }
    }
}

const save = async () => {
    errors.value = null
    if (operation.value == 'insert') {
        try {
            const response = await axios.post(url, category.value)
            category.value = response.data.data
            originalValueStr = JSON.stringify(category.value)
            toast.success(`Category ${category.value.name} was created successfully!`)
            router.back()
        } catch (error) {
            if (error.response.status == 422) {
                errors.value = error.response.data.errors
                toast.error('Category was not created due to validation errors!')
            } else {
                toast.error('Category was not created due to unknown server error!')
            }
        }
    } else {
        try {
            const response = await axios.put(url + '/' + props.id, category.value)
            category.value = response.data.data
            originalValueStr = JSON.stringify(category.value)
            toast.success(`Category ${category.value.name} was updated successfully!`)
            router.back()
        } catch (error) {
            if (error.response.status == 422) {
                errors.value = error.response.data.errors
                toast.error(`Category #${props.id} was not updated due to validation errors!`)
            } else {
                toast.error(`Category #${props.id} was not updated due to unknown server error!`)
            }
        }
    }
}

const cancel = () => {
    originalValueStr = JSON.stringify(category.value)
    router.back()
}

const operation = computed(() => (!props.id || props.id < 0) ? 'insert' : 'update')

watch(
    () => props.id,
    (newValue) => {
        loadCategory(newValue)
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
    let newValueStr = JSON.stringify(category.value)
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
    <category-detail :operationType="operation" :category="category" :errors="errors" @save="save" @cancel="cancel"></category-detail>
</template>