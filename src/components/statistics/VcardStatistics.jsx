import Chart from "chart.js/auto";
import { BsListColumnsReverse, BsCurrencyEuro } from "react-icons/bs";
import { useState, useEffect } from "react";

const VcardStatistics = (props) => {
  const [statistics, setStatistics] = useState([]);
  const [yearSelected, setYearSelected] = useState("2024");
  const format = new Intl.NumberFormat("pt-EU", {
    style: "currency",
    currency: "EUR",
  });
  const [thisMonthTransactions, setThisMonthTransactions] = useState(0);

  useEffect(() => {
    props.data.statistics.then((data) => {
      setStatistics(data);
      setThisMonthTransactions(thisMonthTransactionsFunc(data));
    });
  }, [props.data.statistics]);

  useEffect(() => {
    loadCharts(statistics);
  }, [yearSelected,statistics]);

  const thisMonthTransactionsFunc = (data) => {
    var monthIndex = new Date().getMonth();
    var monthName = new Date(0, monthIndex).toLocaleString("en", {
      month: "long",
    });
    return (
      filteredTransactions(data).find(
        (transaction) => transaction.month_name === monthName,
      )?.count || 0
    );
  };

  const filteredTransactions = (data) => {
    return data?.transactions_per_month_and_year &&
      data?.transactions_per_month_and_year.length > 0
      ? data.transactions_per_month_and_year?.filter(
          (item) => item.year === parseInt(yearSelected),
        )
      : [];
  };

  function loadCharts(data) {
    const filterData = filteredTransactions(data);
    createTransactions(filterData);
    createMoneySpentByCategory(data);
    TransactionsSums(data);
    createPaymentTypes(data.payment_types_debit, "PaymentTypesDebit");
    createPaymentTypes(data.payment_types_credit, "PaymentTypesCredit");
  }

  const TransactionsSums = (data) => {
    const canvasId = "TransactionsMoves";
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }
    new Chart(document.getElementById("TransactionsMoves"), {
      type: "pie",
      data: {
        labels: ["Debit", "Credit"],
        datasets: [
          {
            label: "Total",
            data: [
              data?.money_spent_since_all_time,
              data?.money_received_since_all_time,
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  };
  const createTransactions = (data) => {
    const canvasId = "Transactions";
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }
    new Chart(document.getElementById(canvasId), {
      type: "bar",
      data: {
        labels: data?.map((transaction) => transaction.month_name),
        datasets: [
          {
            label: "Transactions",
            data: data?.map((transaction) => transaction.count),
            borderWidth: 1,
          },
        ],
      },
    });
  };

  const createMoneySpentByCategory = (data) => {
    const canvasId = "CategoryDebito";
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }
    new Chart(document.getElementById(canvasId), {
      type: "bar",
      data: {
        labels: data.money_spent_by_category ? Object.keys(data.money_spent_by_category) : null,
        datasets: [
          {
            label: "Money Spent By Category",
            data: data.money_spent_by_category ? Object.values(data.money_spent_by_category) : null,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            stacked: true,
          },
        },
      },
    });
  };

  const createPaymentTypes = (data, id) => {
    const existingChart = Chart.getChart(id);
    if (existingChart) {
      existingChart.destroy();
    }
    new Chart(document.getElementById(id), {
      type: "pie",
      data: {
        labels: data?.map((item) => item.name),
        datasets: [
          {
            label: "Payment Types",
            data: data?.map((item) => item.total),
            borderWidth: 1,
            fill: false,
          },
        ],
      },
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="mx-2">
          <h3 className="mt-4">Statistics</h3>
        </div>
      </div>
      <hr />

      <div className="row d-flex">
        <div className="row">
          <div className="col-md-4 stretch-card grid-margin mb-4">
            <div className="card text-white bg-gradient-blue border-0">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <h6 className="font-weight-normal mb-3">
                    Transactions Performed This Month
                  </h6>
                  <h4 className="font-weight-normal mb-4">
                    {thisMonthTransactions}
                  </h4>
                </div>
                <BsListColumnsReverse size={35} />
              </div>
            </div>
          </div>
          <div className="col-md-4 stretch-card grid-margin mb-4">
            <div className="card text-white bg-gradient-blue border-0">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <h6 className="font-weight-normal mb-3">
                    Money Spent This Month
                  </h6>
                  <h4 className="font-weight-normal mb-4">
                    {format.format(statistics?.money_spent_this_month)}
                  </h4>
                </div>
                <BsCurrencyEuro size={35} />
              </div>
            </div>
          </div>
          <div className="col-md-4 stretch-card grid-margin mb-4">
            <div className="card text-white bg-gradient-blue border-0">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <h6 className="font-weight-normal mb-3">
                    Money Received This Month
                  </h6>
                  <h4 className="font-weight-normal mb-4">
                    {format.format(statistics?.money_received_this_month)}
                  </h4>
                </div>
                <BsCurrencyEuro size={35} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div className="row mt-3">
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card bg-light border-0">
            <div className="card-body">
              <h4 className="card-title mb-4">
                Payment Type Debit Transactions
              </h4>
              <div className="mt-auto">
                <div>
                  <canvas id="PaymentTypesDebit"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card bg-light border-0">
            <div className="card-body">
              <h4 className="card-title mb-4">Money Spent And Received</h4>
              <div className="mt-auto">
                <div>
                  <canvas id="TransactionsMoves"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card bg-light border-0">
            <div className="card-body">
              <h4 className="card-title mb-4">
                Payment Type Credit Transactions
              </h4>
              <div className="mt-auto">
                <div>
                  <canvas id="PaymentTypesCredit"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card bg-light border-0">
            <div className="card-body">
              <div className="d-flex mb-3 align-items-center">
                <h4 className="card-title w-75">Transactions Performed</h4>
                <select
                  className="form-select form-select-sm w-25"
                  defaultValue={yearSelected}
                  onChange={(event) => setYearSelected(event.target.value)}
                >
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div className="mt-auto">
                <div>
                  <canvas id="Transactions"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card bg-light border-0">
            <div className="card-body">
              <div className="d-flex mb-3 align-items-center">
                <h4 className="card-title w-75">
                  Top 10 Categories by Money Spent
                </h4>
              </div>
              <div className="mt-auto">
                <div>
                  <canvas id="CategoryDebito"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VcardStatistics;
