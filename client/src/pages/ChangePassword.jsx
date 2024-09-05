import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdError, MdOutlineEmail, MdOutlineLock, MdPassword } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, loginSuccess, loginFailure } from "../features/auth/authSlice";
import axiosInstance from "../api/axiosInstance";
import { useEffect, useState } from "react";
import GoogleAuth from "../components/GoogleAuth";

export default function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [oldPassValue, setOldPassValue] = useState("");
  const [newPassValue, setNewPassValue] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Clear any error message when navigating away from this page
  // useEffect(() => {
  //   dispatch(loginFailure(null));
  // }, [dispatch]);

  // Define the mutation for the password change process
  // const changePasswordMutation = useMutation({
  //   mutationFn: async (formData) => {
  //     dispatch(loginRequest()); // Dispatch login request action before making API call
  //     const res = await axiosInstance.post("/api/auth/signin", formData);
  //     return res.data;
  //   },
  //   onSuccess: (data) => {
  //     console.log("Sign in API Response:", data);
  //     if (!data.success) {
  //       dispatch(loginFailure(data.message));
  //     } else {
  //       dispatch(loginSuccess(data)); // Dispatch login success action if login is successful
  //       navigate("/"); // Navigate to homepage
  //     }
  //   },
  //   onError: (error) => {
  //     dispatch(
  //       loginFailure(error.response?.data?.message || "Some thing went wrong. Please try again")
  //     ); // Dispatch login failure action on error
  //   },
  // });

  // Handle form submission
  const onSubmit = async (formData) => {
    console.log(formData);
  };

  return (
    <main className="min-h-[90vh] max-w-sm mx-auto flex items-center justify-center">
      <section className="flex flex-col gap-4 justify-center p-4 w-full">
        <div>
          <h2 className="text-xl md:text-3xl text-center md:font-light text-primary">
            Change Password
          </h2>
          <p className="text-center text-primary mb-5 font-sans font-light">
            Combine alphabet with number to create a secure password
          </p>
        </div>

        {/* Sign up form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Verify old password input */}
          <div
            className={`flex items-center border rounded ${
              errors.userPassword ? "border-red-500" : "border-highlightGray/25"
            } mt-4 `}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <MdPassword />
            </span>
            <input
              type={`${showOldPassword ? "text" : "password"}`}
              placeholder="Previous password"
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 p-2 w-full`}
              {...register("userPassword", {
                required: "Password can not be empty",
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
                  setOldPassValue(event.target.value);
                },
              })}
              aria-invalid={errors.userPassword ? "true" : "false"}
            />
            {oldPassValue.length > 0 && (
              <span
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="p-2 text-xl text-highlightGray/75"
              >
                {showOldPassword ? (
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

          {/* Create a new password input */}
          <div
            className={`flex items-center border rounded ${
              errors.newPassword ? "border-red-500" : "border-highlightGray/25"
            } mt-4 `}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <MdOutlineLock />
            </span>
            <input
              type={`${showNewPassword ? "text" : "password"}`}
              placeholder="New password"
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 p-2 w-full`}
              {...register("newPassword", {
                required: "Password can not be empty",
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
                  setNewPassValue(event.target.value);
                },
              })}
              aria-invalid={errors.newPassword ? "true" : "false"}
            />
            {newPassValue.length > 0 && (
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="p-2 text-xl text-highlightGray/75"
              >
                {showNewPassword ? (
                  <FaRegEyeSlash className="cursor-pointer" />
                ) : (
                  <FaRegEye className="cursor-pointer" />
                )}
              </span>
            )}
          </div>
          {errors.newPassword && (
            <p role="alert" className="text-red-500">
              {errors.newPassword.message}
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="text-primaryWhite bg-red-600 rounded p-2 mt-4 flex items-center gap-2">
              <span className="text-xl">
                <MdError />
              </span>
              <span>{error}</span>
            </p>
          )}

          {/* Sign in button */}
          <button
            disabled={loading}
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:bg-slate-200 disabled:cursor-not-allowed select-none"
          >
            {loading ? "Loading..." : "Change password"}
          </button>
        </form>
      </section>
    </main>
  );
}
