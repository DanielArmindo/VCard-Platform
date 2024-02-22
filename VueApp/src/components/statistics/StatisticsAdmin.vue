<script setup>
import Chart from 'chart.js/auto'
import { onMounted, ref, inject, watch, computed } from 'vue'

const axios = inject('axios')
const props = defineProps(['url'])
const statistics = ref({})
const yearSelectedTransactions = ref(2023)
const yearSelectedNewVcards = ref(2023)
const format = new Intl.NumberFormat('pt-EU', { style: 'currency', currency: 'EUR' });


function loadCharts(data) {
  createPaymentTypes(data)
  createBlockedActive(data)
  createBalanceCategories(data)
  createTransactions()
  createNewVCard()
}

const createPaymentTypes = (data) => {
  new Chart(document.getElementById('PaymentTypes'), {
    type: 'pie',
    data: {
      labels: data.payment_types.map((item) => item.name),
      datasets: [
        {
          label: 'Payment Types',
          data: data.payment_types.map((item) => item.total),
          borderWidth: 1,
          fill: false
        }
      ]
    }
  })
}

const createBlockedActive = (data) => {
  new Chart(document.getElementById('BlockedActive'), {
    type: 'pie',
    data: {
      labels: ['Blocked', 'Active'],
      datasets: [
        {
          label: 'Number of Vcards',
          data: [data.blocked, data.ativos],
          borderWidth: 1
        }
      ]
    }
  })
}

const createBalanceCategories = (data) => {
  new Chart(document.getElementById('BalanceCategories'), {
    type: 'pie',
    data: {
      labels: Object.entries(data.vcards_balance_categories).map(([label]) => label + '€'),
      datasets: [
        {
          label: 'Balance Categories',
          data: Object.values(data.vcards_balance_categories).map((value) => value),
          borderWidth: 1,
          fill: false
        }
      ]
    }
  })
}

const createTransactions = () => {
  const canvasId = 'Transactions';
  const existingChart = Chart.getChart(canvasId);
  if (existingChart) {
    existingChart.destroy();
  }
  new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: filteredTransactions().map((transaction) => transaction.month_name),
      datasets: [
        {
          label: 'Transactions',
          data: filteredTransactions().map((transaction) => transaction.count),
          borderWidth: 1
        }
      ]
    },
  })
}

const createNewVCard = () => {
  const canvasId = 'NewVCard';
  const existingChart = Chart.getChart(canvasId);
  if (existingChart) {
    existingChart.destroy();
  }
  new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: filteredNewVcards().map((item) => item.month_name),
      datasets: [
        {
          label: 'New VCards',
          data: filteredNewVcards().map((item) => item.count),
          borderWidth: 1
        }
      ]
    },
  })
}

const filteredTransactions = () => {
  return statistics.value.transactions_per_month_and_year
    && statistics.value.transactions_per_month_and_year.length > 0
    ? statistics.value.transactions_per_month_and_year.filter(
      transaction => transaction.year === parseInt(yearSelectedTransactions.value))
    : []
}

const thisMonthTransactions = computed(() => {
  var monthIndex = new Date().getMonth();
  var monthName = new Date(0, monthIndex).toLocaleString('en', { month: 'long' });
  console.log(monthName)
  return filteredTransactions().find(transaction => transaction.month_name === monthName)?.count || 0
})

const thisMonthNewVcards = computed(() => {
  var monthIndex = new Date().getMonth();
  var monthName = new Date(0, monthIndex).toLocaleString('en', { month: 'long' });
  console.log(monthName)
  return filteredNewVcards().find(vcard => vcard.month_name === monthName)?.count || 0
})

const filteredNewVcards = () => {
  return statistics.value.registered_vcards_per_month_and_year
    && statistics.value.registered_vcards_per_month_and_year.length > 0
    ? statistics.value.registered_vcards_per_month_and_year.filter(vcard => vcard.year === parseInt(yearSelectedNewVcards.value))
    : []
}

watch(yearSelectedTransactions, () => {
  createTransactions()
})

watch(yearSelectedNewVcards, () => {
  createNewVCard()
})

onMounted(async () => {
  try {
    const response = await axios.get(props.url);
    Object.assign(statistics.value, response.data.data);
    loadCharts(statistics.value);
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">Statistics</h3>
    </div>
  </div>
  <hr>
  <div class="row d-flex">
    <div class="row">
      <div class="col-md-4 stretch-card grid-margin mb-4">
        <div class="card text-white bg-gradient-blue border-0">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6 class="font-weight-normal mb-3">Monthly Transactions</h6>
              <h4 class="font-weight-normal mb-4">{{ thisMonthTransactions }}</h4>
            </div>
            <i class="bi bi-list-columns-reverse icon-size"></i>
          </div>
        </div>
      </div>
      <div class="col-md-4 stretch-card grid-margin mb-4">
        <div class="card text-white bg-gradient-blue border-0">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6 class="font-weight-normal mb-3">Monthly Financial Movements</h6>
              <h4 class="font-weight-normal mb-4">{{ format.format(statistics.monthly_financial_movements) }}</h4>
            </div>
            <i class="bi bi-currency-euro icon-size"></i>
          </div>
        </div>
      </div>
      <div class="col-md-4 stretch-card grid-margin mb-4">
        <div class="card text-white bg-gradient-blue border-0">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6 class="font-weight-normal mb-3">Monthly New Vcards</h6>
              <h4 class="font-weight-normal mb-4">{{ thisMonthNewVcards }}</h4>
            </div>
            <i class="bi bi-person-fill icon-size"></i>
          </div>
        </div>
      </div>
      <div class="col-md-4 stretch-card grid-margin">
        <div class="card text-white bg-gradient-blue border-0">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6 class="font-weight-normal mb-3">Total Balance Of Vcards</h6>
              <h4 class="font-weight-normal mb-4">{{ format.format(statistics.sum_balance) }}</h4>
            </div>
            <i class="bi bi-bank2 icon-size"></i>
          </div>
        </div>
      </div>
      <div class="col-md-4 stretch-card grid-margin">
        <div class="card text-white bg-gradient-blue border-0">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6 class="font-weight-normal mb-3">Average Balance Of Vcards</h6>
              <h4 class="font-weight-normal mb-4">{{ format.format(statistics.avg_balance) }}</h4>
            </div>
            <i class="bi bi-calculator icon-size"></i>
          </div>
        </div>
      </div>
      <div class="col-md-4 stretch-card grid-margin">
        <div class="card text-white bg-gradient-blue border-0">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6 class="font-weight-normal mb-3">Number of Active Vcards</h6>
              <h4 class="font-weight-normal mb-4">{{ statistics.ativos }}</h4>
            </div>
            <i class="bi bi-person-check icon-size"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr>
  <div class="row mt-3">
    <div class="col-md-4 grid-margin stretch-card">
      <div class="card bg-light border-0">
        <div class="card-body">
          <h4 class="card-title mb-4">Quantity Of Payments Per Type</h4>
          <div class="mt-auto">
            <div><canvas id="PaymentTypes"></canvas></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 grid-margin stretch-card">
      <div class="card bg-light border-0">
        <div class="card-body">
          <h4 class="card-title mb-4">Blocked and Active Vcards</h4>
          <div class="mt-auto">
            <div><canvas id="BlockedActive"></canvas></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 grid-margin stretch-card">
      <div class="card bg-light border-0">
        <div class="card-body">
          <h4 class="card-title mb-4">Vcards Balance Categories</h4>
          <div class="mt-auto">
            <div><canvas id="BalanceCategories"></canvas></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr>
  <div class="row">
    <div class="col-md-6 grid-margin stretch-card">
      <div class="card bg-light border-0">
        <div class="card-body">
          <div class="d-flex mb-3 align-items-center">
            <h4 class="card-title w-75">New Transactions</h4>
            <select class="form-select form-select-sm w-25" v-model="yearSelectedTransactions">
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div class="mt-auto">
            <div><canvas id="Transactions"></canvas></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 grid-margin stretch-card">
      <div class="card bg-light border-0">
        <div class="card-body">
          <div class="d-flex mb-3 align-items-center">
            <h4 class="card-title w-75">New Vcards</h4>
            <select class="form-select form-select-sm w-25" v-model="yearSelectedNewVcards">
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div class="mt-auto">
            <div><canvas id="NewVCard"></canvas></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-blue {
  background-image: linear-gradient(to right, rgb(52, 73, 94), rgb(113, 161, 232));
}

.icon-size {
  font-size: 2rem;
}
</style>