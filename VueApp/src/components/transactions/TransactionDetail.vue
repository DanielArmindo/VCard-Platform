<script setup>
import { ref, watch, computed } from 'vue';
import { useUserStore } from '../../stores/user.js'

const userStore = useUserStore()

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    required: false,
  },
  operationType: {
    type: String,
    default: 'insert'
  },
  errors: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["save", "cancel"]);

const editingTransaction = ref(props.transaction)

watch(
  () => props.transaction,
  (newTransaction) => {
    editingTransaction.value = newTransaction
  }
)

const transactionTitle = computed(() => {
  if (!editingTransaction.value) {
    return ''
  }
  return props.operationType == 'insert' ? 'New Transaction' : 'Transaction #' + editingTransaction.value.id
})

const save = () => {
  emit("save", editingTransaction.value);
}

const cancel = () => {
  emit("cancel", editingTransaction.value);
}


/*

CRÉDITO
         payment_reference                 vcard                payment_type
Paypal   abcd@gmail.com  ----  5€   ----> 900000001             PAYPAL

DÉBITO
                                     payment_reference          payment_type       
Vcard    900000001  ----  5€   ----> abcd@gmail.com             PAYPAL

*/
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">{{ transactionTitle }}</h3>
    <hr />
    <div class="mb-3 d-flex flex-column" v-if="props.operationType == 'update'">
      <span class="form-label">Date and Time:</span>
      <span class="bg-color form-control">{{ editingTransaction.datetime }}</span>
    </div>
    <div class="mb-3">
      <label for="inputPaymentReference" class="form-label">{{ (userStore.userType !== 'A' && editingTransaction.type != 'C') ? 'To:' : 'From:' }}
      </label>
      <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['payment_reference'] : false }" id="inputPaymentReference" placeholder="Payment Reference" :disabled="props.operationType == 'update'" v-model="editingTransaction.payment_reference" required>
      <field-error-message :errors="errors" fieldName="payment_reference"></field-error-message>
    </div>
    <div class="mb-3" v-if="userStore.userType == 'A'">
      <label for="inputVcard" class="form-label">To vCard:</label>
      <input type="number" class="form-control" :class="{ 'is-invalid': errors ? errors['vcard'] : false }" id="inputVcard" placeholder="VCard" v-model="editingTransaction.vcard" required>
      <field-error-message :errors="errors" fieldName="vcard"></field-error-message>
    </div>
    <div class="mb-3">
      <label for="selectPaymentType" class="form-label">Payment Type:</label>
      <select class="form-select" :class="{ 'is-invalid': errors ? errors['payment_type'] : false }" required id="selectPaymentType" :disabled="props.operationType == 'update'" v-model="editingTransaction.payment_type">
        <option value="VCARD" v-if="userStore.userType != 'A'">VCard</option>
        <option value="MBWAY">MBWAY</option>
        <option value="PAYPAL">PayPal</option>
        <option value="IBAN">IBAN</option>
        <option value="MB">MB</option>
        <option value="VISA">Visa</option>
      </select>
      <field-error-message :errors="errors" fieldName="payment_type"></field-error-message>
    </div>
    <div class="mb-3">
      <label for="inputValue" class="form-label">Value (€):</label>
      <input type="number" class="form-control" :class="{ 'is-invalid': errors ? errors['value'] : false }" id="inputValue" placeholder="Value" :disabled="props.operationType == 'update'" v-model="editingTransaction.value" required>
      <field-error-message :errors="errors" fieldName="value"></field-error-message>
    </div>
    <div class="mb-3" v-if="userStore.userType != 'A'">
      <label for="inputCategory" class="form-label">Category:</label>
      <select class="form-select" :class="{ 'is-invalid': errors ? errors['category_id'] : false }" id="inputCategory" v-model="editingTransaction.category_id">
        <option :value="null">Sem categoria</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>
      <field-error-message :errors="errors" fieldName="category_id"></field-error-message>
    </div>
    <div class="mb-3" v-if="userStore.userType != 'A'">
      <label for="inputDescription" class="form-label">Description:</label>
      <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['description'] : false }" id="inputDescription" placeholder="Description" v-model="editingTransaction.description">
      <field-error-message :errors="errors" fieldName="description"></field-error-message>
    </div>
    <div class="mb-3 d-flex justify-content-end">
      <button type="button" class="btn btn-primary px-5 mx-2" @click="save">Confirm</button>
      <button type="button" class="btn btn-secondary px-5 mx-2" @click="cancel">Cancel</button>
    </div>
  </form>
</template>

<style scoped>
.bg-color {
  background-color: #e9ecef;
}
</style>