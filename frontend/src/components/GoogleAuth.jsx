import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../firebase.config";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { requestStart, googleLoginSuccess, loginFailure } from "../redux/authSlice";
import axiosSecure from "../api/axiosSecure";

export default function GoogleAuth() {
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Define the mutation for google login process
  const googleAuthMutation = useMutation({
    mutationFn: async (savedData) => {
      dispatch(requestStart()); // Dispatch request start action before making API call
      const res = await axiosSecure.post("/api/auth/google", savedData);
      return res.data;
    },
    onSuccess: (data) => {
      // console.log("Google Auth API Response:", data);
      if (!data.success) {
        dispatch(loginFailure()); // Dispatch login failure action if login is fail
      } else {
        dispatch(googleLoginSuccess(data)); // Dispatch google login success action if login is successful
        localStorage.setItem("accessToken", data.token); // Store the access token in localStorage
        navigate("/"); // Navigate to homepage
      }
    },
    onError: () => {
      dispatch(loginFailure("Google auth error"));
    },
  });

  // Function to handle google auth button
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const savedData = {
        userName: result?.user?.displayName,
        userEmail: result?.user?.email,
        userPhoto: result?.user?.photoURL,
      };

      googleAuthMutation.mutate(savedData);
    } catch (error) {
      console.error("Google Auth Error", error);
    }
  };
  return (
    <button
      onClick={handleGoogleAuth}
      disabled={googleAuthMutation.isLoading}
      type="submit"
      className="p-2 mt-1 bg-transparent hover:bg-primaryBgShade1/75 border border-highlightGray/25 rounded disabled:bg-primaryWhite disabled:text-primaryWhite disabled:cursor-not-allowed select-none flex items-center justify-center gap-2"
    >
      <span className="text-2xl">
        <FcGoogle />
      </span>
      <span>{googleAuthMutation.isLoading ? "Loading..." : "Continue with Google"}</span>
    </button>
  );
}
