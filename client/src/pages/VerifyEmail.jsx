import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdVerified, MdError } from "react-icons/md";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [verification, setVerification] = useState({
    isLoading: true,
    isError: false,
    message: "",
  });

  useEffect(() => {
    // Extract token from query parameters
    const token = new URLSearchParams(location.search).get("token");

    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`, {
          withCredentials: true,
        });
        console.log("Sign up API Response:", res.data);
        setVerification({
          isLoading: false,
          isError: false,
          message: "Email verified successfully",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        console.error("Verification failed:", error);
        setVerification({
          isLoading: false,
          isError: true,
          message: "Email verification failed",
        });
      }
    };
    verifyEmail();
  }, [location]);

  return (
    <div className="min-h-[calc(100vh-44px)] sm:min-h-[calc(100vh-58px)] flex flex-col items-center justify-center bg-primaryBg">
      {verification.isLoading ? (
        <>
          <h1 className="text-primary text-2xl">Verifying your email</h1>
          <span className="loading loading-ring loading-lg text-primary"></span>
        </>
      ) : (
        <>
          <h1 className={`text-2xl ${verification.isError ? "text-red-500" : "text-green-400"}`}>
            {verification.message}
          </h1>
          <span className={`text-2xl ${verification.isError ? "text-red-500" : "text-green-400"}`}>
            {verification.isError ? <MdError /> : <MdVerified />}
          </span>
        </>
      )}
    </div>
  );
}
