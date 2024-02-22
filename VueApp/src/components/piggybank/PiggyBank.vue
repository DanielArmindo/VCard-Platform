<script setup>
import { useToast } from 'vue-toastification'
import { useUserStore } from '../../stores/user.js'
import { ref, inject, onMounted} from 'vue'

const axios = inject('axios')

const userStore = useUserStore()
const toast = useToast()

const piggyBank = ref(() => {
  return {
    balance: 0,
    spare_change: null
  }
})

const errors = ref(null)
const amount = ref(0)

const loadPiggyBank = async () => {
    try {
        const response = await axios.get(`vcards/${userStore.userId}/piggybank`,)
        piggyBank.value = response.data.Mealheiro

    } catch (error) {
        toast.error(error.response.data.message)
    }
}

const withdrawClick = async () => {
  updatePiggyBankSavings('debit')
}

const addClick = async () => {
  updatePiggyBankSavings('credit')
}

const updatePiggyBankSavings = async (type) => {
  try {
    const response = await axios.patch(`vcards/${userStore.userId}/piggybank/${type}`, { value: amount.value });
    piggyBank.value.balance = response.data.savings
    toast.info(`Foram ${type === 'credit' ? 'adicionados' : 'retirados'} ${amount.value}€ ao mealheiro!`)
  } catch (error) {
    if (error.response && error.response.status == 422) {
      errors.value = error.response.data.errors
      toast.error('The piggy bank savings were not updated due to validation errors!')
    }else{
      toast.error(error.response.data.message || 'The piggy bank savings were not updated due to unknown errors!')
    }
  }
}

const changeSpareChangeFeatureStatus = async () => {
  try {
    const response = await axios.patch(`vcards/${userStore.userId}/piggybank/sparechange`, { spare_change: !piggyBank.value.spare_change });
    toast.info(response.data.message)
  } catch (error) {
    if (error.response && error.response.status == 422) {
      toast.error('The Spare Change status was not updated due to validation errors!')
    }else{
      toast.error(error.response.data.message || 'The Spare Change status was not updated due to unknown errors!')
    }
  }
}

onMounted(() => {
  loadPiggyBank()
})
</script>
<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">Piggy Bank Vault</h3>
    </div>
  </div>
  <hr>
  <div class="row mx-1 d-flex flex-column">
    <div class="col-md-12 mt-4 d-flex justify-content-around align-items-center div-img-background rounded">
      <div class="col-md-4 text-center flip-horizontal">
        <i class="bi bi-piggy-bank-fill font-size"></i>
      </div>
      <div class="col-md-4 d-flex flex-column text-center">
        <span class="custom-font">{{ piggyBank.balance }}€</span>
        <span class="">Total Acumulado</span>
      </div>
      <div class="col-md-4 d-flex flex-column text-center">
        <span class="custom-font" :class="{'text-success': piggyBank.spare_change}">{{ piggyBank.spare_change ? 'Ativado' : 'Desativado' }}</span>
        <span class="">Spare change</span>
      </div>
    </div>
    <div class="d-flex p-0 justify-content-between">
      <div class="bg rounded mt-4 p-4 d-flex flex-column align-items-center justify-content-start w-25 m-1">
        <div class="w-100 mb-3">
          <h5>Manage your Savings</h5>
        </div>
        <button class="btn btn-light text-dark m-1 w-100 d-flex justify-content-center align-items-center" @click="addClick"><i class="bi bi-arrow-up-circle-fill text-success"></i>Reforçar</button>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-currency-euro"></i>     
          </span>
          <input class="form-control input-font" id="inputAmount" v-model="amount" type="number" min="0">
        </div>
        <button class="btn btn-light text-dark m-1 w-100 d-flex justify-content-center align-items-center" @click="withdrawClick"><i class="bi bi-arrow-down-circle-fill text-danger"></i>Retirar</button>
      </div>
      <div class="bg rounded mt-4 p-4 d-flex flex-column justify-content-start w-75 m-1">
        <div class="w-100 mb-3">
          <h5 class="">Spare Change feature</h5>
        </div>
          <p>Esta funcionalidade permite arredondar o valor das transações e meter o valor excedente para o mealheiro.</p>
          <p>Para ativar esta funcionalidade, clique no botão abaixo.</p>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="switchSpareChange" v-model="piggyBank.spare_change" @click="changeSpareChangeFeatureStatus">
            <label class="form-check-label" for="switchSpareChange">Spare Change Feature</label>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.div-img-background {
  background: radial-gradient(circle, rgb(254,193,7), rgb(255, 221, 100));
  box-shadow: 0px 0px 20px 0px rgb(255, 221, 100);
}
.bg{
  background-color: rgb(242, 242, 242);
}
.custom-font{
  font-family:'Times New Roman', Times, serif;
  font-weight: 300;
  font-size: 2rem;
}
.font-size{
  font-size: 5rem;
}
.input-font{
  font-size: 1.5rem;;
}
.flip-horizontal {
  transform: scaleX(-1);
}
</style>