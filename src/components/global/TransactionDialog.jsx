const TransactionDialog = (props) => {
  const action = props.action;
  const confirmCode = props.data;
  const handleData = props.handleData;
  const navigation = props.navigation;
  return (
    <>
      <button
        type="button"
        className="d-none"
        data-bs-toggle="modal"
        data-bs-target="#confirmDialog"
        id="show_modal"
      ></button>

      <div
        className="modal fade"
        id="confirmDialog"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Confirmation
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Enter your confirmation code to confirm the transaction.</p>
              <label htmlFor="inputName" className="form-label">
                Confirmation Code
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirmation Code"
                name="confirmation_code"
                value={confirmCode}
                onChange={(e) => handleData(e.target.value)}
                required
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id="close_modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={action}
                disabled={navigation.state === "submitting"}
              >
                Perform Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionDialog;
