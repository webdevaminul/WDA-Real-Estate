import axios from "axios";

// Create an instance of axios with base configuration
const axiosPublic = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000" // Development URL
      : "backendurl", // Production URL,
});

export default axiosPublic;
