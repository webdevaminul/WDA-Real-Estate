import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiLock, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import { GrUpdate } from "react-icons/gr";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase.config";
import { updateRequest, updateSuccess, updateFailure } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

export default function ManageProfile() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const imageRef = useRef(null);
  const dispatch = useDispatch();

  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [avatarURL, setAvatarURL] = useState("");
  const [fileUploadError, setFileUploadError] = useState(false);

  // Set today's date for validation purposes
  const today = new Date().toISOString().split("T")[0];

  // Effect hook to trigger file upload when a file is selected
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Function to handle the file upload process
  const handleFileUpload = (file) => {
    const storage = getStorage(app); // Initialize Firebase storage
    const fileName = new Date().getTime() + file.name; // Generate a unique file name
    const storageRef = ref(storage, fileName); // Create a reference to the file in storage
    const uploadTask = uploadBytesResumable(storageRef, file); // Start the upload

    // Monitor the upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(process)); // Update the upload progress
      },
      (error) => {
        setFileUploadError(true); // Handle any errors during upload
      },
      () => {
        // Get the download URL once the upload is complete
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setAvatarURL(url); // Save the URL to state
        });
      }
    );
  };

  // Hook from react-hook-form to manage form state and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for the update profile process
  const updateMutation = useMutation({
    mutationFn: async (updatedFormData) => {
      dispatch(updateRequest()); // Dispatch an action to indicate the update request started
      const res = await axiosInstance.post(
        `/api/user/update/${user?.userInfo?._id}`, // Make an API call to update user profile
        updatedFormData
      );
      return res.data; // Return the response data
    },
    onSuccess: (data) => {
      console.log("Update API Response:", data);
      if (!data.success) {
        dispatch(updateFailure(data.message)); // Dispatch a failure action if update fails
      } else {
        dispatch(updateSuccess(data)); // Dispatch a success action if update is successful
      }
    },
    onError: (error) => {
      // Handle errors during the update process
      dispatch(
        updateFailure(error.response?.data?.message || "Something went wrong. Please try again")
      );
    },
  });

  // Function to handle form submission
  const onSubmit = (formData) => {
    const updatedFormData = {};

    // Iterate over the form data and compare with original user data
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      // Skip adding empty password field
      if (key === "userPassword" && value === "") {
        return;
      }

      // Add only the fields that have changed or are not empty
      updatedFormData[key] = value;
    });

    // Add the avatar URL if it's been updated and is not an empty string
    if (avatarURL && avatarURL !== user?.userInfo?.userPhoto) {
      updatedFormData.userPhoto = avatarURL;
    }

    console.log(updatedFormData);

    try {
      // Trigger the mutation to update the user profile
      updateMutation.mutate(updatedFormData);
    } catch (error) {
      dispatch(updateFailure(error.message)); // Dispatch failure action on error
    }
  };

  return (
    <main className="p-2 sm:p-10">
      <h2 className="text-xl md:text-3xl text-center md:font-light text-primary">Manage Profile</h2>
      <p className="text-center text-primary mb-5 font-sans font-light">
        Update your information, or delete your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-4 gap-4 md:gap-6">
        {/* Input field for take picture from user */}
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setFileUploadError(false);
            setFilePercent(0);
          }}
          ref={imageRef}
          hidden
          accept="image/*"
        />

        {/* Profile Image */}
        <div className="col-span-4 flex flex-col items-center justify-center">
          <figure className="w-40 h-40 border border-highlightGray rounded-full relative">
            <img
              className="w-full h-full object-cover object-center rounded-full"
              src={avatarURL || user?.userInfo?.userPhoto}
            />
            <span
              onClick={() => imageRef.current.click()}
              className="absolute bottom-2 right-2 z-10 bg-primary text-primaryBg cursor-pointer p-2 rounded-full transition-none"
            >
              <FaEdit className="transition-none" />
            </span>
          </figure>

          {/* Profile Image upload status */}
          {fileUploadError ? (
            <p className="col-span-4 text-center text-sm text-red-500">
              Image upload failed (image must be less than 2 MB)
            </p>
          ) : filePercent > 0 && filePercent < 100 ? (
            <p className="col-span-4 text-center text-sm text-primary">{`Uploading image ${filePercent}`}</p>
          ) : filePercent === 100 ? (
            <p className="col-span-4 text-center text-sm text-green-500">
              Image uploaded successfully
            </p>
          ) : (
            ""
          )}
        </div>

        {/* User Name */}
        <div className="col-span-4">
          <label
            htmlFor="userName"
            className="text-sm font-thin text-primary flex items-center gap-1"
          >
            <FiUser className="text-xl text-highlightGray/75" />
            User Name:
          </label>
          <input
            id="userName"
            type="text"
            defaultValue={user?.userInfo?.userName}
            className={`w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 border rounded ${
              errors.userName ? "border-red-500" : "border-highlightGray/25"
            } p-2`}
            {...register("userName", {
              required: "User Name is required",
              maxLength: {
                value: 24,
                message: "User Name can't be more than 24 characters long",
              },
            })}
            aria-invalid={errors.userName ? "true" : "false"}
          />
          {errors.userName && (
            <p role="alert" className="text-red-500">
              {errors.userName.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="col-span-4 md:col-span-2">
          <label
            htmlFor="password"
            className="text-sm font-thin text-primary flex items-center gap-1"
          >
            <FiLock className="text-xl text-highlightGray/75" />
            Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Set a new password"
            className={`w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 border rounded ${
              errors.userPassword ? "border-red-500" : "border-highlightGray/25"
            } p-2`}
            {...register("userPassword", {
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
            <p role="alert" className="text-red-500">
              {errors.userPassword.message}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="col-span-4 md:col-span-2">
          <label
            htmlFor="userBirth"
            className="text-sm font-thin text-primary flex items-center gap-1"
          >
            <FiCalendar className="text-xl text-highlightGray/75" />
            Date of Birth:
          </label>
          <input
            id="userBirth"
            type="date"
            defaultValue={
              user?.userInfo?.userBirth
                ? new Date(user.userInfo.userBirth).toISOString().split("T")[0]
                : ""
            }
            className={`w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 border rounded ${
              errors.dob ? "border-red-500" : "border-highlightGray/25"
            } p-2`}
            {...register("userBirth", {
              validate: (value) => {
                return value <= today || "Date of birth cannot be in the future";
              },
            })}
            aria-invalid={errors.userBirth ? "true" : "false"}
          />
          {errors.userBirth && (
            <p role="alert" className="text-red-500">
              {errors.userBirth.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="col-span-4 md:col-span-2">
          <label htmlFor="phone" className="text-sm font-thin text-primary flex items-center gap-1">
            <FiPhone className="text-xl text-highlightGray/75" />
            Phone:
          </label>
          <input
            id="phone"
            type="tel"
            defaultValue={user.userInfo.userPhone || ""}
            className={`w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 border rounded ${
              errors.phone ? "border-red-500" : "border-highlightGray/25"
            } p-2`}
            {...register("userPhone", {
              pattern: {
                value: /^\+?[0-9]+$/,
                message: "Invalid phone number",
              },
            })}
            aria-invalid={errors.phone ? "true" : "false"}
          />
          {errors.phone && (
            <p role="alert" className="text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="col-span-4 md:col-span-2 row-span-2 flex flex-col">
          <label
            htmlFor="address"
            className="text-sm font-thin text-primary flex items-center gap-1"
          >
            <FiMapPin className="text-xl text-highlightGray/75" />
            Address:
          </label>
          <textarea
            id="address"
            defaultValue={user.userInfo.userAddress || ""}
            className={`h-full w-full bg-primaryBg outline-none border rounded ${
              errors.phone ? "border-red-500" : "border-highlightGray/25"
            } p-2 text-primary`}
            {...register("userAddress")}
            aria-invalid={errors.address ? "true" : "false"}
          />
          {errors.address && (
            <p role="alert" className="text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="col-span-4 md:col-span-2">
          <label
            htmlFor="gender"
            className="text-sm font-thin text-primary flex items-center gap-1"
          >
            <FiUser className="text-xl text-highlightGray/75" />
            Gender:
          </label>
          <select
            id="gender"
            defaultValue={user?.userInfo?.userGender || ""}
            className={`w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 border rounded ${
              errors.gender ? "border-red-500" : "border-highlightGray/25"
            } p-3 text-primary`}
            {...register("userGender")}
            aria-invalid={errors.gender ? "true" : "false"}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p role="alert" className="text-red-500">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Error message */}
        {error && <p className="col-span-4 break-words text-center text-red-500">{error}</p>}

        {/* Buttons */}
        <div className="col-span-4 grid grid-cols-2 gap-4 md:gap-6">
          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:cursor-not-allowed select-none flex items-center justify-center gap-2 flex-nowrap"
          >
            {loading ? (
              "Loading.."
            ) : (
              <>
                <span>
                  <GrUpdate />
                </span>
                <span> Update Account</span>
              </>
            )}
          </button>

          {/* Delete button */}
          <button
            disabled={loading}
            type="button"
            className="p-2 mt-4 bg-red-600 hover:bg-red-500 border-none rounded text-primaryWhite disabled:cursor-not-allowed select-none flex items-center justify-center gap-1 flex-nowrap"
          >
            {loading ? (
              "Loading.."
            ) : (
              <>
                <span className="text-xl">
                  <RiErrorWarningLine />
                </span>
                <span>Delete Account</span>
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
