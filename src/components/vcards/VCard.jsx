import {
  useLoaderData,
  useNavigate,
  useNavigation,
  Form,
} from "react-router-dom";
import { useActionData } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import avatarNoneUrl from "../../assets/imgs/avatar-none.png";
import { getPhotoURL } from "../../assets/utils";
import ConfirmationDialog from "../global/ConfirmationDialog";
import { toast } from "react-toastify";
import { deleteVcard as deleteVcardApi } from "../../assets/api";
import { clear } from "../../stores/user";
import DecisionDialog from "../global/DecisionDialog";
import { socket } from "../../assets/sockets";

const VCard = () => {
  const dataFromLoader = useLoaderData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [vcard, setVcard] = useState({});
  const maxDebitBackup = useRef({});
  const [maxUpdated, setMaxUpdated] = useState([]);
  const user = useSelector((state) => state.user);
  const errors = useActionData();
  const [modalText, setModalText] = useState("");
  //To delete Vcard by the owner
  const [modalData, setModalData] = useState({
    password: "",
    confirmCode: "",
  });
  //Manipulate Image
  const [deletePhotoOnTheServer, setDeletePhotoOnTheServer] = useState(false);
  const [editingImageAsBase64, setEditingImageAsBase64] = useState("");
  const [photoUrl, setPhotoUrl] = useState(avatarNoneUrl);
  const inputPhotoFile = useRef(null);

  function handleModalData(e) {
    const { name, value } = e.target;
    setModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleForm(e) {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setVcard((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
    if (user.user_type === "A" && name === "max_debit") {
      console.log(Boolean(vcard.blocked), maxDebitBackup.current);
      setMaxUpdated(
        maxDebitBackup.current.max_debit === vcard.max_debit
          ? false
          : "max_debit",
      );
    }
  }

  useEffect(() => {
    if (errors === undefined) {
      dataFromLoader?.vcard?.then((data) => {
        setVcard(data);
        maxDebitBackup.current = data.max_debit;
        if (data.photo_url !== null) {
          setPhotoUrl(getPhotoURL(data.photo_url));
        }
      });
    }
  }, [dataFromLoader]);

  useEffect(() => {
    if (deletePhotoOnTheServer) {
      setPhotoUrl(avatarNoneUrl);
    }
    if (editingImageAsBase64) {
      setPhotoUrl(editingImageAsBase64);
    } else {
      vcard?.photo_url
        ? setPhotoUrl(getPhotoURL(vcard?.photo_url))
        : setPhotoUrl(avatarNoneUrl);
    }
  }, [editingImageAsBase64]);

  // To delete vcard
  const modalDeleteShow = () => {
    if (user?.user_type === "A") {
      setModalText(
        `Do you really want to delete the Vcard #${vcard?.phone_number} (${vcard?.name}) ?`,
      );
    }

    document.getElementById("show_modal").click();
  };

  const deleteVcard = async () => {
    const typeUser = user?.user_type;
    const data = {
      user_type: typeUser,
      id: typeUser === "A" ? vcard?.phone_number : user?.id,
      data: {
        confirmation_code: modalData.confirmCode,
        password: modalData.password,
      },
    };
    const response = await deleteVcardApi(data);
    if (response === true) {
      document.getElementById("close_modal").click();
      toast.info("Vcard Erased");
      //Socket
      socket.emit("deletedVCard", user, { phone_number: vcard.phone_number });
      //For owner Vcard
      if (typeUser === "V") {
        dispatch(clear());
      }
      typeUser === "A" ? navigate("/vcards") : navigate("/");
    } else {
      const message =
        typeof response === "string" ? response : "Error to delete vcard";
      toast.error(message);
    }
  };

  //HandleFoto
  const cleanPhoto = () => {
    setDeletePhotoOnTheServer(true);
    setEditingImageAsBase64("");
    setPhotoUrl(avatarNoneUrl);
  };

  const resetToOriginalPhoto = () => {
    setDeletePhotoOnTheServer(false);
    inputPhotoFile.current = "";
    if (user?.photo_url) {
      setPhotoUrl(getPhotoURL(user.photo_url));
    } else {
      changePhotoFile();
    }
  };

  const changePhotoFile = () => {
    try {
      const file = inputPhotoFile.current.files[0];
      if (!file) {
        setEditingImageAsBase64(null);
      } else {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            setEditingImageAsBase64(reader.result);
            setDeletePhotoOnTheServer(false);
          },
          false,
        );
        if (file) {
          reader.readAsDataURL(file);
        }
      }
    } catch (error) {
      setEditingImageAsBase64(null);
    }
  };

  const cancel = () => {
    navigate(-1);
  };

  const title = "Register a new vcard";

  const textSubmit = !dataFromLoader.create
    ? navigation.state === "submitting"
      ? "Saving..."
      : "Save"
    : navigation.state === "submitting"
      ? "Registering..."
      : "Register";

  return (
    <>
      {!dataFromLoader.create && user?.user_type === "A" && (
        <ConfirmationDialog
          title={"Confirm"}
          actionText={"Delete Vcard"}
          msg={modalText}
          action={deleteVcard}
        />
      )}
      {!dataFromLoader.create && user?.user_type === "V" && (
        <DecisionDialog
          data={modalData}
          handleData={handleModalData}
          action={deleteVcard}
        />
      )}
      <Form method="post" className="row g-3 needs-validation">
        {!dataFromLoader.create && user?.user_type === "A" && (
          <input
            className="d-none"
            name="whoEmit"
            type="checkbox"
            checked={maxUpdated}
            onChange={(e) => setMaxUpdated(e.target.checked)}
          />
        )}
        <input
          className="d-none"
          name="photoServer"
          checked={deletePhotoOnTheServer}
          onChange={() => setDeletePhotoOnTheServer((prev) => !prev)}
          type="checkbox"
        />
        <input
          type="text"
          name="base64"
          value={editingImageAsBase64}
          onChange={(e) => setEditingImageAsBase64(e.target.value)}
          className="d-none"
        />
        <h3 className="mt-5 mb-3">
          {vcard?.phone_number ? `Vcard #${vcard.phone_number}` : title}
        </h3>
        <hr />
        <div className="d-flex flex-wrap justify-content-between">
          <div className="w-75 pe-4">
            <div className="mb-3">
              <label htmlFor="inputPhoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={vcard?.phone_number ? vcard.phone_number : ""}
                onChange={(e) => handleForm(e)}
                className={
                  !errors?.phone ? "form-control" : "is-invalid form-control"
                }
                placeholder="Phone Number"
                required
                disabled={!dataFromLoader.create}
              />
              {errors?.phone && <p className="text-red">{errors.phone}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="inputName" className="form-label">
                Name
              </label>
              <input
                type="text"
                className={
                  !errors?.name ? "form-control" : "is-invalid form-control"
                }
                placeholder="Vcard name"
                name="name"
                value={vcard?.name ? vcard.name : ""}
                onChange={(e) => handleForm(e)}
                required
                disabled={
                  user?.id !== parseInt(vcard?.phone_number) &&
                  !dataFromLoader.create
                }
              />
              {errors?.name && <p className="text-red">{errors.name}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={
                  !errors?.email ? "form-control" : "is-invalid form-control"
                }
                placeholder="Email"
                name="email"
                value={vcard?.email ? vcard.email : ""}
                onChange={(e) => handleForm(e)}
                required
                disabled={
                  user?.id !== parseInt(vcard?.phone_number) &&
                  !dataFromLoader.create
                }
              />
              {errors?.email && <p className="text-red">{errors.email}</p>}
            </div>
            {user?.user_type === "A" && (
              <>
                <div className="mb-3">
                  <label htmlFor="inputBalance" className="form-label">
                    Balance
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Balance"
                    name="balance"
                    value={vcard?.balance ? vcard.balance : 0}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="inputMaxDebit" className="form-label">
                    Max Debit
                  </label>
                  <input
                    type="number"
                    className={
                      !errors?.max_debit
                        ? "form-control"
                        : "is-invalid form-control"
                    }
                    placeholder="Max Debit"
                    name="max_debit"
                    value={vcard?.max_debit ? parseInt(vcard.max_debit) : 0}
                    onChange={(e) => handleForm(e)}
                    required
                  />
                  {errors?.max_debit && (
                    <p className="text-red">{errors.max_debit}</p>
                  )}
                </div>
              </>
            )}
            {user?.user_type === "A" && !dataFromLoader.create && (
              <div className="d-flex ms-1 mt-4 flex-wrap justify-content-between">
                <div className="mb-3 me-3 flex-grow-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      name="blocked"
                      checked={vcard?.blocked ? vcard.blocked : false}
                      onChange={(e) => handleForm(e)}
                      type="checkbox"
                    />
                    <label
                      className={
                        vcard?.blocked
                          ? "form-check-label text-danger fw-bold"
                          : "form-check-label text-dark"
                      }
                      htmlFor="inputBlocked"
                    >
                      Vcard is blocked
                    </label>
                  </div>
                </div>
              </div>
            )}
            {dataFromLoader.create && (
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
                    placeholder="Password"
                    name="password"
                  />
                  {errors?.password && (
                    <p className="text-red">{errors.password}</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="inputConfirmationCode" className="form-label">
                    Confirmation Code
                  </label>
                  <input
                    type="password"
                    className={
                      !errors?.code ? "form-control" : "is-invalid form-control"
                    }
                    placeholder="Confirmation Code"
                    name="confirmCode"
                  />
                  {errors?.code && <p className="text-red">{errors.code}</p>}
                </div>
              </>
            )}
          </div>

          <div className="w-25">
            <div className="d-flex flex-column">
              <label className="form-label">Photo</label>
              <div className="form-control text-center">
                <img src={photoUrl} className="w-100" />
              </div>
              {(user?.id === parseInt(vcard?.phone_number) ||
                dataFromLoader.create) && (
                <div className="mt-3 d-flex justify-content-between flex-wrap">
                  <label
                    htmlFor="inputPhoto"
                    className="btn btn-dark flex-grow-1 mx-1"
                  >
                    Carregar
                  </label>
                  {vcard?.photo_url && (
                    <button
                      type="button"
                      className="btn btn-secondary flex-grow-1 mx-1"
                      onClick={resetToOriginalPhoto}
                    >
                      Repor
                    </button>
                  )}
                  {(vcard?.photo_url || editingImageAsBase64) && (
                    <button
                      type="button"
                      className="btn btn-danger flex-grow-1 mx-1"
                      onClick={cleanPhoto}
                    >
                      Apagar
                    </button>
                  )}
                  {/*display errors here*/}
                </div>
              )}
            </div>
          </div>
        </div>
        <hr />
        <div className="mt-2 d-flex justify-content-between">
          <div>
            <button
              className="btn btn-primary px-5 mx-2"
              disabled={navigation.state === "submitting"}
            >
              {textSubmit}
            </button>
            {!dataFromLoader.create && (
              <button
                type="button"
                className="btn btn-secondary px-5 mx-2"
                onClick={cancel}
              >
                Cancel
              </button>
            )}
          </div>
          {!dataFromLoader.create && (
            <button
              type="button"
              className="btn btn-danger px-5 mx-2"
              onClick={modalDeleteShow}
            >
              {user?.user_type === "A" ? "Delete" : "Delete my vCard account"}
            </button>
          )}
        </div>
      </Form>
      <input
        type="file"
        className="d-none"
        id="inputPhoto"
        ref={inputPhotoFile}
        onChange={changePhotoFile}
      />
    </>
  );
};

export default VCard;
