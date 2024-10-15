import React from "react";
import { getCookie, removeCookie } from "typescript-cookie";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const authToken = getCookie("authToken");

  const userName = getCookie("userName");
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("authToken");
    removeCookie("userEmail");
    removeCookie("userName");
    removeCookie("userRole");

    // navigate("/login");
    window.location.assign("/");
  };

  return (
    <div className="border-b-4	border-gray-700		">
      <nav>
        <ul>
          {!authToken && (
            <li>
              <button>
                <Link to="/login">Login</Link>
              </button>
            </li>
          )}
          {!authToken && (
            <li>
              <button>
                <Link to="/register">Register</Link>
              </button>
            </li>
          )}
        </ul>
        {authToken && (
          <h1 className="text-xl font-medium text-black">{userName}</h1>
        )}
        {authToken && (
          <button
            className="flex justify-center ml-5 focus:outline-none text-white bg-red-700 hover:bg-red-800  font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
