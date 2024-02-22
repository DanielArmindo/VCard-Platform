<script setup>
import { useToast } from 'vue-toastification'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, inject, watch, onMounted, computed } from 'vue'
import { useUserStore } from '../../stores/user.js'
import TransactionDetail from './TransactionDetail.vue'
import { useTransactionsStore } from '../../stores/transactions.js'

const axios = inject('axios')
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()
const transactionStore = useTransactionsStore()
const socket = inject('socket')

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
})

const newTransaction = () => {
  return {
    id: null,
    vcard: userStore.userType != 'A' ? userStore.userId : null,
    type: 'D',
    payment_type: userStore.userType != 'A' ? 'VCARD' : 'MBWAY', //Defaults values
    payment_reference: '',
    value: 0,
    description: '',
    confirmation_code: '',
    category_id: null,
  }
}

const transaction = ref(newTransaction())

const errors = ref(null)

const confirmDialog = ref(null)

let originalValueStr = ''

// Confirmation dialog attributes
var confirmationBtn = ref('')
var msg = ref('')
var showInputConfirmationCode = ref(false)
var confirmed = ref(null)

const loadTransaction = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (!id || id < 0) {
    transaction.value = newTransaction()
    originalValueStr = JSON.stringify(transaction.value)
  } else {
    try {
      const response = await axios.get('transactions' + '/' + id)
      transaction.value = response.data.data
      originalValueStr = JSON.stringify(transaction.value)
    } catch (error) {
      console.log(error)
    }
  }
}

const save = async (confirmationCode) => {
  if (operation.value == 'insert') {
    try {
      transaction.value.confirmation_code = confirmationCode
      transaction.value = await transactionStore.insertTransaction(transaction.value)
      originalValueStr = JSON.stringify(transaction.value)

      let msg = ''
      userStore.userType != 'A' ? msg = `Transaction with value ${transaction.value.value}€ to ${transaction.value.payment_reference} was created!`
        : msg = `Transaction with value ${transaction.value.value}€ from ${transaction.value.payment_type}:${transaction.value.payment_reference} to VCard #${transaction.value.vcard} was created!`

      toast.success(msg)
      router.back()
    } catch (error) {
      if (error.response && error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Transaction was not created due to validation errors!')
      } else {
        errors.value = {}
        toast.error(error.response.data.message || 'Transaction was not created due to unknown server error!')
      }
    }
  } else {
    try {
      const response = await axios.patch('transactions' + '/' + transaction.value.id, transaction.value)
      transaction.value = response.data.data
      originalValueStr = JSON.stringify(transaction.value)
      toast.success(`Transaction #${transaction.value.id} to ${transaction.value.payment_reference} was updated!`)
      router.back()
    } catch (error) {
      if (error.response && error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Transaction was not created due to validation errors!')
      } else {
        toast.error('Transaction was not created due to unknown server error!')
      }
    }
  }
}

const saveClick = () => {
  if (operation.value == 'insert' && userStore.userType != 'A') {
    confirmationBtn.value = 'Confirm transaction'
    msg.value = "Enter your confirmation code to confirm the transaction."
    confirmed.value = saveConfirmed
    showInputConfirmationCode.value = true
    confirmDialog.value.show()
  } else {
    save()
  }
}

const saveConfirmed = (confirmationCode) => {
  confirmDialog.value.hide()
  save(confirmationCode)
}

const cancel = () => {
  originalValueStr = JSON.stringify(transaction.value)
  router.back()
}

const operation = computed(() => (!props.id || props.id < 0) ? 'insert' : 'update')

const categories = ref([])

const loadCategories = async () => {
  try {
    const response = await axios.get(`vcards/${userStore.userId}/categories`)
    categories.value = response.data.data
  } catch (error) {
    //404 --> não tem categorias pessoais
    if (error.response.status != 404) {
      console.log(error)
      toast.error('Personal categories could not be loaded!')
    }
  }
}

onMounted(() => {
  if (userStore.userType === 'V')
    loadCategories()
})

watch(
  () => props.id,
  (newValue) => {
    loadTransaction(newValue)
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
  let newValueStr = JSON.stringify(transaction.value)
  if (originalValueStr != newValueStr) {
    nextCallBack = next

    confirmationBtn.value = 'Discard changes and leave'
    msg.value = "Do you really want to leave? You have unsaved changes!"
    showInputConfirmationCode.value = false
    confirmed.value = leaveConfirmed

    confirmDialog.value.show()
  } else {
    next()
  }
})
</script>

<template>
  <confirmation-dialog ref="confirmDialog" :confirmationBtn="confirmationBtn" :msg="msg" :deleteOperation="false" :showInputPassword="false" :showInputConfirmationCode="showInputConfirmationCode" @confirmed="confirmed">
  </confirmation-dialog>

  <transaction-detail :transaction="transaction" :categories="categories" :operationType="operation" :errors="errors" @save="saveClick" @cancel="cancel"></transaction-detail>
</template>