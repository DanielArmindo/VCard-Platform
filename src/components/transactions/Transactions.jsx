import "../../assets/transactions.css";
import { FiPlusCircle } from "react-icons/fi";
import { useLoaderData, Await, Link } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { BiPencil } from "react-icons/bi";
import Pagination from "../global/Pagination";
import { useSelector } from "react-redux";
import { getTransactions } from "../../assets/api";
import RequestTransactionDialog from "../global/RequestTransactionDialog";
import { verfPhoneNumber, verfIsNumber } from "../../assets/utils";
import { toast } from "react-toastify";
import { socket } from "../../assets/sockets.jsx";

const Transactions = () => {
  const user = useSelector((state) => state.user);
  const dataPromise = useLoaderData();
  const [transactions, setTransactions] = useState([]);
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState({});
  const [searchParams, setSearchParams] = useState({
    payment_reference: "",
    start_date: "",
    end_date: "",
    type: "",
    sort: "",
  });

  useEffect(() => {
    dataPromise.transactions.then((data) => {
      setTransactions(data.transactions);
      setPages(data.meta);
    });
  }, [dataPromise]);

  // Request Transactions
  const requestTransaction = () => {
    //verifications
    !verfIsNumber(value)
      ? setErrors((prev) => ({ ...prev, value: "Value must be a number" }))
      : setErrors((prev) => {
          const { value, ...rest } = prev;
          return rest;
        });

    !verfPhoneNumber(phoneNumber)
      ? setErrors((prev) => ({
          ...prev,
          phoneNumber: "It must start with 9 and have 9 digits!!",
        }))
      : setErrors((prev) => {
          const { phoneNumber, ...rest } = prev;
          return rest;
        });

    if (Object.keys(errors).length === 0) {
      if (user.id === parseInt(phoneNumber)) {
        toast.error(
          "It is not possible to request a transaction for the same person",
        );
      } else {
        // SocketEmit
        socket.emit("moneyRequest", user.id, phoneNumber, parseInt(value));
        toast.success("Money request sent successfully!");
        setPhoneNumber("");
        setValue("");
        document.getElementById("close_modal").click();
      }
    }
  };

  useEffect(() => {
    // Give time to write, does not sub-load with requests
    const timeoutId = setTimeout(() => {
      //Filters here
      const params = new URLSearchParams(searchParams);
      const queryString = params.toString();
      getTransactions(user.id, currentPage, queryString).then((data) => {
        setTransactions(data.transactions);
        setPages(data.meta);
      });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [currentPage, searchParams]);

  //Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filter Vcards
  function setFilter(e) {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  //Loading Transactions
  const transactionsElements = () => {
    if (transactions.length === 0) {
      return <h2>Empty Transactions</h2>;
    }

    const elements = transactions.map((item) => {
      return (
        <tr key={item.id}>
          <td className="align-middle">
            {item.category_name || "-- No Category --"}
          </td>
          <td className="align-middle">{item.payment_reference}</td>
          <td className="align-middle">{item.payment_type}</td>
          <td className="align-middle">{item.type}</td>
          <td className="align-middle">
            {(item.type == "C" ? "+" : "-") + item.value + "€"}
          </td>
          <td className="align-middle">{item.old_balance + "€"}</td>
          <td className="align-middle">{item.new_balance + "€"}</td>
          <td className="align-middle">{item.date}</td>
          <td>
            <div className="d-flex justify-content-end">
              <Link to={`${item.id}`} className="btn btn-xs btn-light">
                <BiPencil size={24} />
              </Link>
            </div>
          </td>
        </tr>
      );
    });

    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th className="align-middle">Category</th>
              <th className="align-middle">Payment Reference</th>
              <th className="align-middle">Payment Type</th>
              <th className="align-middle">Type</th>
              <th className="align-middle">Value</th>
              <th className="align-middle">Old Balance</th>
              <th className="align-middle">New Balance</th>
              <th className="align-middle">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{elements}</tbody>
        </table>
        <Pagination
          currentPage={pages?.current_page}
          totalPages={pages?.last_page}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <>
      <RequestTransactionDialog
        action={requestTransaction}
        data={{
          phoneNumber: phoneNumber,
          setPhoneNumber: setPhoneNumber,
          value: value,
          setValue: setValue,
        }}
        errors={errors}
      />
      <div className="d-flex justify-content-between align-items-center">
        <div className="mx-2">
          <h3 className="mt-4">My Transactions</h3>
        </div>
        <div className="mx-2 total-filtro">
          <h5 className="mt-4">Total: {pages?.total}</h5>
          <p>Per Page: {transactions.length}</p>
        </div>
      </div>
      <hr />
      <div className="mb-3 d-flex justify-content-between flex-wrap">
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="inputPaymentReference" className="form-label">
            Filter by Payment Reference:
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Payment Reference"
            name="payment_reference"
            value={searchParams.payment_reference}
            onChange={setFilter}
            disabled={currentPage !== 1}
          />
        </div>
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="inputStartDate" className="form-label">
            Filter by Start Date:
          </label>
          <input
            type="date"
            className="form-control"
            name="start_date"
            value={searchParams.start_date}
            onChange={setFilter}
            disabled={currentPage !== 1}
          />
        </div>
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="inputEndDate" className="form-label">
            Filter by End Date:
          </label>
          <input
            type="date"
            className="form-control"
            name="end_date"
            value={searchParams.end_date}
            onChange={setFilter}
            disabled={currentPage !== 1}
          />
        </div>
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="selectType" className="form-label">
            Filter by Type:
          </label>
          <select
            className="form-select"
            id="selectType"
            name="type"
            value={searchParams.type}
            onChange={setFilter}
            disabled={currentPage !== 1}
          >
            <option value="">Any</option>
            <option value="D">Debit</option>
            <option value="C">Credit</option>
          </select>
        </div>
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="selectsortBy" className="form-label">
            Sort by:
          </label>
          <select
            className="form-select"
            id="selectsortBy"
            name="sort"
            value={searchParams.sort}
            onChange={setFilter}
            disabled={currentPage !== 1}
          >
            <option value="">-- Without Filter --</option>
            <option value="DDESC">Most Recent Date</option>
            <option value="DASC">Oldest Date</option>
            <option value="VDESC">Higher transaction value</option>
            <option value="VASC">Lower transactional value</option>
          </select>
        </div>
        <div className="mx-2 mt-2">
          <Link to="new" className="btn btn-success px-4 btn-newTransaction">
            <FiPlusCircle size={20} />
            &nbsp; Send Money
          </Link>
          <button
            className="btn btn-primary px-4 btn-askForMoney"
            onClick={() => document.getElementById("show_modal").click()}
          >
            <FiPlusCircle size={20} />
            &nbsp; Ask for Money
          </button>
        </div>
      </div>
      <Suspense fallback={<h2>Loading Transactions...</h2>}>
        <Await resolve={dataPromise.transactions}>{transactionsElements}</Await>
      </Suspense>
    </>
  );
};

export default Transactions;
