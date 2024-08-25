import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdError, MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, loginSuccess, loginFailure } from "../features/auth/authSlice";
import axiosInstance from "../api/axiosInstance";
import { useState } from "react";
import GoogleAuth from "../components/GoogleAuth";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [passValue, setPassValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for the login process
  const SignInMutation = useMutation({
    mutationFn: async (formData) => {
      dispatch(loginRequest()); // Dispatch login request action before making API call
      const res = await axiosInstance.post("/api/auth/signin", formData);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Sign in API Response:", data);
      if (!data.success) {
        dispatch(loginFailure(data.message));
      } else {
        dispatch(loginSuccess(data)); // Dispatch login success action if login is successful
        navigate("/"); // Navigate to homepage
      }
    },
    onError: (error) => {
      dispatch(
        loginFailure(error.response?.data?.message || "Some thing went wrong. Please try again")
      ); // Dispatch login failure action on error
    },
  });

  // Handle form submission
  const onSubmit = async (formData) => {
    SignInMutation.mutate(formData);
  };

  return (
    <div className="min-h-[90vh] max-w-xs container mx-auto flex items-center justify-center">
      <div className="flex flex-col gap-4 justify-center p-4 w-full ">
        {/* Switch between signup and signin */}
        <div className="text-primary">
          <p className="text-2xl sm:text-3xl transition-none">Sign In</p>
          <p className="text-sm transition-none">
            <span className="transition-none">or </span>
            <span>
              <Link to="/sign-up" className="text-blue-500 hover:underline">
                create your account
              </Link>
            </span>
          </p>
        </div>

        {/* Sign up form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Email address input */}
          <div
            className={`flex items-center border rounded ${
              errors.userEmail ? "border-red-500" : "border-highlightGray/25"
            } mt-4 `}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <MdOutlineEmail />
            </span>
            <input
              type="email"
              placeholder="Email address*"
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 text-primary p-2 w-full`}
              {...register("userEmail", {
                required: "Email address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              aria-invalid={errors.userEmail ? "true" : "false"}
            />
          </div>
          {errors.userEmail && (
            <p role="alert" className="text-red-500">
              {errors.userEmail.message}
            </p>
          )}

          {/* Create password input */}
          <div
            className={`flex items-center border rounded ${
              errors.userPassword ? "border-red-500" : "border-highlightGray/25"
            } mt-4 `}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <MdOutlineLock />
            </span>
            <input
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Password*"
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 text-primary p-2 w-full`}
              {...register("userPassword", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                maxLength: {
                  value: 24,
                  message: "Password can't be more than 24 characters long",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                  message: "Password must contain at least one letter and one number",
                },
                onChange: () => {
                  setPassValue(event.target.value);
                },
              })}
              aria-invalid={errors.userPassword ? "true" : "false"}
            />
            {passValue.length > 0 && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-xl text-highlightGray/75"
              >
                {showPassword ? (
                  <FaRegEyeSlash className="cursor-pointer" />
                ) : (
                  <FaRegEye className="cursor-pointer" />
                )}
              </span>
            )}
          </div>
          {errors.userPassword && (
            <p role="alert" className="text-red-500">
              {errors.userPassword.message}
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="text-primaryBtn bg-red-600 rounded p-2 mt-4 flex items-center gap-2">
              <span className="text-xl">
                <MdError />
              </span>
              {error}
            </p>
          )}

          {/* Sign in button */}
          <button
            disabled={loading}
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryBtn disabled:bg-slate-200 disabled:cursor-not-allowed select-none"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>

        {/* Google button */}
        <GoogleAuth />
      </div>
    </div>
  );
}
