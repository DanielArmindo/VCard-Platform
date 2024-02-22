<script setup>
import { useRouter } from 'vue-router'
import { ref, watch, onMounted, inject } from "vue";
import { useUserStore } from '../../stores/user.js'
import { useTransactionsStore } from '../../stores/transactions.js'
import TransactionTable from './TransactionTable.vue'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'

const socket = inject("socket")
const router = useRouter()
const userStore = useUserStore()
const transactionStore = useTransactionsStore()
const toast = useToast()
const filterByPaymentReference = ref('')
const filterByStartDate = ref('')
const filterByEndDate = ref('')
const filterByType = ref('')
const sortBy = ref('DDESC')

const loadTransactions = async (page = 1) => {
  try {
    await transactionStore.loadTransactions(page, filterByPaymentReference.value, filterByStartDate.value, filterByEndDate.value, filterByType.value, sortBy.value)
  } catch (error) {
    console.log(error)
  }
}

const newTransaction = () => {
  router.push({ name: "NewTransaction" })
}

const requestTransaction = () => {
  Swal.fire({
    title: 'Request Transaction',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Enter phone number" type="number">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Enter transaction value" type="number">',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Request',
    confirmButtonColor: '#198754',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const phoneNumber = Swal.getPopup().querySelector('#swal-input1').value;
      const transactionValue = Swal.getPopup().querySelector('#swal-input2').value;

      if (!validatePhoneNumber(phoneNumber) || !validateTransactionValue(transactionValue)) {
        return false
      }
      socket.emit('moneyRequest', userStore.userId, phoneNumber, parseFloat(transactionValue));
      toast.success('Money request sent successfully!');
    }
  });
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    Swal.showValidationMessage(`Phone number is required`);
    return false
  }
  if (!/^(9\d{8})$/.test(phoneNumber)) {
    Swal.showValidationMessage(`Phone number must start with 9 and have 9 digits`);
    return false
  }
  return true
}

const validateTransactionValue = (transactionValue) => {
  if (!transactionValue) {
    Swal.showValidationMessage(`Transaction value is required`);
    return false
  }
  if (transactionValue <= 0) {
    Swal.showValidationMessage(`Transaction value must be greater than 0`);
    return false
  }
  if (transactionValue != +transactionValue) {
    Swal.showValidationMessage(`Transaction value must be a number`);
    return false
  }
  return true
}

const edit = (transaction) => {
  router.push({ name: "Transaction", params: { id: transaction.id } })
}

watch(
  [filterByPaymentReference, filterByStartDate, filterByEndDate, filterByType, sortBy],
  () => {
    console.log('watch')
    loadTransactions();
  }
);

const handlePageChange = (page) => {
  loadTransactions(page)
}

onMounted(() => {
  loadTransactions()
})
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">My Transactions</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ transactionStore.totalTransactions }}</h5>
    </div>
  </div>
  <hr>
  <div class="mb-3 d-flex justify-content-between flex-wrap">
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="inputPaymentReference" class="form-label">Filter by Payment Reference:</label>
      <input v-model.lazy="filterByPaymentReference" type="text" class="form-control" placeholder="Search by Payment Reference" />
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="inputStartDate" class="form-label">Filter by Start Date:</label>
      <input v-model="filterByStartDate" type="date" class="form-control" />
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="inputEndDate" class="form-label">Filter by End Date:</label>
      <input v-model="filterByEndDate" type="date" class="form-control" />
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="selectType" class="form-label">Filter by Type:</label>
      <select class="form-select" id="selectType" v-model="filterByType">
        <option value="">Any</option>
        <option value="D">Debit</option>
        <option value="C">Credit</option>
      </select>
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="selectsortBy" class="form-label">Sort by:</label>
      <select class="form-select" id="selectsortBy" v-model="sortBy">
        <option value="DDESC">Most Recent Date</option>
        <option value="DASC">Oldest Date</option>
        <option value="VDESC">Higher transaction value</option>
        <option value="VASC">Lower transactional value</option>
      </select>
    </div>
    <div class="mx-2 mt-2">
      <button type="button" class="btn btn-success px-4 btn-newTransaction" @click="newTransaction"><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Send Money</button>
      <button type="button" class="btn btn-primary px-4 btn-askForMoney" @click="requestTransaction"><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Ask for Money</button>
    </div>
  </div>
  <transaction-table :transactions="transactionStore.transactions.data" @edit="edit"></transaction-table>
  <Pagination :data="transactionStore.transactions" @pagination-change-page="handlePageChange" />
</template>


<style scoped>
.filter-div {
  min-width: 12rem;
}

.total-filtro {
  margin-top: 0.35rem;
}

.btn-newTransaction,
.btn-askForMoney {
  margin-top: 1.85rem;
  margin-left: 1rem;
}
</style>