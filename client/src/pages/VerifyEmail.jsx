import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    const verifyEmail = async () => {
      // Verify email using token and email
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify-email?token=${token}&email=${email}`,
          { withCredentials: true }
        );

        console.log(response);
        navigate("/");
      } catch (error) {
        // Handle verification failure
        console.error("Email verification failed", error);
      }
    };

    verifyEmail();
  }, [location]);
  return (
    <div>
      <h1>Verifying your email..</h1>
    </div>
  );
}
