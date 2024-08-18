import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setError(null); // Clear any previous error
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
          <input
            type="email"
            placeholder="Email address*"
            className={`p-2 mt-4 bg-transparent border rounded outline-none placeholder:text-highlightGray/75 ${
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
            placeholder="Password*"
            className={`p-2 mt-4 bg-transparent border rounded outline-none placeholder:text-highlightGray/75 ${
              errors.userPassword ? "border-highlight" : "border-highlightGray/25"
            }`}
            {...register("userPassword", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
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

          {/* Sign in button */}
          <button
            disabled={loading}
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryBtn disabled:bg-slate-200 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>

        {/* Error message */}
        {error && <p className="text-highlight">{error}</p>}

        {/* Google button */}
        <button
          disabled={loading}
          type="submit"
          className="p-2 mt-1 bg-transparent hover:bg-primaryBgShade1/75 border border-highlightGray/25 rounded text-primary disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="text-2xl">
            <FcGoogle />
          </span>
          <span className="transition-none">{loading ? "Loading..." : "Continue with Google"}</span>
        </button>
      </div>
    </div>
  );
}
