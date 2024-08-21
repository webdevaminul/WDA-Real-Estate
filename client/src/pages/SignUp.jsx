import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function SignUp() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for the signup process
  const signUpMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/api/auth/signup", formData);
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
    <div className="min-h-[90vh] max-w-xs container mx-auto flex items-center justify-center">
      <div className="flex flex-col gap-4 justify-center p-4 w-full ">
        {/* Switch between signup and signin */}
        <div className="text-primary">
          <p className="text-2xl sm:text-3xl transition-none">Sign up</p>
          <p className="text-sm transition-none">
            <span className="transition-none">or </span>
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
          <input
            type="text"
            placeholder="User name*"
            className={`p-2 bg-transparent border rounded outline-none placeholder:text-highlightGray/75 text-primary ${
              errors.userName ? "border-highlight" : "border-highlightGray/25"
            } `}
            {...register("userName", { required: "User name is required" })}
            aria-invalid={errors.userName ? "true" : "false"}
          />
          {errors.userName && (
            <p role="alert" className="text-highlight">
              {errors.userName.message}
            </p>
          )}

          {/* Email address input */}
          <input
            type="email"
            placeholder="Email address*"
            className={`p-2 mt-4 bg-transparent border rounded outline-none placeholder:text-highlightGray/75 text-primary ${
              errors.userEmail ? "border-highlight" : "border-highlightGray/25"
            }`}
            {...register("userEmail", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            aria-invalid={errors.userEmail ? "true" : "false"}
          />
          {errors.userEmail && (
            <p role="alert" className="text-highlight">
              {errors.userEmail.message}
            </p>
          )}

          {/* Create password input */}
          <input
            type="password"
            placeholder="Create password*"
            className={`p-2 mt-4 bg-transparent border rounded outline-none placeholder:text-highlightGray/75 text-primary ${
              errors.userPassword ? "border-highlight" : "border-highlightGray/25"
            }`}
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
            })}
            aria-invalid={errors.userPassword ? "true" : "false"}
          />
          {errors.userPassword && (
            <p role="alert" className="text-highlight">
              {errors.userPassword.message}
            </p>
          )}

          {/* Sign up button */}
          <button
            disabled={signUpMutation.isLoading}
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryBtn disabled:bg-slate-200 disabled:cursor-not-allowed"
          >
            {signUpMutation.isLoading ? "Loading..." : "Sign up"}
          </button>
        </form>

        {/* Error message */}
        {error && <p className="text-primaryBtn bg-highlight rounded p-2">{error}</p>}

        {/* Success message */}
        {success && <p className="text-[rgba(40, 40, 43)] bg-green-400 rounded p-2">{success}</p>}

        {/* Google button */}
        <button
          disabled={signUpMutation.isLoading}
          type="submit"
          className="p-2 mt-1 bg-transparent hover:bg-primaryBgShade1/75 border border-highlightGray/25 rounded text-primary disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="text-2xl">
            <FcGoogle />
          </span>
          <span className="transition-none">
            {signUpMutation.isLoading ? "Loading..." : "Continue with Google"}
          </span>
        </button>
      </div>
    </div>
  );
}
