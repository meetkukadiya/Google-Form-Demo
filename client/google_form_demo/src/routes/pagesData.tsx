import React from "react";
import HomePage from "../pages/home_page/HomePage";
import AddFormPage from "../pages/add_form/AddFormPage";
import UserPage from "../pages/user_page/UserPage";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import { getCookie } from "typescript-cookie";
import { Navigate } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";

interface routerType {
  title: string;
  path: string;
  element: JSX.Element;
}

const authToken = getCookie("authToken");

const isUser = getCookie("userRole") === "ROLE_USER";

const isAdmin = getCookie("userRole") === "ROLE_ADMIN";

console.log("User is admin", isAdmin);
console.log("Normal User", isUser);

const pagesData: routerType[] = [
  {
    path: "",
    element: authToken ? (
      isAdmin ? (
        <Navigate to="/addform" />
      ) : isUser ? (
        <Navigate to="/userpage" />
      ) : (
        <HomePage />
      )
    ) : (
      <HomePage />
    ),
    title: "home",
  },

  {
    path: "login",
    element: authToken ? (
      isAdmin ? (
        <Navigate to="/addform" />
      ) : isUser ? (
        <Navigate to="/userpage" />
      ) : (
        <LoginPage />
      )
    ) : (
      <LoginPage />
    ),
    title: "home",
  },

  {
    path: "register",
    element: authToken ? (
      isAdmin ? (
        <Navigate to="/addform" />
      ) : isUser ? (
        <Navigate to="/userpage" />
      ) : (
        <RegisterPage />
      )
    ) : (
      <RegisterPage />
    ),
    title: "home",
  },

  {
    path: "/addform",
    element: <PrivateRoute element={<AddFormPage />} isAdmin={isAdmin} />,
    title: "addform",
  },

  {
    path: "/userpage",
    // element: <UserPage />,
    element: <PrivateRoute element={<UserPage />} isUser={isUser} />,
    title: "userpage",
  },
];

export default pagesData;
