import axios from "axios";
import { getCookie } from "typescript-cookie";

const baseUrl = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  // timeout: 1000,
  // headers: { "Content-Type": "application/json" },
  headers: {},
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = getCookie("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Config for axiosInstance: ==> ", config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    console.log("Response:", response);
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized, Please Login!");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
