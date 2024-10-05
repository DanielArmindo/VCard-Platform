const ConfirmationDialog = (props) => {
  const title = props.title
  const message = props.msg
  const actionText = props.actionText
  const action = props.action
  return (
    <>
      <button
        type="button"
        className="d-none"
        data-bs-toggle="modal"
        data-bs-target="#confirmDialog"
        id="show_modal"
      >
      </button>

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
                {title}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{message}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id="close_modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={action}>
                {actionText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationDialog;
