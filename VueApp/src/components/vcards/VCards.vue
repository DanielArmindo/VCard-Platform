<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, inject, watch } from 'vue'
import VcardTable from './VCardTable.vue'

const axios = inject('axios')
const router = useRouter()
const vcards = ref([])
const errors = ref(null)
const filterByPhoneNumber = ref('')
const filterByName = ref('')
const filterByEmail = ref('')
const filterByBlocked = ref('')
const sortByBalanceOrMaxDebit = ref('')
let totalVCards = ref(0)

const loadVcards = async (page = 1) => {
  try {
    const params = {
      phone_number: filterByPhoneNumber.value,
      name: filterByName.value,
      email: filterByEmail.value,
      blocked: filterByBlocked.value,
      sort: sortByBalanceOrMaxDebit.value
    };
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();

    const response = await axios.get(`/vcards?page=${page}&${queryString}`)
    vcards.value = response.data
    totalVCards.value = response.data.meta.total
  } catch (error) {
    errors.value = error.response.data.errors
    console.log(error)
  }
}

const editVcard = (vcard) => {
  router.push({ name: 'VCard', params: { phoneNumber: vcard.phone_number } })
}

const deletedVcard = (deletedVcard) => {
  let idx = vcards.value.data.findIndex((vcard) => vcard.phone_number === deletedVcard.phone_number)
  if (idx >= 0) {
    vcards.value.data.splice(idx, 1)
    totalVCards.value--
  }
}

watch(
  [filterByPhoneNumber, filterByName, filterByEmail, filterByBlocked, sortByBalanceOrMaxDebit],
  () => {
    loadVcards();
  }
);

const handlePageChange = (page) => {
  loadVcards(page)
}

onMounted(() => {
  loadVcards()
})
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">Vcards</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalVCards }}</h5>
    </div>
  </div>
  <hr>
  <div class="mb-3 d-flex justify-content-between flex-wrap">
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="inputPhoneNumber" class="form-label">Filter by phone number:</label>
      <input v-model.lazy="filterByPhoneNumber" type="tel" class="form-control" placeholder="Search by phone number" />
      <!-- <field-error-message :errors="errors" fieldName="phone_number"></field-error-message> -->
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="inputName" class="form-label">Filter by name:</label>
      <input v-model.lazy="filterByName" type="text" class="form-control" placeholder="Search by name" />
      <!-- <field-error-message :errors="errors" fieldName="name"></field-error-message> -->
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="inputEmail" class="form-label">Filter by email:</label>
      <input v-model.lazy="filterByEmail" type="text" class="form-control" placeholder="Search by email" />
      <!-- <field-error-message :errors="errors" fieldName="email"></field-error-message> -->
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="selectBlocked" class="form-label">Filter by blocked:</label>
      <select class="form-select" id="selectBlocked" v-model="filterByBlocked">
        <option value="">Any</option>
        <option value="0">Not Blocked</option>
        <option value="1">Blocked</option>
      </select>
      <!-- <field-error-message :errors="errors" fieldName="blocked"></field-error-message> -->
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="selectsortByBalanceOrMaxDebit" class="form-label">Sort by:</label>
      <select class="form-select" id="selectsortByBalanceOrMaxDebit" v-model="sortByBalanceOrMaxDebit">
        <option value="">-- No filter --</option>
        <option value="BDESC">Descending Balance</option>
        <option value="BASC">Ascending Balance</option>
        <option value="MDESC">Descending Max Debit</option>
        <option value="MASC">Ascending Max Debit</option>
        <!-- <field-error-message :errors="errors" fieldName="sort"></field-error-message> -->
      </select>
    </div>
  </div>
  <vcard-table :vcards="vcards.data" @edit="editVcard" @deleted="deletedVcard"></vcard-table>
  <Pagination :data="vcards" @pagination-change-page="handlePageChange" />
</template>

<style scoped>
.total-filtro {
  margin-top: 0.35rem;
}
</style>