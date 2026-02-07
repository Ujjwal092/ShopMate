import axios from "axios";
//axios is used to make HTTP requests to the backend server
export const axiosInstance = axios.create({
  baseURL:
  import.meta.env.MODE === "development" 
  ? "http://localhost:4000/api/v1"
  :"/",
  withCredentials: true,
});
//console.log("Axios base URL:", axiosInstance.defaults.baseURL);
