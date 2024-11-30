import axios from "axios";

// Create an instance of axios with base configuration
const axiosPublic = axios.create({
  baseURL: "http://localhost:5000",
});

export default axiosPublic;
