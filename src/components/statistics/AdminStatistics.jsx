import {
  BsListColumnsReverse,
  BsCurrencyEuro,
  BsFillPersonCheckFill,
  BsBank,
  BsCalculator,
  BsPersonCheck,
} from "react-icons/bs";
import { useState, useEffect } from "react";
import Chart from "chart.js/auto";

const AdminStatistics = (props) => {
  const [statistics, setStatistics] = useState([]);
  const [vcardYear, setVcardYear] = useState("2024");
  const [transactionsYear, setTransactionsYear] = useState("2024");
  const format = new Intl.NumberFormat("pt-EU", {
    style: "currency",
    currency: "EUR",
  });
  const [thisMonthTransactions, setThisMonthTransactions] = useState(0);
  const [thisMonthNewVcards, setThisMonthNewVcards] = useState(0);

  useEffect(() => {
    props.data.statistics.then((data) => {
      setStatistics(data);
      setThisMonthTransactions(thisMonthTransactionsFunc(data));
      setThisMonthNewVcards(thisMonthNewVcardsFunc(data));
      loadCharts(data);
    });
  }, [props.data.statistics]);

  useEffect(() => {
    const dataFiltered = filteredTransactions(statistics)
    createTransactions(dataFiltered);
  }, [transactionsYear, statistics]);

  useEffect(() => {
    const dataFiltered = filteredNewVcards(statistics)
    createNewVCard(dataFiltered);
  }, [vcardYear, statistics]);

  function loadCharts(data) {
    createPaymentTypes(data);
    createBlockedActive(data);
    createBalanceCategories(data);
  }

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

  const thisMonthNewVcardsFunc = (data) => {
    var monthIndex = new Date().getMonth();
    var monthName = new Date(0, monthIndex).toLocaleString("en", {
      month: "long",
    });
    return (
      filteredNewVcards(data).find((vcard) => vcard.month_name === monthName)
        ?.count || 0
    );
  };

  function filteredTransactions(data) {
    return data?.transactions_per_month_and_year &&
      data?.transactions_per_month_and_year.length > 0
      ? data?.transactions_per_month_and_year.filter(
          (transaction) => transaction.year === parseInt(transactionsYear),
        )
      : [];
  }

  const filteredNewVcards = (data) => {
    return data?.registered_vcards_per_month_and_year &&
      data?.registered_vcards_per_month_and_year.length > 0
      ? data?.registered_vcards_per_month_and_year.filter(
          (vcard) => vcard.year === parseInt(vcardYear),
        )
      : [];
  };

  const createPaymentTypes = (data) => {
    const canvasId = "PaymentTypes";
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }
    new Chart(document.getElementById(canvasId), {
      type: "pie",
      data: {
        labels: data?.payment_types.map((item) => item.name),
        datasets: [
          {
            label: "Payment Types",
            data: data?.payment_types.map((item) => item.total),
            borderWidth: 1,
            fill: false,
          },
        ],
      },
    });
  };

  const createBlockedActive = (data) => {
    const canvasId = "BlockedActive";
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }
    new Chart(document.getElementById(canvasId), {
      type: "pie",
      data: {
        labels: ["Blocked", "Active"],
        datasets: [
          {
            label: "Number of Vcards",
            data: [data?.blocked, data?.ativos],
            borderWidth: 1,
          },
        ],
      },
    });
  };

  const createBalanceCategories = (data) => {
    const canvasId = "BalanceCategories";
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }
    new Chart(document.getElementById(canvasId), {
      type: "pie",
      data: {
        labels: data
          ? Object.entries(data.vcards_balance_categories).map(
              ([label]) => label + "€",
            )
          : null,
        datasets: [
          {
            label: "Balance Categories",
            data: data
              ? Object.values(data.vcards_balance_categories).map(
                  (value) => value,
                )
              : null,
            borderWidth: 1,
            fill: false,
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
        labels: data?.map(
          (transaction) => transaction.month_name,
        ),
        datasets: [
          {
            label: "Transactions",
            data: data?.map(
              (transaction) => transaction.count,
            ),
            borderWidth: 1,
          },
        ],
      },
    });
  };

  const createNewVCard = (data) => {
    const canvasId = "NewVCard";
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }
    new Chart(document.getElementById(canvasId), {
      type: "bar",
      data: {
        labels: data?.map((item) => item.month_name),
        datasets: [
          {
            label: "New VCards",
            data: data?.map((item) => item.count),
            borderWidth: 1,
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
                    Monthly Transactions
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
                    Monthly Financial Movements
                  </h6>
                  <h4 className="font-weight-normal mb-4">
                    {format.format(statistics?.monthly_financial_movements)}
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
                    Monthly New Vcards
                  </h6>
                  <h4 className="font-weight-normal mb-4">
                    {thisMonthNewVcards}
                  </h4>
                </div>
                <BsFillPersonCheckFill size={35} />
              </div>
            </div>
          </div>
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card text-white bg-gradient-blue border-0">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <h6 className="font-weight-normal mb-3">
                    Total Balance Of Vcards
                  </h6>
                  <h4 className="font-weight-normal mb-4">
                    {format.format(statistics?.sum_balance)}
                  </h4>
                </div>
                <BsBank size={35} />
              </div>
            </div>
          </div>
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card text-white bg-gradient-blue border-0">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <h6 className="font-weight-normal mb-3">
                    Average Balance Of Vcards
                  </h6>
                  <h4 className="font-weight-normal mb-4">
                    {format.format(statistics?.avg_balance)}
                  </h4>
                </div>
                <BsCalculator size={35} />
              </div>
            </div>
          </div>
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card text-white bg-gradient-blue border-0">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <h6 className="font-weight-normal mb-3">
                    Number of Active Vcards
                  </h6>
                  <h4 className="font-weight-normal mb-4">
                    {statistics?.ativos}
                  </h4>
                </div>
                <BsPersonCheck size={35} />
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
              <h4 className="card-title mb-4">Quantity Of Payments Per Type</h4>
              <div className="mt-auto">
                <div>
                  <canvas id="PaymentTypes"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card bg-light border-0">
            <div className="card-body">
              <h4 className="card-title mb-4">Blocked and Active Vcards</h4>
              <div className="mt-auto">
                <div>
                  <canvas id="BlockedActive"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card bg-light border-0">
            <div className="card-body">
              <h4 className="card-title mb-4">Vcards Balance Categories</h4>
              <div className="mt-auto">
                <div>
                  <canvas id="BalanceCategories"></canvas>
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
                <h4 className="card-title w-75">New Transactions</h4>
                <select
                  defaultValue={transactionsYear}
                  onChange={(event) => setTransactionsYear(event.target.value)}
                  className="form-select form-select-sm w-25"
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
                <h4 className="card-title w-75">New Vcards</h4>
                <select
                  defaultValue={vcardYear}
                  onChange={(event) => setVcardYear(event.target.value)}
                  className="form-select form-select-sm w-25"
                >
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div className="mt-auto">
                <div>
                  <canvas id="NewVCard"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminStatistics;
