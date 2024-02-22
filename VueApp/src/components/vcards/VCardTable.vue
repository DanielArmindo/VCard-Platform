<script setup>
import { ref, computed, inject } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'
import { useToast } from "vue-toastification"
import { useUserStore } from '../../stores/user.js'


const axios = inject("axios")
const socket = inject("socket")
const toast = useToast()
const userStore = useUserStore()
const serverBaseUrl = inject("serverBaseUrl");
const vcardToDelete = ref(null)
const deleteConfirmationDialog = ref(null)

const props = defineProps({
  vcards: {
    type: Array,
    default: () => [],
  },
  showPhoneNumber: {
    type: Boolean,
    default: true,
  },
  showEmail: {
    type: Boolean,
    default: true,
  },
  showBalance: {
    type: Boolean,
    default: true,
  },
  showMaxDebit: {
    type: Boolean,
    default: true,
  },
  showPhoto: {
    type: Boolean,
    default: true,
  },
  showBlocked: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["edit", "deleted"])

const photoFullUrl = (vcard) => {
  return vcard.photo_url
    ? serverBaseUrl + "/storage/fotos/" + vcard.photo_url
    : avatarNoneUrl;
}

const editClick = (vcard) => {
  emit("edit", vcard)
}

const deleteClick = (vcard) => {
  vcardToDelete.value = vcard
  deleteConfirmationDialog.value.show()
}

const deleteVcardConfirmed = async () => {
  try {
    const response = await axios.delete('vcards/' + vcardToDelete.value.phone_number)
    let deletedVcard = response.data.data
    socket.emit("deletedVCard", userStore.user, deletedVcard)
    toast.info(`Vcard ${deletedVcard.name} was deleted`)
    emit("deleted", deletedVcard)
  } catch (error) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message)
    } else {
      toast.error(`It was not possible to delete Vcard ${vcardToDelete.value.name}`)
    }
  }
}

const vcardToDeleteDescription = computed(() => vcardToDelete.value
  ? `#${vcardToDelete.value.phone_number} (${vcardToDelete.value.name})`
  : "")

</script>

<template>
  <confirmation-dialog ref="deleteConfirmationDialog" confirmationBtn="Delete Vcard" :msg="`Do you really want to delete the Vcard ${vcardToDeleteDescription} ?`" :deleteOperation=true @confirmed="deleteVcardConfirmed">
  </confirmation-dialog>

  <table class="table">
    <thead>
      <tr>
        <th v-if="showPhoneNumber" class="align-middle">Phone Number</th>
        <th v-if="showPhoto" class="align-middle">Photo</th>
        <th class="align-middle">Name</th>
        <th v-if="showEmail" class="align-middle">Email</th>
        <th v-if="showBalance" class="align-middle">Balance</th>
        <th v-if="showMaxDebit" class="align-middle">Max Debit</th>
        <th v-if="showBlocked" class="align-middle">Blocked</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="vcard in vcards" :key="vcard.phone_number">
        <td v-if="showPhoneNumber" class="align-middle">{{ vcard.phone_number }}</td>
        <td v-if="showPhoto" class="align-middle">
          <img :src="photoFullUrl(vcard)" class="rounded-circle img_photo" />
        </td>
        <td class="align-middle">{{ vcard.name }}</td>
        <td v-if="showEmail" class="align-middle">{{ vcard.email }}</td>
        <td v-if="showBalance" class="align-middle">{{ vcard.balance }} €</td>
        <td v-if="showMaxDebit" class="align-middle">{{ vcard.max_debit }} €</td>
        <td v-if="showBlocked" class="align-middle">
          <i v-if="vcard.blocked" class="bi bi-ban text-danger m-3 mb-0 mt-0 mr-0"></i>
        </td>
        <td class="text-end align-middle" v-if="showEditButton || showDeleteButton">
          <div class="d-flex justify-content-end">
            <button class="btn btn-xs btn-light" @click="editClick(vcard)" v-if="showEditButton">
              <i class="bi bi-xs bi-pencil"></i>
            </button>
            <button class="btn btn-xs btn-light" @click="deleteClick(vcard)" v-if="showDeleteButton">
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