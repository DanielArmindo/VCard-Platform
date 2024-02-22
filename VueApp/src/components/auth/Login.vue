<script setup>
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const toast = useToast()
const router = useRouter()

const errors = ref([])
const credentials = ref({
  username: '',
  password: ''
})

const emit = defineEmits(['login'])

const login = async () => {
  if (!validateUsername() || !validatePassword()) {
    return
  }
  if (await userStore.login(credentials.value)) {
    toast.success('User ' + userStore.user.name + ' has entered the application.')
    emit('login')
    router.back()
  } else {
    credentials.value.password = ''
    toast.error('User credentials are invalid!')
  }
}

function validateUsername() {
  if (!credentials.value.username) {
    errors.value['username'] = ['Username is required!']
    return false
  }
  if (!/^(9\d{8})$/.test(credentials.value.username) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.value.username)) {
    errors.value['username'] = ['Username must be a valid email or a phone number that starts with 9 and has 9 digits!']
    return false
  }
  errors.value['username'] = ['']
  return true
}

function validatePassword() {
  if (!credentials.value.password) {
    errors.value['password'] = ['Password is required!']
    return false
  }
  errors.value['password'] = ['']
  return true
}

</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="login">
    <h3 class="mt-5 mb-3">Login</h3>
    <hr>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputUsername" class="form-label">Username</label>
        <input type="text" class="form-control" id="inputUsername" required @blur="validateUsername" v-model.lazy="credentials.username">
        <field-error-message :errors="errors" fieldName="username"></field-error-message>
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputPassword" class="form-label">Password</label>
        <input type="password" class="form-control" id="inputPassword" @blur="validatePassword" v-model.lazy="credentials.password">
        <field-error-message :errors="errors" fieldName="password"></field-error-message>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-primary px-5" @click="login">Login</button>
    </div>
  </form>
</template>

