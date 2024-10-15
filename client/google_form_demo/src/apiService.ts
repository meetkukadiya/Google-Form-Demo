import axiosInstance from "./axiosInstance";

const apiService = {
  get: (url: string, params?: any) => {
    return axiosInstance.get(url, { params });
  },
  post: (url: string, data: any) => {
    return axiosInstance.post(url, data);
  },
  put: (url: string, data: any) => {
    return axiosInstance.put(url, data);
  },
  delete: (url: string) => {
    return axiosInstance.delete(url);
  },
};

export default apiService;
