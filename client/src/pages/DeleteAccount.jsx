import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { MdCheckCircle, MdError, MdPassword } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import {
  resetError,
  deleteRequest,
  deleteSuccess,
  deleteFailure,
} from "../features/auth/authSlice";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [oldPassValue, setOldPassValue] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const confirmValue = watch("confirm");
  const isConfirm = confirmValue === "Confirm";

  // Clear any error message when navigating away from this page
  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  // Define the mutation for the delete account process
  const deleteAccountMutation = useMutation({
    mutationFn: async (formData) => {
      dispatch(deleteRequest()); // Dispatch delete request action before making API call
      const res = await axiosInstance.delete(`/api/user/delete-account/${user?.userInfo?._id}`, {
        data: formData,
      });
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Delete user API response", data);
      if (!data.success) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess(data)); // Dispatch delete success action if delete is successful
        navigate("/"); // Navigate to homepage
        alert("User Delete Successfully"); // Alert user delete success
      }
    },
    onError: (error) => {
      dispatch(
        deleteFailure(error.response?.data?.message || "Some thing went wrong. Please try again")
      ); // Dispatch delete failure action on error
    },
  });

  // Handle form submission
  const onSubmit = async (formData) => {
    console.log("formData", formData);

    // Trigger the mutation to delete the user
    deleteAccountMutation.mutate(formData);
  };

  return (
    <main className="min-h-[90vh] max-w-sm mx-auto flex items-center justify-center">
      <section className="flex flex-col gap-4 justify-center p-4 w-full">
        <div>
          <h2 className="text-xl md:text-3xl text-center md:font-light text-primary">
            Delete Account
          </h2>
          <p className="text-center text-primary mb-5 font-sans font-light">
            Deleting your account will remove all your data permanently. Please consider this action
            carefully.
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

          {/* Take confirm input */}
          <div
            className={`flex items-center border rounded ${
              errors.confirm ? "border-red-500" : "border-highlightGray/25"
            } mt-4 `}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <IoIosWarning />
            </span>
            <input
              type="text"
              placeholder="Type 'Confirm' to continue"
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 p-2 w-full`}
              {...register("confirm", {
                required: "Type 'Confirm' to continue",
                onChange: () => {
                  dispatch(resetError());
                  setSuccessMessage("");
                },
              })}
              aria-invalid={errors.confirm ? "true" : "false"}
            />
          </div>
          {errors.confirm && (
            <p role="alert" className="text-red-500">
              {errors.confirm.message}
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
            disabled={loading || !isConfirm}
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:bg-primaryWhite disabled:text-primaryBlack disabled:cursor-not-allowed select-none"
          >
            {loading ? "Loading.." : "Delete my account"}
          </button>
        </form>
      </section>
    </main>
  );
}
