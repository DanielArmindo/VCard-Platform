import { socket } from "../../assets/sockets.jsx";
import { useState } from "react";
import { verfConfirmCode } from "../../assets/utils";
import { toast } from "react-toastify";
import { postTransaction } from "../../assets/api";
import "../../assets/transactionToast.css";
import { getVcard } from "../../stores/vcard";

const RequestTransactionToast = (props) => {
  const message = props.message;
  const dispatch = props.dispatch;
  const [confirmCode, setConfirmCode] = useState("");
  const [errors, setErrors] = useState("");

  const [showInputConfirmationCode, setShowInputConfirmationCode] =
    useState(false);
  const [showButtonAccept, setShowButtonAccept] = useState(true);
  const [showButtonDeny, setShowButtonDeny] = useState(true);
  const [showButtonCancel, setShowButtonCancel] = useState(false);
  const [showButtonConfirm, setShowButtonConfirm] = useState(false);

  const deny = () => {
    props.closeToast();
    socket.emit(
      "moneyRequestDeclined",
      props.requester,
      props.responder,
      props.transactionValue,
    );
  };

  const accept = () => {
    setShowInputConfirmationCode(true);
    setShowButtonAccept(false);
    setShowButtonDeny(false);
    setShowButtonCancel(true);
    setShowButtonConfirm(true);
  };

  const cancel = () => {
    setShowInputConfirmationCode(false);
    setShowButtonAccept(true);
    setShowButtonDeny(true);
    setShowButtonCancel(false);
    setShowButtonConfirm(false);
  };

  const confirm = async () => {
    if (verfConfirmCode(confirmCode)) {
      const response = await postTransaction({
        type: "V",
        data: {
          vcard: props.responder,
          type: "D",
          payment_type: "VCARD",
          payment_reference: props.requester,
          value: props.transactionValue,
          description: null,
          confirmation_code: confirmCode,
          category_id: null,
        },
      });
      if (response === true) {
        props.closeToast();
        dispatch(getVcard(props.responder))
        toast.success(
          `Transaction with value ${props.transactionValue}€ to ${props.requester} was created!`,
        );
      } else {
        const message =
          typeof response === "string"
            ? response
            : "Error to perform transaction";
        toast.error(message);
      }
    } else {
      setErrors("Must be a number with minimun 3 digits!!");
    }
  };

  return (
    <div className="d-flex flex-column text-light">
      <div className="needs-validation">
        <span id="title">{message}</span>
        {showInputConfirmationCode && (
          <div className="mb-3">
            <input
              type="password"
              className={
                !errors ? "form-control mt-2" : "is-invalid form-control mt-2"
              }
              placeholder="Confirmation Code"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
            />
            {errors && <p className="text-red">{errors}</p>}
          </div>
        )}
        <div className="d-flex justify-content-between mt-2">
          {showButtonDeny && (
            <button
              type="button"
              onClick={deny}
              className="btn btn-sm btn-danger"
            >
              Rejeitar
            </button>
          )}

          {showButtonAccept && (
            <button
              type="button"
              onClick={accept}
              className="btn btn-sm btn-success"
            >
              Aceitar
            </button>
          )}

          {showButtonCancel && (
            <button
              type="button"
              className="btn btn-sm btn-secondary text-center"
              onClick={cancel}
            >
              Cancelar
            </button>
          )}

          {showButtonConfirm && (
            <button
              type="button"
              onClick={confirm}
              className="btn btn-sm btn-success"
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestTransactionToast;
