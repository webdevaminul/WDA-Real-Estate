import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { BiMaleFemale } from "react-icons/bi";
import { MdCheckCircle, MdError } from "react-icons/md";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase.config";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import { profileUpdateSuccess, requestFailure, requestStart, resetError } from "../redux/authSlice";
import Title from "../components/Title";

export default function UpdateProfile() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const imageRef = useRef(null);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [avatarURL, setAvatarURL] = useState("");
  const [fileUploadError, setFileUploadError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const today = new Date().toISOString().split("T")[0]; // Set today's date for validation purposes

  // Function to handle the file upload process
  useEffect(() => {
    if (file) {
      const storage = getStorage(app); // Initialize Firebase storage
      const fileName = new Date().getTime() + file.name; // Generate a unique file name
      const storageRef = ref(storage, `WDAR Estate/Profile/${fileName}`); // Create a reference to the file in storage
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
    }
  }, [file]);

  // Hook from react-hook-form to manage form state and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for the update profile process
  const updateMutation = useMutation({
    mutationFn: async (updatedFormData) => {
      dispatch(requestStart()); // Dispatch request start action before making API call
      const res = await axiosSecure.post(
        `/api/user/update/${user?.userInfo?._id}`, // Make API call to update user profile
        updatedFormData
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Update API Response:", data);
      if (!data.success) {
        dispatch(requestFailure(data.message)); // Dispatch a failure action if update fails
      } else {
        dispatch(profileUpdateSuccess(data)); // Dispatch update success action if profile update is successful
        setSuccessMessage("Profile updated successfully"); // Display success message
      }
    },
    onError: (error) => {
      // Handle errors during the update process
      dispatch(
        requestFailure(error.response?.data?.message || "Something went wrong. Please try again")
      );
    },
  });

  // Function to handle form submission
  const onSubmit = (formData) => {
    // Add the avatar URL if it's been updated and is not an empty string
    if (avatarURL && avatarURL !== user?.userInfo?.userPhoto) {
      formData.userPhoto = avatarURL;
    }
    console.log("formData", formData);
    // Trigger the mutation to update the user profile
    updateMutation.mutate(formData);
  };

  return (
    <main className="min-h-[90vh] max-w-sm mx-auto flex items-center justify-center">
      <section className="flex flex-col gap-4 justify-center p-4 w-full">
        <Title
          title={"Update Profile"}
          subTitle={"Add your information to help other users to know who you are."}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Input field for take picture from user */}
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setFileUploadError(false);
              setFilePercent(0);
              dispatch(resetError());
              setSuccessMessage("");
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
                loading="lazy"
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
              <p className="col-span-4 text-center text-sm text-primary">{`Uploading image ${filePercent} %`}</p>
            ) : filePercent === 100 ? (
              <p className="col-span-4 text-center text-sm text-green-500">
                Image uploaded successfully
              </p>
            ) : (
              ""
            )}
          </div>

          {/* User Name */}
          <div
            className={`flex items-center border rounded ${
              errors.userName ? "border-red-500" : "border-highlightGray/25"
            } mt-8 `}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <FiUser />
            </span>
            <input
              type="text"
              defaultValue={user?.userInfo?.userName}
              placeholder="User name*"
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 p-2 w-full`}
              {...register("userName", {
                required: "User name can not be empty",
                maxLength: {
                  value: 24,
                  message: "User Name can't be more than 24 characters long",
                },
                onChange: () => {
                  dispatch(resetError());
                  setSuccessMessage("");
                },
              })}
              aria-invalid={errors.userEmail ? "true" : "false"}
            />
          </div>
          {errors.userName && (
            <p role="alert" className="text-red-500">
              {errors.userName.message}
            </p>
          )}

          {/* Phone */}
          <div
            className={`flex items-center border rounded ${
              errors.userPhone ? "border-red-500" : "border-highlightGray/25"
            } mt-4 `}
          >
            <span className="p-2 text-xl text-highlightGray/75">
              <FiPhone />
            </span>
            <input
              type="tel"
              defaultValue={user?.userInfo?.userPhone || ""}
              placeholder="Add your phone number"
              className={`bg-transparent outline-none placeholder:text-highlightGray/75 p-2 w-full`}
              {...register("userPhone", {
                pattern: {
                  value: /^\+?[0-9]+$/,
                  message: "Invalid phone number",
                },
                onChange: () => {
                  dispatch(resetError());
                  setSuccessMessage("");
                },
              })}
              aria-invalid={errors.userPhone ? "true" : "false"}
            />
          </div>
          {errors.userPhone && (
            <p role="alert" className="text-red-500">
              {errors.userPhone.message}
            </p>
          )}

          {/* Gender */}
          <div className="flex items-center border rounded border-highlightGray/25 mt-4">
            <span className="p-[0.65rem] text-xl text-highlightGray/75">
              <BiMaleFemale />
            </span>
            <select
              defaultValue={user?.userInfo?.userGender || ""}
              className="w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 text-primary"
              {...register("userGender", {
                onChange: () => {
                  dispatch(resetError());
                  setSuccessMessage("");
                },
              })}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div
            className={`flex items-center border rounded ${
              errors.userBirth ? "border-red-500" : "border-highlightGray/25"
            } mt-4`}
          >
            <span className="p-[0.65rem] text-xl text-highlightGray/75">
              <FiCalendar />
            </span>
            <input
              type="date"
              placeholder="Add your date of birth"
              defaultValue={
                user?.userInfo?.userBirth
                  ? new Date(user.userInfo.userBirth).toISOString().split("T")[0]
                  : ""
              }
              className="w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 text-primary"
              {...register("userBirth", {
                validate: (value) => {
                  return value <= today || "Date of birth cannot be in the future";
                },
                onChange: () => {
                  dispatch(resetError());
                  setSuccessMessage("");
                },
              })}
              aria-invalid={errors.userBirth ? "true" : "false"}
            />
          </div>
          {errors.userBirth && (
            <p role="alert" className="text-red-500">
              {errors.userBirth.message}
            </p>
          )}

          {/* Address */}
          <div className="flex items-start border rounded border-highlightGray/25 mt-4">
            <span className="p-[0.65rem] text-xl text-highlightGray/75">
              <FiMapPin />
            </span>
            <textarea
              placeholder="Add your address"
              defaultValue={user?.userInfo?.userAddress || ""}
              className="w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 text-primary pt-2"
              {...register("userAddress", {
                onChange: () => {
                  dispatch(resetError());
                  setSuccessMessage("");
                },
              })}
            />
          </div>

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

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:bg-primaryWhite disabled:text-primaryBlack disabled:cursor-not-allowed select-none"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </form>
      </section>
    </main>
  );
}
