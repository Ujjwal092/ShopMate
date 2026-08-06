import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://cartsyy.onrender.com/api/v1",
  withCredentials: true,
});
