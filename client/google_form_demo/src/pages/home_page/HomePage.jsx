import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./HomePage.css";
import { getCookie } from "typescript-cookie";
// import jwt from "jsonwebtoken";
import profilePic from "../../utility/images/profile.png";
import Navbar from "../../components/navbar/Navbar";

function HomePage() {
  const authToken = getCookie("authToken");

  const userName = getCookie("userName");

  // var decodeToken = jwt.decode(authToken);
  // console.log("Decoded token: ", decodeToken);

  return (
    <>
      <Navbar />

      <Outlet />
    </>
  );
}

export default HomePage;
