import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { MdCheckCircle, MdError, MdPassword } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import { useNavigate } from "react-router-dom";
import { requestFailure, requestStart, userClearSuccess, resetError } from "../redux/authSlice";
import Title from "../components/Title";
import { Helmet } from "react-helmet-async";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error, isGoogle } = useSelector((state) => state.auth);
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
      dispatch(requestStart()); // Dispatch request start action before making API call
      const deleteProperties = await axiosSecure.delete(
        `/api/property/user/${user?.userInfo?._id}`
      );
      if (deleteProperties.data.success) {
        const res = await axiosSecure.delete(`/api/user/delete-account/${user?.userInfo?._id}`, {
          data: formData,
        });
        return res.data;
      } else {
        dispatch(requestFailure(data.message)); // Dispatch request failure action if delete is fail
      }
    },
    onSuccess: (data) => {
      // console.log("Delete user API response", data);
      if (!data.success) {
        dispatch(requestFailure(data.message)); // Dispatch request failure action if delete is fail
      } else {
        dispatch(userClearSuccess(data)); // Dispatch user clear success action if delete is successful
        localStorage.removeItem("accessToken"); // Remove access token from localStorage
        navigate("/"); // Navigate to home
        alert("User Delete Successfully"); // Alert user delete success
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
    // Trigger the mutation to delete the user
    isGoogle
      ? deleteAccountMutation.mutate({ isGoogle: true })
      : deleteAccountMutation.mutate(formData);
  };

  return (
    <main className="min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-3.625rem)] max-w-sm mx-auto flex">
      <Helmet>
        <title>Delete Account | WDA Real Estate</title>
      </Helmet>
      <section className="flex flex-col gap-4 sm:justify-center p-4 w-full">
        <Title title={"Delete Account"} subTitle={"Please consider this action carefully"} />

        {/* Sign up form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-4">
          {/* Verify old password input */}
          {!isGoogle && (
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
          )}
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
