const RequestTransactionDialog = (props) => {
  const action = props.action;
  const data = props.data;
  const errors = props.errors;
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
                Request Transaction
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label htmlFor="inputName" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className={
                  !errors?.phoneNumber ? "form-control" : "is-invalid form-control"
                }
                placeholder="Enter phone number"
                name="phone_number"
                value={data?.phoneNumber ? data.phoneNumber : ""}
                onChange={(e) => data.setPhoneNumber(e.target.value)}
              />
              {errors?.phoneNumber && <p className="text-red">{errors.phoneNumber}</p>}
              <label htmlFor="inputName" className="form-label mt-3">
                Value
              </label>
              <input
                type="number"
                className={
                  !errors?.value ? "form-control" : "is-invalid form-control"
                }
                placeholder="Enter transaction value"
                name="value"
                value={data?.value ? data.value : ""}
                onChange={(e) => data.setValue(e.target.value)}
                min="0"
              />
              {errors?.value && <p className="text-red">{errors.value}</p>}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id="close_modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={action}
              >
                Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestTransactionDialog;
