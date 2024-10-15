import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Router from "./routes/Router";

// const getAccessToken = () => {
//   return getCookie("authToken");
// };

// const authToken = getCookie("authToken");

// const isUser = getCookie("userRole") === "ROLE_USER";

// const isAdmin = getCookie("userRole") === "ROLE_ADMIN";

// console.log("User is admin", isAdmin);
// console.log("Normal User", isUser);

// console.log("Token ==> " , getAccessToken());

export default function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Toaster position="top-right" reverseOrder={false} />
    <App />
  </React.StrictMode>
);
