<script setup>
import { useToast } from 'vue-toastification'
import { useUserStore } from '../../stores/user.js'
import { ref, watch, inject, onMounted } from 'vue'
import VcardDetail from './VCardDetail.vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const axios = inject('axios')
const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const socket = inject("socket")

const props = defineProps({
  phoneNumber: {
    type: Number,
    required: true,
    default: '',
  },
})

const newVcard = () => {
  return {
    phone_number: '',
    name: '',
    email: '',
    photo_url: '',
    password: '',
    confirmation_code: '',
  }
}

const vcard = ref(newVcard())
const errors = ref({})
const confirmDialog = ref(null)

let originalValueStr = ''

let blocked = ref(0)
let max_debit = ref(0)

// Confirmation dialog attributes
var confirmationBtn = ref('')
var msg = ref('')
var deleteOperation = ref(false)
var showInputPassword = ref(false)
var showInputConfirmationCode = ref(false)
var confirmed = ref(null)

const inserting = (phoneNumber) => !phoneNumber || (phoneNumber < 0)

const loadVcard = async (phoneNumber) => {
  originalValueStr = ''
  errors.value = null
  if (inserting(phoneNumber)) {
    vcard.value = newVcard()
  } else {
    try {

      const response = await axios.get('vcards/' + phoneNumber)
      vcard.value = response.data.data
      blocked.value = vcard.value.blocked
      max_debit.value = vcard.value.max_debit

      originalValueStr = JSON.stringify(vcard.value)

    } catch (error) {
      console.log(error)
    }
  }
}

const save = async (vcardToSave) => {
  errors.value = null
  if (inserting(props.phoneNumber)) {
    try {

      const response = await axios.post('vcards', vcardToSave)
      vcard.value = response.data.data

      originalValueStr = JSON.stringify(vcard.value)

      toast.success('VCard #' + vcard.value.phone_number + ' was registered successfully.')

      await userStore.login({
        username: vcard.value.phone_number,
        password: vcardToSave.password,
      })

      router.push({ name: 'Dashboard' })

    } catch (error) {

      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Vcard was not registered due to validation errors!')
      } else {
        toast.error('Vcard was not registered due to unknown server error!')
      }

    }
  } else {
    try {
      let response = null

      if (userStore.userType != 'A') {
        response = await axios.put('vcards/' + props.phoneNumber, vcardToSave)
      } else {
        response = await axios.patch('vcards/' + props.phoneNumber, vcardToSave)
      }

      if (blocked.value == 0 && vcardToSave.blocked == 1) {
        socket.emit('blockedVCard', userStore.user, vcard.value)
      } else if (blocked.value == 1 && vcardToSave.blocked == 0) {
        socket.emit('unblockedVCard', userStore.user, vcard.value)
      }

      if (max_debit.value != vcardToSave.max_debit) {
        socket.emit('maxDebitUpdated', vcard.value)
      }

      vcard.value = response.data.data

      originalValueStr = JSON.stringify(vcard.value)

      toast.success('VCard #' + vcard.value.phone_number + ' was updated successfully.')

      if (vcard.value.phone_number == userStore.userId) {
        await userStore.loadUser()
      }

      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Vcard #' + props.phoneNumber + ' was not updated due to validation errors!')
      } else {
        toast.error('Vcard #' + props.phoneNumber + ' was not updated due to unknown server error!')
      }
    }
  }
}

const cancel = () => {
  originalValueStr = JSON.stringify(vcard.value)
  router.back()
}

const deleteClick = () => {
  confirmationBtn.value = 'Delete Vcard'

  userStore.userType != 'A' ? msg.value = "Do you really want to delete your Vcard account?"
    : msg.value = "Do you really want to delete the Vcard #" + vcard.value.phone_number + " (" + vcard.value.name + ") ?"

  deleteOperation.value = true
  confirmed.value = deleteConfirmed

  userStore.userType != 'A' ? showInputPassword.value = showInputConfirmationCode.value = true
    : showInputPassword.value = showInputConfirmationCode.value = false

  confirmDialog.value.show()
}

const deleteConfirmed = (password, confirmationCode) => {
  confirmDialog.value.hide()
  deleteVcard(password, confirmationCode)
}

const deleteVcard = async (password, confirmationCode) => {
  errors.value = null
  try {
    var response = null

    if (userStore.userType != 'A') {
      response = await axios.delete('vcards/' + props.phoneNumber, { data: { password: password, confirmation_code: confirmationCode } })
    } else {
      response = await axios.delete('vcards/' + props.phoneNumber)
    }

    vcard.value = response.data.data
    originalValueStr = JSON.stringify(vcard.value)

    if (userStore.userType != 'A') {
      toast.info('Your VCard account was deleted successfully.')
      userStore.logout()
    } else {
      toast.info('VCard #' + vcard.value.phone_number + ' was deleted successfully.')
    }
    socket.emit("deletedVCard", userStore.user, vcard.value)
    router.back()
  } catch (error) {
    if (error.response.status == 422) {
      errors.value = error.response.data.errors
      toast.error('Vcard #' + vcard.value.phone_number + ' was not deleted due to validation errors!')
    }
    else {
      toast.error(error.response.data.message)
    }
  }
}

watch(
  () => props.phoneNumber,
  (newValue) => {
    loadVcard(newValue)
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
  let newValueStr = JSON.stringify(vcard.value)
  if (originalValueStr != newValueStr) {
    nextCallBack = next

    confirmationBtn.value = 'Discard changes and leave'
    msg.value = "Do you really want to leave? You have unsaved changes!"
    deleteOperation.value = false
    showInputPassword.value = showInputConfirmationCode.value = false
    confirmed.value = leaveConfirmed

    confirmDialog.value.show()
  } else {
    next()
  }
})

</script>

<template>
  <confirmation-dialog ref="confirmDialog" :confirmationBtn="confirmationBtn" :msg="msg" :deleteOperation="deleteOperation" :showInputPassword="showInputPassword" :showInputConfirmationCode="showInputConfirmationCode" @confirmed="confirmed">
  </confirmation-dialog>

  <vcard-detail :vcard="vcard" :errors="errors" :inserting="inserting(phoneNumber)" @save="save" @cancel="cancel" @delete="deleteClick"></vcard-detail>
</template>