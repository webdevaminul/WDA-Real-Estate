import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { MdCheckCircle, MdError, MdPassword } from "react-icons/md";
import { useLocation } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";

export default function PasswordRecovery() {
  const [newPassValue, setNewPassValue] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for the recover password process
  const recoverPasswordMutation = useMutation({
    mutationFn: async (formData) => {
      setLoading(true);
      const res = await axiosSecure.post(`/api/auth/recover-password?token=${token}`, formData);
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      setErrorMessage("");
      setLoading(false);
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
      setSuccessMessage("");
      setLoading(false);
    },
  });

  // Handle form submission
  const onSubmit = async (formData) => {
    console.log("formData", formData);

    // Trigger the mutation to recover the user password
    recoverPasswordMutation.mutate(formData);
  };

  return (
    <main className="min-h-[90vh] max-w-sm mx-auto flex items-center justify-center">
      <section className="flex flex-col gap-4 justify-center p-4 w-full">
        <div>
          <h2 className="text-xl md:text-3xl text-center md:font-light text-primary">
            Set a new password
          </h2>
          <p className="text-center text-primary mb-5 font-light">
            Combine alphabet with number to create a secure password
          </p>
        </div>

        {/* Sign up form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Set new password input */}
          <div
            className={`flex items-center border rounded ${
              errors.newPassword ? "border-red-500" : "border-highlightGray/25"
            } mt-4 `}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <MdPassword />
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
                  setErrorMessage("");
                  setSuccessMessage("");
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
          {errorMessage && (
            <p className="text-primaryWhite bg-red-600 rounded p-2 mt-4 flex items-center justify-center gap-2">
              <span className="text-xl">
                <MdError />
              </span>
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Success message */}
          {successMessage && (
            <p className="text-primaryBlack bg-green-400 rounded p-2 mt-4 flex items-center justify-center gap-2">
              <span className="text-xl">
                <MdCheckCircle />
              </span>
              <span>{successMessage}</span>
            </p>
          )}
          {/* Change password button */}
          <button
            disabled={loading}
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:bg-primaryWhite disabled:text-primaryBlack disabled:cursor-not-allowed select-none"
          >
            {loading ? "Loading..." : "Change password"}
          </button>
        </form>
      </section>
    </main>
  );
}
