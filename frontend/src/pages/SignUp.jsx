import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { MdError, MdCheckCircle, MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axiosPublic from "../api/axiosPublic";
import GoogleAuth from "../components/GoogleAuth";
import { Helmet } from "react-helmet-async";

// TODO: Turn off auto complete

export default function SignUp() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passValue, setPassValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for the signup process
  const signUpMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosPublic.post("/api/auth/signup", formData);
      return res.data;
    },
    onSuccess: (data) => {
      setError(null); // Clear any previous error message
      setSuccess(null); // Clear any previous success message
      if (!data.success) {
        setError(data.message);
      } else {
        setSuccess(data.message);
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
      setSuccess(null);
    },
  });

  // Handle form submission
  const onSubmit = async (formData) => {
    signUpMutation.mutate(formData);
  };

  return (
    <main className="min-h-[90vh] max-w-xs mx-auto flex items-center justify-center">
      <Helmet>
        <title>Sign Up | WDA Real Estate</title>
      </Helmet>
      <section className="flex flex-col gap-4 justify-center p-4 w-full ">
        {/* Switch between signup and signin */}
        <div>
          <p className="text-2xl sm:text-3xl">Sign up</p>
          <p className="text-sm">
            <span>or </span>
            <span>
              <Link to="/sign-in" className="text-blue-500 hover:underline">
                sign in to your account
              </Link>
            </span>
          </p>
        </div>

        {/* Sign up form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* User name input */}
          <div
            className={`flex items-center border rounded ${
              errors.userName ? "border-red-500" : "border-highlightGray/25"
            } mt-4 `}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <FiUser />
            </span>
            <input
              type="text"
              placeholder="User name*"
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 p-2 w-full`}
              {...register("userName", {
                required: "User name is required",
                maxLength: {
                  value: 24,
                  message: "User Name can't be more than 24 characters long",
                },
                onChange: () => {
                  setError(null);
                  setSuccess(null);
                },
              })}
              aria-invalid={errors.userName ? "true" : "false"}
            />
          </div>
          {errors.userName && (
            <p role="alert" className="text-red-500">
              {errors.userName.message}
            </p>
          )}

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
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 p-2 w-full`}
              {...register("userEmail", {
                required: "Email address is required",
                maxLength: {
                  value: 50,
                  message: "Email address must be less than 50 characters",
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
                onChange: () => {
                  setError(null);
                  setSuccess(null);
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
              type={`${showPassword ? "tex" : "password"}`}
              placeholder="Create password*"
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 p-2 w-full`}
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
                  setError(null);
                  setSuccess(null);
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
            <p className="text-primaryWhite bg-red-600 rounded p-2 mt-4 flex items-center justify-center gap-2">
              <span className="text-xl">
                <MdError />
              </span>
              <span className="break-all">{error}</span>
            </p>
          )}

          {/* Success message */}
          {success && (
            <p className="text-primaryBlack bg-green-400 rounded p-2 mt-4 flex items-center justify-center gap-2">
              <span className="text-xl">
                <MdCheckCircle />
              </span>
              <span className="break-all">{success}</span>
            </p>
          )}

          {/* Sign up button */}
          <button
            disabled={signUpMutation.isLoading}
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:bg-primaryWhite disabled:text-primaryBlack disabled:cursor-not-allowed select-none"
          >
            {signUpMutation.isLoading ? "Loading..." : "Sign up"}
          </button>
        </form>

        {/* Google button */}
        <GoogleAuth />
      </section>
    </main>
  );
}
