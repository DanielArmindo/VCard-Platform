import { useLoaderData, Await, Link } from "react-router-dom";
import "../../assets/categories.css";
import { FiPlusCircle } from "react-icons/fi";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Suspense, useEffect, useState } from "react";
import ConfirmationDialog from "../global/ConfirmationDialog";
import { deleteCategory as deleteCategoryApi } from "../../assets/api";
import { toast } from "react-toastify";

const Categories = () => {
  const user = useSelector((state) => state.user);
  const dataPromise = useLoaderData();
  const [searchParamsType, setSearchParamsType] = useState("");
  const [searchParams, setSearchParams] = useState("");
  const showId = user?.user_type === "A";
  const [categories, setCategories] = useState([]);
  const [modalInfo, setModalInfo] = useState({
    actionText: "Delete category",
    title: "Confirmation",
    msg: "Are you sure you want to delete the category #1 groceries?",
  });

  const modalDeleteShow = (id, text) => {
    setModalInfo((prev) => ({
      ...prev,
      msg: `Are you sure you want to delete the category #${id} ${text}?`,
      id: id,
    }));
    document.getElementById("show_modal").click();
  };

  const deleteCategory = async () => {
    const response = await deleteCategoryApi({
      type: user.user_type,
      id: modalInfo.id,
    });
    if (response === true) {
      document.getElementById("close_modal").click();
      toast.info("Category Erased");
      setCategories((prev) => prev.filter((item) => item.id !== modalInfo.id));
    } else {
      toast.error("Error to delete category");
    }
  };

  useEffect(() => {
    dataPromise.categories.then((data) => setCategories(data));
  }, [dataPromise]);

  function categoriesElements() {
    if (categories.length === 0) {
      return <h2>Empty Categories</h2>;
    }

    const displayCategories = searchParamsType
      ? categories.filter((item) => item.type === searchParamsType)
      : categories;

    const displayElements = displayCategories.filter(item => item.name.includes(searchParams));

    const elements = displayElements.map((item) => {
      return (
        <tr key={item.id}>
          {showId && <td>{item.id}</td>}
          <td>{item.name}</td>
          <td>{item.type}</td>
          <td className="text-end">
            <div className="d-flex justify-content-end">
              <Link to={`${item.id}`} className="btn btn-xs btn-light">
                <BiPencil size={24} />
              </Link>
              <button
                onClick={() => modalDeleteShow(item.id, item.name)}
                className="btn btn-xs btn-light"
              >
                <BiTrash size={24} />
              </button>
            </div>
          </td>
        </tr>
      );
    });

    return (
      <table className="table">
        <thead>
          <tr>
            {showId && <th>Id</th>}
            <th>Name</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{elements}</tbody>
      </table>
    );
  }

  return (
    <>
      <ConfirmationDialog
        title={modalInfo.title}
        actionText={modalInfo.actionText}
        msg={modalInfo.msg}
        action={deleteCategory}
      />
      <div className="d-flex justify-content-between">
        <div className="mx-2">
          <h3 className="mt-4">Categories</h3>
        </div>
        <div className="mx-2 total-filtro">
          <h5 className="mt-4">Total: {categories?.length}</h5>
        </div>
      </div>
      <hr />
      <div className="mb-3 d-flex justify-content-between flex-wrap">
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="inputName" className="form-label">
            Filter by name:
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            onChange={(event) => setSearchParams(event.target.value)}
          />
        </div>
        <div className="mx-2 mt-2 flex-grow-1 filter-div">
          <label htmlFor="selectType" className="form-label">
            Filter by type:
          </label>
          <select
            onChange={(event) => setSearchParamsType(event.target.value)}
            className="form-select"
          >
            <option value="">All</option>
            <option value="C">Credit</option>
            <option value="D">Debit</option>
          </select>
        </div>
        <div className="mx-2 mt-2">
          <Link
            to="new"
            className="btn btn-success px-4 btn-addcategory"
          >
            <FiPlusCircle size={18} />
            &nbsp; Add Category
          </Link>
        </div>
      </div>
      {/*Show here category list*/}
      <Suspense fallback={<h2>Loading Categories...</h2>}>
        <Await resolve={dataPromise.categories}>{categoriesElements}</Await>
      </Suspense>
    </>
  );
};

export default Categories;
