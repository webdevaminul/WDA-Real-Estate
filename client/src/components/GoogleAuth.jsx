import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../firebase.config";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import {
  googleLoginRequest,
  googleLoginSuccess,
  googleLoginFailure,
} from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function GoogleAuth() {
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Define the mutation for google login process
  const googleAuthMutation = useMutation({
    mutationFn: async (savedData) => {
      dispatch(googleLoginRequest()); // Dispatch login request action before making API call
      const res = await axiosInstance.post("/api/auth/google", savedData);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Google Auth API Response:", data);
      dispatch(googleLoginSuccess(data)); // Dispatch login success action if login is successful
      localStorage.setItem("accessToken", data.token); // Store the access token in localStorage
      navigate("/"); // Navigate to homepage
    },
    onError: () => {
      dispatch(googleLoginFailure("Google auth error"));
    },
  });

  // Function to handle google auth button
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      console.log(result);

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
