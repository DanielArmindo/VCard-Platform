<script setup>
import { ref, watch, computed, inject } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'
import { useUserStore } from '../../stores/user.js'

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()

const props = defineProps({
  vcard: {
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
})

const emit = defineEmits(["save", "cancel", "delete"])

const editingVcard = ref(props.vcard)

const inputPhotoFile = ref(null)
const editingImageAsBase64 = ref(null)
const deletePhotoOnTheServer = ref(false)

watch(
  () => props.vcard,
  (newVcard) => {
    editingVcard.value = newVcard
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
    return editingVcard.value.photo_url
      ? serverBaseUrl + "/storage/fotos/" + editingVcard.value.photo_url
      : avatarNoneUrl;
  }
})

const vcardTitle = computed(() => {
  if (!editingVcard.value) {
    return ''
  }
  return props.inserting ? 'Register a new vcard' : 'Vcard #' + editingVcard.value.phone_number
})

const save = () => {
  const vcardToSave = editingVcard.value
  vcardToSave.deletePhotoOnTheServer = deletePhotoOnTheServer.value
  vcardToSave.base64ImagePhoto = editingImageAsBase64.value
  emit("save", vcardToSave)
}

const cancel = () => {
  emit("cancel", editingVcard.value)
}

const deleteClick = () => {
  emit("delete", editingVcard.value)
}

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
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">

    <h3 class="mt-5 mb-3">{{ vcardTitle }}</h3>
    <hr />

    <div class="d-flex flex-wrap justify-content-between">
      <div class="w-75 pe-4">

        <div class="mb-3">
          <label for="inputPhoneNumber" class="form-label">Phone Number</label>
          <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['phone_number'] : false }" id="inputPhoneNumber" placeholder="Phone Number" required :disabled="!inserting" v-model="editingVcard.phone_number" />
          <field-error-message :errors="errors" fieldName="phone_number"></field-error-message>
        </div>

        <div class="mb-3">
          <label for="inputName" class="form-label">Name</label>
          <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['name'] : false }" id="inputName" placeholder="Vcard name" required :disabled="userStore.userId != vcard.phone_number && !inserting" v-model="editingVcard.name" />
          <field-error-message :errors="errors" fieldName="name"></field-error-message>
        </div>

        <div class="mb-3">
          <label for="inputEmail" class="form-label">Email</label>
          <input type="email" class="form-control" :class="{ 'is-invalid': errors ? errors['email'] : false }" id="inputEmail" placeholder="Email" required :disabled="userStore.userId != vcard.phone_number && !inserting" v-model="editingVcard.email" />
          <field-error-message :errors="errors" fieldName="email"></field-error-message>
        </div>

        <div class="mb-3" v-if="userStore.userType == 'A'">
          <label for="inputBalance" class="form-label">Balance</label>
          <input type="number" class="form-control" :class="{ 'is-invalid': errors ? errors['balance'] : false }" id="inputBalance" placeholder="Balance" required disabled v-model="editingVcard.balance" />
          <field-error-message :errors="errors" fieldName="balance"></field-error-message>
        </div>

        <div class="mb-3" v-if="userStore.userType == 'A'">
          <label for="inputMaxDebit" class="form-label">Max Debit</label>
          <input type="number" class="form-control" :class="{ 'is-invalid': errors ? errors['max_debit'] : false }" id="inputMaxDebit" placeholder="Max Debit" required v-model="editingVcard.max_debit" />
          <field-error-message :errors="errors" fieldName="max_debit"></field-error-message>
        </div>

        <div class="d-flex ms-1 mt-4 flex-wrap justify-content-between">
          <div class="mb-3 me-3 flex-grow-1" v-if="!inserting && userStore.userType == 'A'">
            <div class="form-check">
              <input class="form-check-input" :class="{ 'is-invalid': errors ? errors['blocked'] : false }" type="checkbox" true-value="1" false-value="0" id="inputBlocked" v-model="editingVcard.blocked" />
              <label class="form-check-label" :class="{ 'text-danger': editingVcard.blocked, 'text-dark': editingVcard.blocked == 0 }" for="inputBlocked">
                Vcard is blocked
              </label>
            </div>
            <field-error-message :errors="errors" fieldName="blocked"></field-error-message>
          </div>
        </div>

        <div class="mb-3" v-if="inserting">
          <label for="inputPassword" class="form-label">Password</label>
          <input type="password" class="form-control" :class="{ 'is-invalid': errors ? errors['password'] : false }" id="inputPassword" v-model="editingVcard.password" placeholder="Password" />
          <field-error-message :errors="errors" fieldName="password"></field-error-message>
        </div>

        <div class="mb-3" v-if="inserting">
          <label for="inputConfirmationCode" class="form-label">Confirmation Code</label>
          <input type="password" class="form-control" :class="{ 'is-invalid': errors ? errors['confirmation_code'] : false }" id="inputConfirmationCode" v-model="editingVcard.confirmation_code" placeholder="Confirmation Code" />
          <field-error-message :errors="errors" fieldName="confirmation_code"></field-error-message>
        </div>

      </div>

      <div class="w-25">
        <div class="d-flex flex-column">
          <label class="form-label">Photo</label>
          <div class="form-control text-center">
            <img :src="photoFullUrl" class="w-100" />
          </div>
          <div class="mt-3 d-flex justify-content-between flex-wrap" v-if="userStore.userId == vcard.phone_number || inserting">
            <label for="inputPhoto" class="btn btn-dark flex-grow-1 mx-1">Carregar</label>
            <button class="btn btn-secondary flex-grow-1 mx-1" @click.prevent="resetToOriginalPhoto" v-if="editingVcard.photo_url">Repor</button>
            <button class="btn btn-danger flex-grow-1 mx-1" @click.prevent="cleanPhoto" v-show="editingVcard.photo_url || editingImageAsBase64">Apagar</button>
          </div>
          <div>
            <field-error-message :errors="errors" fieldName="base64ImagePhoto"></field-error-message>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="mt-2 d-flex justify-content-between">
      <div>
        <button type="button" class="btn btn-primary px-5 mx-2" @click="save">{{ !inserting ? 'Save' : 'Register' }}</button>
        <button type="button" class="btn btn-secondary px-5 mx-2" @click="cancel" v-if="!inserting">Cancel</button>
      </div>
      <button type="button" class="btn btn-danger px-5 mx-2" @click="deleteClick" v-if="!inserting">{{ userStore.userType == 'A' ? 'Delete' : 'Delete my vCard account' }}</button>
    </div>

  </form>
  <input type="file" style="visibility:hidden;" id="inputPhoto" ref="inputPhotoFile" @change="changePhotoFile" />
</template>

<style scoped></style>