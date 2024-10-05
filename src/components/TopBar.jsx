import { NavLink } from "react-router-dom";
import {
  BsBoxArrowInRight,
  BsFillPersonCheckFill,
  BsPersonSquare,
  BsKeyFill,
  BsFillShieldLockFill,
  BsArrowRight,
} from "react-icons/bs";
import { getPhotoURL } from "../assets/utils";
import defaultImg from "../assets/imgs/avatar-none.png";

const TopBar = (props) => {
  const userStore = props.user;
  const clickMenuOption = props.clickMenuOption;
  const vcard = props.vcard;
  const logout = props.logout;

  return (
    <div className="collapse navbar-collapse justify-content-end">
      {userStore?.user_type === "V" && (
        <div>
          <span className="badge bg-light mx-1 text-xl-large text-dark">
            Max Debit: {vcard?.max_debit ?? 0}
          </span>
          <span className="badge bg-light mx-1 text-xl-large text-dark">
            Balance: {vcard?.balance ?? 0}
          </span>
        </div>
      )}
      <ul className="navbar-nav">
        {!userStore ? (
          <>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active nav-link" : "nav-link"
                }
                to="vcards/new"
                onClick={clickMenuOption}
              >
                <BsFillPersonCheckFill className="me-2" size={24} />
                Register
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active nav-link" : "nav-link"
                }
                to="login"
                onClick={clickMenuOption}
              >
                <BsBoxArrowInRight className="me-2" size={24} />
                Login
              </NavLink>
            </li>
          </>
        ) : (
          //Where the user is logged in
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={
                  userStore.photo_url
                    ? getPhotoURL(userStore.photo_url)
                    : defaultImg
                }
                className="rounded-circle z-depth-0 avatar-img"
                alt="Avatar Image"
              />
              <span className="avatar-text">{userStore.name}</span>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-dark dropdown-menu-end"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "active dropdown-item" : "dropdown-item"
                  }
                  to={
                    userStore.user_type === "A"
                      ? `admins/${userStore.id}`
                      : `vcards/${userStore.id}`
                  }
                  onClick={clickMenuOption}
                >
                  <BsPersonSquare className="me-2" size={24} />
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "active dropdown-item" : "dropdown-item"
                  }
                  to="credentials/password"
                  onClick={clickMenuOption}
                >
                  <BsKeyFill className="me-2" size={24} />
                  Change password
                </NavLink>
              </li>
              {userStore?.user_type === "V" && (
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active dropdown-item" : "dropdown-item"
                    }
                    to="credentials/confirmation_code"
                    onClick={clickMenuOption}
                  >
                    <BsFillShieldLockFill className="me-2" size={24} />
                    Change confirmation code
                  </NavLink>
                </li>
              )}
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a onClick={logout} className="dropdown-item linkwherf">
                  <BsArrowRight className="me-2" size={24} />
                  Logout
                </a>
              </li>
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TopBar;
