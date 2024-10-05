import { Form, useActionData, useNavigation } from "react-router-dom";
import { useState } from "react";

const ChangeCredentials = (props) => {
  const changeConfirmationCode = props.changeConfirmationCode;
  const navigation = useNavigation();
  const errors = useActionData();
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [confirmationCodeConfirm, setConfirmationCodeConfirm] = useState("");

  const title = (() => {
    if (!changeConfirmationCode) {
      if (navigation.state === "submitting") {
        return "Changing Password...";
      }
      return "Change Password";
    } else {
      if (navigation.state === "submitting") {
        return "Changing Confirmation Code...";
      }
      return "Change Confirmation Code";
    }
  })();

  return (
    <Form className="row g-3 needs-validation" method="patch">
      <h3 className="mt-5 mb-3">{title}</h3>
      <hr />
      <div className="mb-3">
        <label htmlFor="inputCurrentPassword" className="form-label">
          Current Password
        </label>
        <input
          type="password"
          className={
            !errors?.currentPassword
              ? "form-control"
              : "is-invalid form-control"
          }
          id="inputCurrentPassword"
          name="current_password"
          required
        />
        {errors?.currentPassword && (
          <p className="text-red">{errors.currentPassword}</p>
        )}
      </div>

      <div className="mb-3">
        {!changeConfirmationCode ? (
          <>
            <label htmlFor="inputPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className={
                !errors?.password ? "form-control" : "is-invalid form-control"
              }
              id="inputPassword"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors?.password && <p className="text-red">{errors.password}</p>}
          </>
        ) : (
          <>
            <label htmlFor="inputConfirmationCode" className="form-label">
              New Confirmation Code
            </label>
            <input
              type="password"
              className={
                !errors?.confirmation_code
                  ? "form-control"
                  : "is-invalid form-control"
              }
              id="inputConfirmationCode"
              name="confirmation_code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
            />
            {errors?.confirmation_code && (
              <p className="text-red">{errors.confirmation_code}</p>
            )}
          </>
        )}
      </div>

      <div className="mb-3">
        {!changeConfirmationCode ? (
          <>
            <label htmlFor="inputPasswordConfirm" className="form-label">
              Password Confirmation
            </label>
            <input
              type="password"
              className={
                !errors?.passwordConfirmation
                  ? "form-control"
                  : "is-invalid form-control"
              }
              id="inputPasswordConfirm"
              name="password_confirmation"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            {errors?.passwordConfirmation && (
              <p className="text-red">{errors.passwordConfirmation}</p>
            )}
          </>
        ) : (
          <>
            <label
              htmlFor="inputConfirmationCodeConfirm"
              className="form-label"
            >
              Code Confirmation
            </label>
            <input
              type="password"
              className={
                !errors?.confirmation_code_confirmation
                  ? "form-control"
                  : "is-invalid form-control"
              }
              id="inputConfirmationCodeConfirm"
              name="confirmation_code_confirmation"
              value={confirmationCodeConfirm}
              onChange={(e) => setConfirmationCodeConfirm(e.target.value)}
              required
            />
            {errors?.confirmation_code_confirmation && (
              <p className="text-red">
                {errors.confirmation_code_confirmation}
              </p>
            )}
          </>
        )}
      </div>

      <div className="mb-3 d-flex justify-content-center">
        <button
          className="btn btn-primary px-5"
          disabled={navigation.state === "submitting"}
        >
          {title}
        </button>
      </div>
    </Form>
  );
};

export default ChangeCredentials;
