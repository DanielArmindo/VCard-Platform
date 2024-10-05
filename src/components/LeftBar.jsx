import { NavLink } from "react-router-dom";
import {
  BsBoxArrowInRight,
  BsFillPersonCheckFill,
  BsPersonSquare,
  BsKeyFill,
  BsArrowRight,
  BsPersonGear,
  BsFiles,
  BsCash,
  BsBank,
  BsPiggyBank,
  BsListCheck,
} from "react-icons/bs";
import { getPhotoURL } from "../assets/utils";
import defaultImg from "../assets/imgs/avatar-none.png";

const LeftBar = (props) => {
  const userStore = props.user;
  const clickMenuOption = props.clickMenuOption;
  const logout = props.logout;

  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
    >
      <div className="position-sticky pt-3">
        <>
          {userStore && (
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "active nav-link pt-3 pb-3"
                      : "nav-link pt-3 pb-3"
                  }
                  to="categories"
                >
                  <BsListCheck className="me-2" size={24} />
                  Categories
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "active nav-link pt-3 pb-3"
                      : "nav-link pt-3 pb-3"
                  }
                  to="statistics"
                >
                  <BsFiles className="me-2" size={24} />
                  Statistics
                </NavLink>
              </li>

              {userStore?.user_type === "A" && (
                <>
                  <li className="nav-item mb-2">
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "active nav-link pt-3 pb-3"
                          : "nav-link pt-3 pb-3"
                      }
                      to="admins"
                      onClick={clickMenuOption}
                    >
                      <BsPersonGear className="me-2" size={24} />
                      Admins
                    </NavLink>
                  </li>
                  <li className="nav-item mb-2">
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "active nav-link pt-3 pb-3"
                          : "nav-link pt-3 pb-3"
                      }
                      to="vcards"
                      onClick={clickMenuOption}
                    >
                      <BsFiles className="me-2" size={24} />
                      VCards
                    </NavLink>
                  </li>
                  <li className="nav-item mb-2">
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "active nav-link pt-3 pb-3"
                          : "nav-link pt-3 pb-3"
                      }
                      to="transactions/new"
                    >
                      <BsCash className="me-2" size={24} />
                      Credit transaction
                    </NavLink>
                  </li>
                </>
              )}
              {userStore?.user_type !== "A" && (
                <li className="nav-item mb-2">
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "active nav-link pt-3 pb-3"
                        : "nav-link pt-3 pb-3"
                    }
                    to="transactions"
                  >
                    <BsBank className="me-2" size={24} />
                    Transactions
                  </NavLink>
                </li>
              )}
              {userStore?.user_type === "V" && (
                <li className="nav-item mb-2">
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "active nav-link pt-3 pb-3"
                        : "nav-link pt-3 pb-3"
                    }
                    to="piggybank"
                  >
                    <BsPiggyBank className="me-2" size={24} />
                    Piggy Bank
                  </NavLink>
                </li>
              )}
            </ul>
          )}

          <div className="d-block d-md-none">
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>User</span>
            </h6>
            <ul className="nav flex-column mb-2">
              {userStore ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdownMenuLink2"
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
                      alt="Avatar image"
                    />
                    <span className="avatar-text">{userStore?.name}</span>
                  </a>

                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink2"
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
                          <BsKeyFill className="me-2" size={24} />
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
              ) : (
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
              )}
            </ul>
          </div>
        </>
      </div>
    </nav>
  );
};

export default LeftBar;
