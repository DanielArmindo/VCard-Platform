import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import "../../assets/admin.css";
import { useState, useEffect } from "react";
import avatarNoneUrl from "../../assets/imgs/avatar-none.png";

const Admin = () => {
  const [title, setTitle] = useState("Register a new admin");
  const dataPromise = useLoaderData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const errors = useActionData();
  const [admin, setAdmin] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (errors === undefined) {
      dataPromise?.admin?.then((data) => {
        setAdmin(data);
        setTitle(`Admin #${data.id}`);
      });
    }
  }, [dataPromise]);

  return (
    <Form method="post" className="row g-3 needs-validation">
      <h3 className="mt-5 mb-3">{title}</h3>
      <hr />
      <div className="d-flex flex-wrap justify-content-between">
        <div className="w-75 pe-4">
          <div className="mb-3">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className={
                !errors?.name ? "form-control" : "is-invalid form-control"
              }
              id="inputName"
              name="name"
              onChange={handleChange}
              placeholder="User Name"
              value={admin?.name ?? ""}
              required
            />
            {errors?.name && <p className="text-red">{errors.name}</p>}
          </div>
          <div className="mb-3 px-1">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className={
                !errors?.email ? "form-control" : "is-invalid form-control"
              }
              name="email"
              id="inputEmail"
              onChange={handleChange}
              placeholder="Email"
              value={admin?.email ?? ""}
              required
            />
            {errors?.email && <p className="text-red">{errors.email}</p>}
          </div>
          {!dataPromise?.edit && (
            <>
              <div className="mb-3">
                <label htmlFor="inputPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className={
                    !errors?.password
                      ? "form-control"
                      : "is-invalid form-control"
                  }
                  id="inputPassword"
                  name="password"
                  placeholder="New Password"
                />
                {errors?.password && (
                  <p className="text-red">{errors.password}</p>
                )}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="inputPasswordConfirmation"
                  className="form-label"
                >
                  Password Confirmation
                </label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  className={
                    !errors?.passwordConfirmation
                      ? "form-control"
                      : "is-invalid form-control"
                  }
                  id="inputPasswordConfirmation"
                  placeholder="Password Confirmation"
                />
                {errors?.passwordConfirmation && (
                  <p className="text-red">{errors.passwordConfirmation}</p>
                )}
              </div>
            </>
          )}
        </div>
        <div className="w-25">
          <div className="d-flex flex-column">
            <label className="form-label">Photo</label>
            <div className="form-control text-center">
              <img src={avatarNoneUrl} className="w-100" />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-2 d-flex justify-content-end">
        <button
          className="btn btn-primary px-5 mx-2"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-light px-5 mx-2"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
};

export default Admin;
