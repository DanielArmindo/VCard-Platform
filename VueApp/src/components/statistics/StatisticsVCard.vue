<script setup>
import Chart from 'chart.js/auto'
import { onMounted, ref, inject, computed, watch } from 'vue'

const props = defineProps(['url'])
const statistics = ref({})
const axios = inject('axios')
const yearSelectedTransactions = ref(2023)
const format = new Intl.NumberFormat('pt-EU', { style: 'currency', currency: 'EUR' });

function loadCharts(data) {
  createTransactions()
  createMoneySpentByCategory(data)
  TransactionsSums(data)
  createPaymentTypes(data.payment_types_debit, 'PaymentTypesDebit')
  createPaymentTypes(data.payment_types_credit, 'PaymentTypesCredit')
}

const TransactionsSums = (data) => {
  new Chart(document.getElementById('TransactionsMoves'), {
    type: 'pie',
    data: {
      labels: ['Debit', 'Credit'],
      datasets: [
        {
          label: 'Total',
          data: [data.money_spent_since_all_time, data.money_received_since_all_time],
          borderWidth: 1
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

const createMoneySpentByCategory = (data) => {
  const canvasId = 'CategoryDebito';
  const existingChart = Chart.getChart(canvasId);
  if (existingChart) {
    existingChart.destroy();
  }
  new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: Object.keys(data.money_spent_by_category),
      datasets: [
        {
          label: 'Money Spent By Category',
          data: Object.values(data.money_spent_by_category),
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          stacked: true
        }
      }
    }
  })
}

const createPaymentTypes = (data, id) => {
  new Chart(document.getElementById(id), {
    type: 'pie',
    data: {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: 'Payment Types',
          data: data.map((item) => item.total),
          borderWidth: 1,
          fill: false
        }
      ]
    }
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

watch(yearSelectedTransactions, () => {
  createTransactions()
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
              <h6 class="font-weight-normal mb-3">Transactions Performed This Month</h6>
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
              <h6 class="font-weight-normal mb-3">Money Spent This Month</h6>
              <h4 class="font-weight-normal mb-4">{{ format.format(statistics.money_spent_this_month) }}</h4>
            </div>
            <i class="bi bi-currency-euro icon-size"></i>
          </div>
        </div>
      </div>
      <div class="col-md-4 stretch-card grid-margin mb-4">
        <div class="card text-white bg-gradient-blue border-0">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6 class="font-weight-normal mb-3">Money Received This Month</h6>
              <h4 class="font-weight-normal mb-4">{{ format.format(statistics.money_received_this_month) }}</h4>
            </div>
            <i class="bi bi-currency-euro icon-size"></i>
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
          <h4 class="card-title mb-4">Payment Type Debit Transactions</h4>
          <div class="mt-auto">
            <div><canvas id="PaymentTypesDebit"></canvas></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 grid-margin stretch-card">
      <div class="card bg-light border-0">
        <div class="card-body">
          <h4 class="card-title mb-4">Money Spent And Received</h4>
          <div class="mt-auto">
            <div><canvas id="TransactionsMoves"></canvas></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 grid-margin stretch-card">
      <div class="card bg-light border-0">
        <div class="card-body">
          <h4 class="card-title mb-4">Payment Type Credit Transactions</h4>
          <div class="mt-auto">
            <div><canvas id="PaymentTypesCredit"></canvas></div>
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
            <h4 class="card-title w-75">Transactions Performed</h4>
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
            <h4 class="card-title w-75">Top 10 Categories by Money Spent</h4>
          </div>
          <div class="mt-auto">
            <div><canvas id="CategoryDebito"></canvas></div>
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