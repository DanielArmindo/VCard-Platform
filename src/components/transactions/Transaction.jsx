import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import "../../assets/transaction.css";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import TransactionDialog from "../global/TransactionDialog";

const Transaction = () => {
  const user = useSelector((state) => state.user);
  const [title, setTitle] = useState("New Transaction");
  const errors = useActionData();
  const dataLoader = useLoaderData();
  const [transaction, setTransaction] = useState({});
  const [categories, setCategories] = useState([]);
  const [confirmCode, setConfirmCode] = useState("");
  const navigate = useNavigate();
  const navigation = useNavigation();
  const block = useRef(1);

  const operation = dataLoader.operation;

  useEffect(() => {
    if (errors === undefined) {
      dataLoader?.transaction
        ?.then((data) => {
          console.log(data);
          setTransaction(data);
          setTitle(`Transaction #${data.id}`);
        })
        .catch((error) => {
          user.user_type === "A" ? navigate("/") : navigate("/transactions");
          if (block.current === 1) {
            toast.error("Unable to process transaction");
            block.current = block.current + 1;
          }
        });

      dataLoader?.categories
        ?.then((data) => setCategories(data))
        .catch((error) => console.log("Aborted"));
    }
  }, [dataLoader]);

  function handleForm(e) {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function performDecision() {
    document.getElementById("submitForm").click();
    document.getElementById("close_modal").click();
  }

  function buttonForm() {
    return user?.user_type === "A" ||
      (user?.user_type === "V" && operation === "update") ? (
      <button
        className="btn btn-primary px-5 mx-2"
        disabled={navigation.state === "submitting"}
      >
        {navigation.state === "submitting" ? "Submiting..." : "Confirm"}
      </button>
    ) : (
      <>
        <button type="submit" id="submitForm" className="d-none"></button>
        <button
          type="button"
          className="btn btn-primary px-5 mx-2"
          data-bs-toggle="modal"
          data-bs-target="#confirmDialog"
          id="show_modal"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Submiting..." : "Confirm"}
        </button>
      </>
    );
  }

  const categoriesElements = categories.map((item) => {
    return (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    );
  });

  return (
    <>
      {user.user_type === "V" && operation !== "update" && (
        <TransactionDialog
          data={confirmCode}
          handleData={setConfirmCode}
          action={performDecision}
          navigation={navigation}
        />
      )}
      <Form method="post" className="row g-3 needs-validation">
        {user.user_type === "V" && (
          <input
            type="text"
            className="d-none"
            disabled={operation === "update"}
            name="confirmation_code"
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
          />
        )}
        <h3 className="mt-5 mb-3">{title}</h3>
        <hr />
        {operation === "update" && (
          <div className="mb-3 d-flex flex-column">
            <span className="form-label">Date and Time:</span>
            <span className="bg-color form-control">
              {transaction?.datetime}
            </span>
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="inputPaymentReference" className="form-label">
            {user.user_type !== "A" && transaction?.type !== "C"
              ? "To:"
              : "From:"}
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPaymentReference"
            placeholder="Payment Reference"
            disabled={operation === "update"}
            name="payment_reference"
            value={transaction?.payment_reference ?? ""}
            onChange={handleForm}
            required
          />
        </div>
        {user.user_type === "A" && (
          <div className="mb-3">
            <label htmlFor="inputVcard" className="form-label">
              To vCard:
            </label>
            <input
              type="number"
              className={
                !errors?.vcard ? "form-control" : "is-invalid form-control"
              }
              id="inputVcard"
              placeholder="VCard"
              name="vcard"
              onChange={handleForm}
              value={transaction?.vcard ?? 0}
              required
            />
            {errors?.vcard && <p className="text-red">{errors.vcard}</p>}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="selectPaymentType" className="form-label">
            Payment Type:
          </label>
          <select
            className={
              !errors?.max_debit ? "form-select" : "is-invalid form-select"
            }
            required
            id="selectPaymentType"
            disabled={operation === "update"}
            value={transaction?.payment_type ?? "MBWAY"}
            onChange={handleForm}
            name="payment_type"
          >
            {user.user_type !== "A" && <option value="VCARD">VCard</option>}
            <option value="MBWAY">MBWAY</option>
            <option value="PAYPAL">PayPal</option>
            <option value="IBAN">IBAN</option>
            <option value="MB">MB</option>
            <option value="VISA">Visa</option>
          </select>
          {errors?.payment_type && (
            <p className="text-red">{errors.payment_type}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="inputValue" className="form-label">
            Value (€):
          </label>
          <input
            type="number"
            className={
              !errors?.value ? "form-control" : "is-invalid form-control"
            }
            id="inputValue"
            placeholder="Value"
            disabled={operation === "update"}
            required
            step="0.01"
            value={transaction?.value ?? 0}
            onChange={handleForm}
            name="value"
          />
          {errors?.value && <p className="text-red">{errors.value}</p>}
        </div>
        {user.user_type !== "A" && (
          <>
            <div className="mb-3">
              <label htmlFor="inputCategory" className="form-label">
                Category:
              </label>
              <select
                className="form-select"
                id="inputCategory"
                value={transaction?.category_id || ""}
                onChange={handleForm}
                name="category_id"
              >
                <option value="">Sem categoria</option>
                {categoriesElements}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="inputDescription" className="form-label">
                Description:
              </label>
              <input
                type="text"
                className="form-control"
                id="inputDescription"
                placeholder="Description"
                name="description"
                value={transaction?.description || ""}
                onChange={handleForm}
              />
            </div>
          </>
        )}
        <div className="mb-3 d-flex justify-content-end">
          {buttonForm()}
          <button
            type="button"
            className="btn btn-secondary px-5 mx-2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </Form>
    </>
  );
};

export default Transaction;
