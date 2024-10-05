import "../../assets/vcards.css";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationDialog from "../global/ConfirmationDialog";
import { useLoaderData, Await, Link } from "react-router-dom";
import avatarNoneUrl from "../../assets/imgs/avatar-none.png";
import { RiUserForbidFill } from "react-icons/ri";
import { BiPencil, BiTrash } from "react-icons/bi";
import { getPhotoURL } from "../../assets/utils";
import { deleteVcard as deleteVcardApi, getVcards } from "../../assets/api";
import Pagination from "../global/Pagination";
import { socket } from "../../assets/sockets";
import { useSelector } from "react-redux";

const Vcards = () => {
  const user = useSelector((state) => state.user);
  const dataPromise = useLoaderData();
  const [vcards, setVcards] = useState([]);
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalInfo, setModalInfo] = useState({
    actionText: "Delete Vcard",
    title: "Confirmation",
    msg: "",
  });
  const [searchParams, setSearchParams] = useState({
    phone_number: "",
    name: "",
    email: "",
    blocked: "",
    sort: "",
  });

  useEffect(() => {
    dataPromise?.vcards.then((data) => {
      setVcards(data.vcards);
      setPages(data.meta);
    });
  }, [dataPromise]);

  const photoFullUrl = (url) => {
    return url ? getPhotoURL(url) : avatarNoneUrl;
  };

  useEffect(() => {
    // Give time to write, does not sub-load with requests
    const timeoutId = setTimeout(() => {
      //Filters here
      const params = new URLSearchParams(searchParams);
      const queryString = params.toString();
      getVcards(currentPage, queryString).then((data) => {
        setVcards(data.vcards);
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

  // To delete vcard
  const modalDeleteShow = (id, text) => {
    setModalInfo((prev) => ({
      ...prev,
      msg: `Do you really want to delete the Vcard #${id} (${text}) ?`,
      id: id,
    }));
    document.getElementById("show_modal").click();
  };

  const deleteVcard = async () => {
    const response = await deleteVcardApi({ id: modalInfo.id });
    if (response === true) {
      document.getElementById("close_modal").click();
      //Socket
      const elementDeleted = vcards.find((item) => item.phone_number === modalInfo.id);
      socket.emit("deletedVCard", user, elementDeleted);
      toast.info("Vcard Erased");
      setVcards((prev) =>
        prev.filter((item) => item.phone_number !== modalInfo.id),
      );
    } else {
      const message =
        typeof response === "string" ? response : "Error to delete vcard";
      toast.error(message);
    }
  };

  // Loading Vcards
  function vcardsElements() {
    if (vcards.length === 0) {
      return <h2>Empty Vcards</h2>;
    }

    const elements = vcards.map((item) => {
      const url_photo = photoFullUrl(item.photo_url);
      return (
        <tr key={item.phone_number}>
          <td className="align-middle">{item.phone_number}</td>
          <td className="align-middle">
            <img src={url_photo} className="rounded-circle img_photo" />
          </td>
          <td className="align-middle">{item.name}</td>
          <td className="align-middle">{item.email}</td>
          <td className="align-middle">{item.balance} €</td>
          <td className="align-middle">{item.max_debit} €</td>
          {item.blocked === 1 ? (
            <td className="align-middle">
              <RiUserForbidFill size={24} className="text-danger" />
            </td>
          ) : (
            <td></td>
          )}
          <td className="text-end align-middle">
            <div className="d-flex justify-content-end">
              <Link
                to={`${item.phone_number}`}
                className="btn btn-xs btn-light"
              >
                <BiPencil size={24} />
              </Link>
              <button
                className="btn btn-xs btn-light"
                onClick={() => modalDeleteShow(item.phone_number, item.name)}
              >
                <BiTrash size={24} />
              </button>
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
              <th className="align-middle">Phone Number</th>
              <th className="align-middle">Photo</th>
              <th className="align-middle">Name</th>
              <th className="align-middle">Email</th>
              <th className="align-middle">Balance</th>
              <th className="align-middle">Max Debit</th>
              <th className="align-middle">Blocked</th>
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
  }

  return (
    <>
      <ConfirmationDialog
        title={modalInfo.title}
        actionText={modalInfo.actionText}
        msg={modalInfo.msg}
        action={deleteVcard}
      />
      <div className="d-flex justify-content-between align-items-center">
        <div className="mx-2">
          <h3 className="mt-4">Vcards</h3>
        </div>
        <div className="mx-2 total-filtro">
          <div>
            <h5 className="mt-4">Total: {pages?.total}</h5>
            <p>Per Page: {vcards.length}</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="mb-3 d-flex justify-content-between flex-wrap">
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="inputPhoneNumber" className="form-label">
            Filter by phone number:
          </label>
          <input
            type="tel"
            name="phone_number"
            className="form-control"
            placeholder="Search by phone number"
            onChange={setFilter}
            value={searchParams.phone_number}
            disabled={currentPage !== 1}
          />
        </div>
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="inputName" className="form-label">
            Filter by name:
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Search by name"
            onChange={setFilter}
            value={searchParams.name}
            disabled={currentPage !== 1}
          />
        </div>
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="inputEmail" className="form-label">
            Filter by email:
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by email"
            name="email"
            onChange={setFilter}
            value={searchParams.email}
            disabled={currentPage !== 1}
          />
        </div>
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="selectBlocked" className="form-label">
            Filter by blocked:
          </label>
          <select
            className="form-select"
            name="blocked"
            value={searchParams.blocked}
            onChange={setFilter}
            disabled={currentPage !== 1}
          >
            <option value="">Any</option>
            <option value="0">Not Blocked</option>
            <option value="1">Blocked</option>
          </select>
        </div>
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="selectsortByBalanceOrMaxDebit" className="form-label">
            Sort by:
          </label>
          <select
            className="form-select"
            name="sort"
            value={searchParams.order}
            onChange={setFilter}
            disabled={currentPage !== 1}
          >
            <option value="">-- No filter --</option>
            <option value="BDESC">Descending Balance</option>
            <option value="BASC">Ascending Balance</option>
            <option value="MDESC">Descending Max Debit</option>
            <option value="MASC">Ascending Max Debit</option>
          </select>
        </div>
      </div>
      <Suspense fallback={<h2>Loading Vcards...</h2>}>
        <Await resolve={dataPromise.vcards}>{vcardsElements}</Await>
      </Suspense>
    </>
  );
};

export default Vcards;
