import { Outlet, Link, useNavigate } from "react-router-dom";
import "../assets/dashboard.css";
import TopBar from "./TopBar";
import LeftBar from "./LeftBar";
import { logout } from "../assets/api";
import { useSelector, useDispatch } from "react-redux";
import { clear as clearUser } from "../stores/user";
import { clear as clearVcard } from "../stores/vcard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { getVcard } from "../stores/vcard";
import { adminSocket, transactionSocket, vcardSocket } from "../assets/sockets.jsx";
import { socket } from "../assets/sockets.jsx";

const Layout = () => {
  const user = useSelector((state) => state.user);
  const vcard = useSelector((state) => state.vcard);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Related to WebSockets
  useEffect(() => {
    let adminSocketInstance, vcardSocketInstance, transactionSocketInstance;
    let cleanAdmin, cleanVcard, cleanTransaction;

    if (user !== null && user.user_type === "A") {
      const adminData = adminSocket(navigate, user, dispatch);
      adminSocketInstance = adminData.socket;
      cleanAdmin = adminData.cleanup;
    }

    if (user !== null) {
      const vcardData = vcardSocket(navigate, user, dispatch);
      vcardSocketInstance = vcardData.socket;
      cleanVcard = vcardData.cleanup;
      const transactionData = transactionSocket(user,dispatch)
      transactionSocketInstance = transactionData.socket;
      cleanTransaction = transactionData.cleanup;
    }

    return () => {
      if (adminSocketInstance) {
        cleanAdmin();
      }
      if (vcardSocketInstance) {
        cleanVcard();
      }
      if (transactionSocketInstance) {
        cleanTransaction();
      }
    };
  }, [user]);

  const clickMenuOption = () => {
    const domReference = document.getElementById("buttonSidebarExpandId");
    if (domReference) {
      if (window.getComputedStyle(domReference).display !== "none") {
        domReference.click();
      }
    }
  };

  useEffect(() => {
    if (user?.user_type === "V" && vcard === null) {
      dispatch(getVcard(user.id));
    }
    if (user !== null) {
      socket.emit("loggedIn", user);
    }
  }, [user]);

  async function logoutClick() {
    const leaved = await logout();
    if (leaved) {
      toast.success("Logout Completed!");
      dispatch(clearUser());
      dispatch(clearVcard());
    } else {
      toast.error("Error to Logout!!");
    }
    navigate("/");
  }

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top flex-md-nowrap p-0 shadow">
        <div className="container-fluid">
          <Link
            className="navbar-brand col-md-3 col-lg-2 me-0 px-3"
            to="."
            onClick={clickMenuOption}
          >
            <img
              src="/react.svg"
              alt="Logotype"
              width="30"
              height="24"
              className="d-inline-block align-text-top me-2 ms-2"
            />
            VCard
          </Link>

          <button
            id="buttonSidebarExpandId"
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <TopBar
            user={user}
            logout={logoutClick}
            clickMenuOption={clickMenuOption}
            vcard={vcard}
          />
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <LeftBar
            user={user}
            logout={logoutClick}
            clickMenuOption={clickMenuOption}
          />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
