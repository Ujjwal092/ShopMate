import axios from "axios";
//axios is used to make HTTP requests to the backend server
export const axiosInstance = axios.create({
  baseURL: "https://cartsyy.onrender.com/api/v1",
  withCredentials: true,
});
//console.log("Axios base URL:", axiosInstance.defaults.baseURL);
