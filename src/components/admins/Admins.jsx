import "../../assets/admins.css";
import { useLoaderData, Await, Link } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import avatarNoneUrl from "../../assets/imgs/avatar-none.png";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import ConfirmationDialog from "../global/ConfirmationDialog";
import { deleteAdmin as deleteAdminApi } from "../../assets/api";
import { toast } from "react-toastify";
import { socket } from "../../assets/sockets";

const Admins = () => {
  const dataPromise = useLoaderData();
  const [admins, setAdmins] = useState([]);
  const user = useSelector((state) => state.user);
  const [modalInfo, setModalInfo] = useState({
    actionText: "Delete Admin",
    title: "Confirmation",
    msg: "Do you really want to delete the Admin #1 (Administrator 1)?",
  });

  const modalDeleteShow = (id, text) => {
    setModalInfo((prev) => ({
      ...prev,
      msg: `Do you really want to delete the Admin #${id} (${text})?  ?`,
      id: id,
    }));
    document.getElementById("show_modal").click();
  };

  useEffect(() => {
    dataPromise.admins.then((data) => setAdmins(data));
  }, [dataPromise]);

  async function deleteAdmin() {
    const response = await deleteAdminApi(modalInfo.id);
    if (response === true) {
      document.getElementById("close_modal").click();
      //Socket
      const elementDeleted = admins.find((item) => item.id === modalInfo.id);
      socket.emit("deletedAdmin", user, elementDeleted);
      toast.info("Admin Erased");
      setAdmins((prev) => prev.filter((item) => item.id !== modalInfo.id));
    } else {
      toast.error("Error to delete admin");
    }
  }

  function adminsElements() {
    if (admins.length <= 0) {
      return <h2>Empty Admins</h2>;
    }

    const displayElements = admins.map((item) => {
      return (
        <tr key={item.id}>
          <td className="align-middle">{item.id}</td>
          <td className="align-middle">
            <img src={avatarNoneUrl} className="rounded-circle img_photo" />
          </td>
          <td className="align-middle">{item.name}</td>
          <td className="align-middle">{item.email}</td>
          <td className="text-end">
            <div className="d-flex justify-content-end">
              {user.id === item.id ? (
                <Link className="btn btn-xs btn-light" to={`${item.id}`}>
                  <BiPencil size={24} />
                </Link>
              ) : (
                <button
                  className="btn btn-xs btn-light"
                  onClick={() => modalDeleteShow(item.id, item.name)}
                >
                  <BiTrash size={24} />
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    });

    return (
      <table className="table">
        <thead>
          <tr>
            <th className="align-middle">#</th>
            <th className="align-middle">Photo</th>
            <th className="align-middle">Name</th>
            <th className="align-middle">Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{displayElements}</tbody>
      </table>
    );
  }

  return (
    <>
      <ConfirmationDialog
        title={modalInfo.title}
        actionText={modalInfo.actionText}
        msg={modalInfo.msg}
        action={deleteAdmin}
      />

      <div className="d-flex justify-content-between">
        <div className="mx-2">
          <h3 className="mt-4">Admins</h3>
        </div>
        <div className="mx-2 total-filtro">
          <h5 className="mt-4">Total: {admins.length}</h5>
        </div>
      </div>
      <hr />
      <div className="mb-3 ">
        <div className="mx-2 mt-2">
          <Link to="new" className="btn btn-success px-4 btn-addadmin">
            <FiPlusCircle size={20} />
            &nbsp; Add Admin
          </Link>
        </div>
      </div>
      {/*Show here admins list*/}
      <Suspense fallback={<h2>Loading Admins...</h2>}>
        <Await resolve={dataPromise.admins}>{adminsElements}</Await>
      </Suspense>
    </>
  );
};

export default Admins;
