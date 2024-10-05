import {
  Form,
  useActionData,
  useNavigation,
} from "react-router-dom";

const Login = () => {
  const navigation = useNavigation();
  const errors = useActionData();

  return (
    <Form method="post" replace className="row g-3 needs-validation">
      <h3 className="mt-5 mb-3">Login</h3>
      <hr />
      <div className="mb-3">
        <label htmlFor="inputUsername" className="form-label">
          Username
        </label>
        <input
          type="text"
          className={
            !errors?.username
              ? "form-control"
              : "is-invalid form-control"
          }
          name="username"
          id="inputUsername"
          required
        />
        {errors?.username && (
          <p className="text-red">{errors.username}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="inputPassword" className="form-label">
          Password
        </label>
        <input
          type="password"
          name="password"
          className={
            !errors?.password
              ? "form-control"
              : "is-invalid form-control"
          }
          id="inputPassword"
        />
        {errors?.password && (
          <p className="text-red">{errors.password}</p>
        )}
      </div>

      <div className="mb-3 d-flex justify-content-center">
        <button
          className="btn btn-primary px-5"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Login in..." : "Log in"}
        </button>
      </div>
    </Form>
  );
};

export default Login;
