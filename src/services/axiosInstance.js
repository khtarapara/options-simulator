import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);
