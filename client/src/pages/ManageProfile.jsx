import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiLock, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import { GrUpdate } from "react-icons/gr";
import { RiErrorWarningLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase.config";

export default function ManageProfile() {
  const { user } = useSelector((state) => state.auth);
  const imageRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [avatarURL, setAvatarURL] = useState("");
  const [fileUploadError, setFileUploadError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(process));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setAvatarURL(url);
        });
      }
    );
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    const updatedFormData = { ...formData, userPhoto: avatarURL };
    console.log(updatedFormData);
  };

  return (
    <main className="p-2 sm:p-10">
      <h2 className="text-xl md:text-3xl text-center md:font-light text-primary">Manage Profile</h2>
      <p className="text-center text-primary mb-5 font-sans font-light">
        Update your information, or delete your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-4 gap-4 md:gap-6">
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
          <figure
            onClick={() => imageRef.current.click()}
            className="w-40 h-40 border border-highlightGray rounded-full overflow-clip cursor-pointer"
          >
            <img
              className="w-full h-full object-cover"
              src={avatarURL || user?.userInfo?.userPhoto}
            />
          </figure>

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
              required: "User name is required",
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
            type="text"
            className={`w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 border rounded ${
              errors.password ? "border-red-500" : "border-highlightGray/25"
            } p-2`}
            {...register("password", {
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
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p role="alert" className="text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="col-span-4 md:col-span-2">
          <label htmlFor="dob" className="text-sm font-thin text-primary flex items-center gap-1">
            <FiCalendar className="text-xl text-highlightGray/75" />
            Date of Birth:
          </label>
          <input
            id="dob"
            type="date"
            className={`w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 border rounded ${
              errors.dob ? "border-red-500" : "border-highlightGray/25"
            } p-2`}
            {...register("dob", {
              validate: (value) => {
                return value <= today || "Date of birth cannot be in the future";
              },
            })}
            aria-invalid={errors.dob ? "true" : "false"}
          />
          {errors.dob && (
            <p role="alert" className="text-red-500">
              {errors.dob.message}
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
            className={`w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 border rounded ${
              errors.phone ? "border-red-500" : "border-highlightGray/25"
            } p-2`}
            {...register("phone", {
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
            className={`h-full w-full bg-primaryBg outline-none border rounded ${
              errors.phone ? "border-red-500" : "border-highlightGray/25"
            } p-2 text-primary`}
            {...register("address")}
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
            defaultValue=""
            className={`w-full bg-primaryBg outline-none placeholder:text-highlightGray/75 border rounded ${
              errors.gender ? "border-red-500" : "border-highlightGray/25"
            } p-3 text-primary`}
            {...register("gender")}
            aria-invalid={errors.gender ? "true" : "false"}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p role="alert" className="text-red-500">
              {errors.gender.message}
            </p>
          )}
        </div>

        <div className="col-span-4 grid grid-cols-2 gap-4 md:gap-6">
          {/* Submit Button */}
          <button
            type="submit"
            className="p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:bg-slate-200 disabled:cursor-not-allowed select-none flex items-center justify-center gap-2 flex-nowrap"
          >
            <GrUpdate />
            Update Account
          </button>

          {/* Delete button */}
          <button className="p-2 mt-4 bg-red-600 hover:bg-red-500 border-none rounded text-primaryWhite disabled:bg-slate-200 disabled:cursor-not-allowed select-none flex items-center justify-center gap-1 flex-nowrap">
            <span className="text-xl">
              <RiErrorWarningLine />
            </span>
            <span>Delete Account</span>
          </button>
        </div>
      </form>
    </main>
  );
}
