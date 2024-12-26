import axios from "axios";

// Create an instance of axios with base configuration
const axiosPublic = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000" // Development URL
      : "https://wda-real-estate-api.vercel.app", // Production URL,
});

export default axiosPublic;
