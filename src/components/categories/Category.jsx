import {
  Form,
  useNavigate,
  useLoaderData,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { useEffect, useState } from "react";

const Category = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const errors = useActionData();
  const navigation = useNavigation();
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("New Category");

  useEffect(() => {
    if (errors === undefined) {
      loaderData?.category?.then((data) => {
        setCategory(data);
        setTitle(`Category #${data.id}`);
      });
    }
  }, [loaderData]);

  //Only for handle error of uncontrolled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  return (
    <Form className="row g-3 needs-validation" method="post">
      <h3 className="mt-5 mb-3">{title}</h3>
      <hr />
      <div className="mb-3">
        <label htmlFor="inputName" className="form-label">
          Name
        </label>
        <input
          type="text"
          className={!errors?.name ? "form-control" : "is-invalid form-control"}
          name="name"
          placeholder="Category Name"
          value={category?.name || ""}
          onChange={handleChange}
          required
        />
        {errors?.name && <p className="text-red">{errors.name}</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="inputType" className="form-label">
          Type
        </label>
        <select
          className={!errors?.type ? "form-select" : "is-invalid form-select"}
          name="type"
          value={category?.type || ""}
          onChange={handleChange}
          required
        >
          <option value="C">Credit</option>
          <option value="D">Debit</option>
        </select>
        {errors?.type && <p className="text-red">{errors.type}</p>}
      </div>
      <div className="mb-3 d-flex justify-content-end">
        <button
          className="btn btn-primary px-5"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-light px-5"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
};

export default Category;
