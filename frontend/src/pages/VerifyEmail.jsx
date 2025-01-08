import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdVerified, MdError } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { emailLoginSuccess, requestStart, loginFailure } from "../redux/authSlice";
import axiosSecure from "../api/axiosSecure";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Extract token from query parameters
    const token = new URLSearchParams(location.search).get("token");

    const verifyEmail = async () => {
      try {
        dispatch(requestStart()); // Dispatch request start action before making API call
        const res = await axiosSecure.get(`/api/auth/verify-email?token=${token}`);
        dispatch(emailLoginSuccess(res.data)); // Dispatch login success action if login is successful
        localStorage.setItem("accessToken", res.data.token); // Store the access token in localStorage
        // console.log("Sign up API Response:", res.data);

        setTimeout(() => {
          navigate("/"); // Navigate to homepage
        }, 1000);
      } catch (error) {
        dispatch(loginFailure("Email verification failed")); // Dispatch login failure action on error
      }
    };
    verifyEmail();
  }, [location]);

  return (
    <main className="min-h-[calc(100vh-44px)] sm:min-h-[calc(100vh-58px)] flex flex-col items-center justify-center bg-primaryBg">
      {loading ? (
        <>
          <h2 className="text-2xl">Verifying your email</h2>
          <span className="loading loading-ring loading-lg"></span>
        </>
      ) : (
        <>
          <h2 className={`text-2xl ${error ? "text-red-500" : "text-green-400"}`}>
            {error ? "Email verification failed" : "Email verified successfully"}
          </h2>
          <span className={`text-2xl ${error ? "text-red-500" : "text-green-400"}`}>
            {error ? <MdError /> : <MdVerified />}
          </span>
        </>
      )}
    </main>
  );
}
