<script setup>
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { ref, computed } from 'vue'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
  changeConfirmationCode: {
    type: Boolean,
    default: false
  }
})

const credentials = ref({
  current_password: '',
  password: '',
  password_confirmation: '',
  confirmation_code: '',
  confirmation_code_confirmation: ''
})

const errors = ref(null)

const emit = defineEmits(['changedPassword'])

const changeCredentials = async () => {
  try {
    await userStore.changeCredentials(credentials.value)
    toast.success('Credentials have been changed.')
    emit('changedPassword')
    router.back()
  } catch (error) {
    if (error.response.status == 422) {
      errors.value = error.response.data.errors
      toast.error('Credentials have not been changed due to validation errors!')
    } else {
      toast.error('Credentials have not been changed due to unknown server error!')
    }
  }
}

const title = computed(() => {
  if (props.changeConfirmationCode) {
    return 'Change Confirmation Code'
  } else {
    return 'Change Password'
  }
})
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="changeCredentials">
    <h3 class="mt-5 mb-3">{{ title }}</h3>
    <hr>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputCurrentPassword" class="form-label">Current Password</label>
        <input type="password" class="form-control" id="inputCurrentPassword" required v-model="credentials.current_password">
        <field-error-message :errors="errors" fieldName="current_password"></field-error-message>
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3" v-if="!props.changeConfirmationCode">
        <label for="inputPassword" class="form-label">New Password</label>
        <input type="password" class="form-control" id="inputPassword" required v-model="credentials.password">
        <field-error-message :errors="errors" fieldName="password"></field-error-message>
      </div>
      <div class="mb-3" v-else>
        <label for="inputConfirmationCode" class="form-label">New Confirmation Code</label>
        <input type="password" class="form-control" id="inputConfirmationCode" required v-model="credentials.confirmation_code">
        <field-error-message :errors="errors" fieldName="confirmation_code"></field-error-message>
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3" v-if="!props.changeConfirmationCode">
        <label for="inputPasswordConfirm" class="form-label">Password Confirmation</label>
        <input type="password" class="form-control" id="inputPasswordConfirm" required v-model="credentials.password_confirmation">
        <field-error-message :errors="errors" fieldName="password_confirmation"></field-error-message>
      </div>
      <div class="mb-3" v-else>
        <label for="inputConfirmationCodeConfirm" class="form-label">Code Confirmation</label>
        <input type="password" class="form-control" id="inputConfirmationCodeConfirm" required v-model="credentials.confirmation_code_confirmation">
        <field-error-message :errors="errors" fieldName="confirmation_code_confirmation"></field-error-message>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-primary px-5" @click="changeCredentials">{{ title }}</button>
    </div>
  </form>
</template>

