const DecisionDialog = (props) => {
  const action = props.action;
  const data = props.data;
  const handleData = props.handleData;
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
              <p>Do you really want to delete your Vcard account?</p>
              <label htmlFor="inputName" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                value={data?.password ? data.password : ""}
                onChange={(e) => handleData(e)}
                required
              />
              <label htmlFor="inputName" className="form-label">
                Confirmation Code
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="confirmCode"
                value={data?.confirmCode ? data.confirmCode : ""}
                onChange={(e) => handleData(e)}
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
                className="btn btn-danger"
                onClick={action}
              >
                Delete Vcard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DecisionDialog;
