import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { MdCheckCircle, MdError, MdOutlineLock, MdPassword } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import axiosSecure from "../api/axiosSecure";
import { profileUpdateSuccess, requestFailure, requestStart, resetError } from "../redux/authSlice";
import Title from "../components/Title";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [oldPassValue, setOldPassValue] = useState("");
  const [newPassValue, setNewPassValue] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Clear any error message when navigating away from this page
  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  // Define the mutation for the password change process
  const changePasswordMutation = useMutation({
    mutationFn: async (formData) => {
      dispatch(requestStart()); // Dispatch request start action before making API call
      const res = await axiosSecure.post(
        `/api/user/change-password/${user?.userInfo?._id}`,
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Change Password API Response:", data);
      if (!data.success) {
        dispatch(requestFailure(data.message)); // Dispatch request failure action if update if fail
      } else {
        dispatch(profileUpdateSuccess(data)); // Dispatch update success action if update is successful
        setSuccessMessage("Password updated successfully"); // Display success message
      }
    },
    onError: (error) => {
      dispatch(
        requestFailure(error.response?.data?.message || "Some thing went wrong. Please try again")
      ); // Dispatch request failure action on error
    },
  });

  // Handle form submission
  const onSubmit = async (formData) => {
    console.log("formData", formData);

    // Trigger the mutation to update the user password
    changePasswordMutation.mutate(formData);
  };

  return (
    <main className="min-h-[90vh] max-w-sm mx-auto flex items-center justify-center">
      <section className="flex flex-col gap-4 justify-center p-4 w-full">
        <Title
          title={"Change Password"}
          subTitle={"Combine alphabet with number to create a secure password"}
        />

        {/* Sign up form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Verify old password input */}
          <div
            className={`flex items-center border rounded ${
              errors.userPassword ? "border-red-500" : "border-highlightGray/25"
            }`}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <MdPassword />
            </span>
            <input
              type={`${showOldPassword ? "text" : "password"}`}
              placeholder="Current password"
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
                  dispatch(resetError());
                  setSuccessMessage("");
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
                  dispatch(resetError());
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
          {error && (
            <p className="text-primaryWhite bg-red-600 rounded p-2 mt-4 flex items-center justify-center gap-2">
              <span className="text-xl">
                <MdError />
              </span>
              <span>{error}</span>
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
