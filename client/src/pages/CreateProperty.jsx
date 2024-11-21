import { useEffect, useState } from "react";
import Title from "../components/Title";
import { LuImagePlus } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase.config";

export default function CreateProperty() {
  const [propertyImages, setPropertyImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const propertyType = watch("propertyType");
  const isOffer = watch("isOffer");

  const handleSelectedImage = (event) => {
    setIsTouched(true);
    const selectedFiles = Array.from(event.target.files);

    const newFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPropertyImages((prev) => prev.concat(newFiles));
  };

  const handleImageDelete = (previewURL) => {
    setIsTouched(true); // Mark as touched on interaction
    setPropertyImages((prev) => prev.filter((image) => image.preview !== previewURL));
  };

  useEffect(() => {
    if (!isTouched) return; // Skip validation until the form is touched

    if (propertyImages.length > 4) {
      setErrorMessage("You can't add more than 4 images");
    } else if (propertyImages.length < 1) {
      setErrorMessage("You must add at least one image");
    } else {
      setErrorMessage(""); // Clear the error message if no errors
    }
  }, [propertyImages, isTouched]);

  const onSubmit = async (formData) => {
    if (errorMessage) {
      console.log("Fix errors before submitting");
      return;
    }

    const files = propertyImages.map((image) => image.file);

    const finalData = {
      ...formData,
      images: files,
    };

    console.log("Submitting form with data:", finalData);

    const uploadedImageUrls = await Promise.all(
      files.map(async (file) => {
        const uploadedUrl = await uploadImageToFirebase(file);
        return uploadedUrl;
      })
    );

    console.log("Uploaded Image URLs:", uploadedImageUrls);

    const finalSubmissionData = {
      ...formData,
      images: uploadedImageUrls,
    };

    console.log("Final Submission Data:", finalSubmissionData);
  };

  const uploadImageToFirebase = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app); // Initialize Firebase storage
      const fileName = new Date().getTime() + file.name; // Generate a unique file name
      const storageRef = ref(storage, `WDAR Estate/Property/${fileName}`); // Create a reference to the file in storage
      const uploadTask = uploadBytesResumable(storageRef, file); // Start the upload

      // Monitor the upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress monitoring
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Handle errors during upload
          console.error("Image Upload failed:", error);
          reject(error);
        },
        () => {
          // Upload completed - get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  return (
    <section className="container mx-auto bg-primaryBg">
      <Title
        title={"Add Property"}
        subTitle={"The more information you will provide, the better deal you will have"}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-5 p-5">
        {/* Add Images */}
        <div className="col-span-12 grid grid-cols-12 gap-3 my-4">
          {/* Take images input */}
          <label className="col-span-12 md:col-span-4 lg:col-span-2">
            <input
              type="file"
              {...register("images", {
                onChange: (e) => {
                  handleSelectedImage(e);
                },
                required: "Please select at least one image",
              })}
              accept="image/*"
              hidden
              multiple
            />
            <div
              className={`transition-none border ${
                errors.images || errorMessage ? "border-red-500" : "border-highlightGray/25"
              }  flex gap-2 flex-col items-center justify-center text-primary cursor-pointer px-2 py-5 w-full h-full`}
            >
              <p className="flex flex-nowrap items-center justify-center gap-1">
                <span>
                  <LuImagePlus className="text-lg" />
                </span>
                <span className="text-nowrap">Add Images</span>
              </p>
              <p className="text-sm text-center text-primary/50">
                The first image will be the cover. max (4)
              </p>
            </div>
          </label>

          {/* Show images previews */}
          <div className="col-span-12 md:col-span-8 lg:col-span-10 grid grid-cols-12 gap-3 w-full">
            {propertyImages &&
              propertyImages.map((image, i) => (
                <figure
                  key={i}
                  className="relative border border-highlightGray/25 col-span-6 lg:col-span-3 aspect-video"
                >
                  <img src={image.preview} alt="Preview" className="object-cover w-full h-full" />
                  <button
                    type="button"
                    className="bg-red-500 absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center text-sm text-white"
                    onClick={() => handleImageDelete(image.preview)}
                  >
                    X
                  </button>
                </figure>
              ))}
          </div>
          {/* Error Messages */}
          {errors.images && (
            <p role="alert" className="text-red-500 text-sm col-span-12">
              {errors.images.message}
            </p>
          )}
          {isTouched && errorMessage && (
            <p className="text-red-500 text-sm col-span-12">{errorMessage}</p>
          )}
        </div>

        {/* Property name */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-medium text-sm text-primary">Property Name*</label>
          <input
            type="text"
            className={`w-full bg-transparent outline-none border ${
              errors.propertyName ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("propertyName", {
              required: "Property name can not be empty",
              maxLength: {
                value: 40,
                message: "Property Name can't be more than 40 characters long",
              },
            })}
            aria-invalid={errors.propertyName ? "true" : "false"}
          />
          {errors.propertyName && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyName.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-medium text-sm text-primary">Property Location*</label>
          <input
            type="text"
            className={`w-full bg-transparent outline-none border ${
              errors.propertyAddress ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("propertyAddress", {
              required: "Property location can not be empty",
              maxLength: {
                value: 40,
                message: "Property location can't be more than 40 characters long",
              },
            })}
            aria-invalid={errors.propertyAddress ? "true" : "false"}
          />
          {errors.propertyAddress && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyAddress.message}
            </p>
          )}
        </div>

        {/* Area */}
        <div className="col-span-6 md:col-span-3">
          <label className="block mb-1 text-sm font-medium text-primary">Area (sq ft)*</label>
          <input
            type="number"
            className={`w-full bg-transparent outline-none border ${
              errors.propertyArea ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("propertyArea", {
              required: "Area can not be empty",
            })}
            aria-invalid={errors.propertyArea ? "true" : "false"}
          />
          {errors.propertyArea && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyArea.message}
            </p>
          )}
        </div>

        {/* Floor */}
        <div className="col-span-6 md:col-span-3">
          <label className="block mb-1 text-sm font-medium text-primary">Floor*</label>
          <input
            type="number"
            className={`w-full bg-transparent outline-none border ${
              errors.propertyFloor ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("propertyFloor", {
              required: "Floor can not be empty",
            })}
            aria-invalid={errors.propertyFloor ? "true" : "false"}
          />
          {errors.propertyFloor && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyFloor.message}
            </p>
          )}
        </div>

        {/* Bedroom */}
        <div className="col-span-6 md:col-span-3">
          <label className="block mb-1 text-sm font-medium text-primary">Bedroom*</label>
          <input
            type="number"
            className={`w-full bg-transparent outline-none border ${
              errors.propertyBedroom ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("propertyBedroom", {
              required: "Bedroom can not be empty",
            })}
            aria-invalid={errors.propertyBedroom ? "true" : "false"}
          />
          {errors.propertyBedroom && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyBedroom.message}
            </p>
          )}
        </div>

        {/* Bathroom */}
        <div className="col-span-6 md:col-span-3">
          <label className="block mb-1 text-sm font-medium text-primary">Bathroom*</label>
          <input
            type="number"
            className={`w-full bg-transparent outline-none border ${
              errors.propertyBathroom ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("propertyBathroom", {
              required: "Bathroom can not be empty",
            })}
            aria-invalid={errors.propertyBathroom ? "true" : "false"}
          />
          {errors.propertyBathroom && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyBathroom.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="col-span-12">
          <label className="block mb-1 text-sm font-medium text-primary">Description*</label>
          <textarea
            rows={6}
            className={`w-full bg-transparent outline-none border ${
              errors.propertyDescription ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2 text-primary`}
            {...register("propertyDescription", {
              required: "Description can not be empty",
              maxLength: {
                value: 1000,
                message: "Description can't be more than 1000 characters long",
              },
              minLength: {
                value: 50,
                message: "Description must be at least 50 characters long",
              },
            })}
            aria-invalid={errors.propertyDescription ? "true" : "false"}
          ></textarea>
          {errors.propertyDescription && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyDescription.message}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="col-span-12">
          <label className="text-sm font-medium text-primary">Features</label>
          <div className="flex flex-wrap gap-5 text-sm font-medium text-primary mt-1">
            <label className="flex items-center text-base gap-1 transition-none duration-0 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded checked:appearance-auto"
                {...register("features.parking")}
              />
              <span>Parking</span>
            </label>
            <label className="flex items-center text-base gap-1 transition-none duration-0 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded checked:appearance-auto"
                {...register("features.masterBed")}
              />
              <span>Master Bed</span>
            </label>
            <label className="flex items-center text-base gap-1 transition-none duration-0 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded checked:appearance-auto"
                {...register("features.furnished")}
              />
              <span>Furnished</span>
            </label>
            <label className="flex items-center text-base gap-1 transition-none duration-0 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded checked:appearance-auto"
                {...register("features.swimming")}
              />
              <span>Swimming pool</span>
            </label>
          </div>
        </div>

        {/* Type */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-sm font-medium text-primary">Type*</label>
          <div className="flex gap-5 text-sm font-medium text-primary mt-1 transition-none duration-0">
            <label className="flex items-center text-base gap-1 cursor-pointer">
              <input
                type="radio"
                value="sell"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded-full checked:appearance-auto"
                {...register("propertyType", {
                  required: "Please select a property type",
                })}
              />
              <span>Sell</span>
            </label>
            <label className="flex items-center text-base gap-1 cursor-pointer">
              <input
                type="radio"
                value="rent"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded-full checked:appearance-auto"
                {...register("propertyType", {
                  required: "Please select a property type",
                })}
              />
              <span>Rent</span>
            </label>
          </div>
          {errors.propertyType && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyType.message}
            </p>
          )}
        </div>

        {/* Offer */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-sm font-medium text-primary">Any offer?*</label>
          <div className="flex gap-5 text-sm font-medium text-primary mt-1 transition-none duration-0">
            <label className="flex items-center text-base gap-1 cursor-pointer">
              <input
                type="radio"
                value="yes"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded-full checked:appearance-auto"
                {...register("isOffer", {
                  required: "Please select an offer option",
                })}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center text-base gap-1 cursor-pointer">
              <input
                type="radio"
                value="no"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded-full checked:appearance-auto"
                {...register("isOffer", {
                  required: "Please select an offer option",
                })}
              />
              <span>No</span>
            </label>
          </div>
          {errors.isOffer && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.isOffer.message}
            </p>
          )}
        </div>

        {/* Regular price */}
        <div className={`${isOffer === "yes" ? "col-span-6" : "col-span-12"}`}>
          <label className="block mb-1 text-sm font-medium text-primary">
            Regular price* {propertyType === "rent" ? <span>/ month</span> : <span></span>}
          </label>

          <input
            type="number"
            className={`w-full bg-transparent outline-none border ${
              errors.regularPrice ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("regularPrice", {
              required: "Regular price can not be empty",
            })}
            aria-invalid={errors.regularPrice ? "true" : "false"}
          />
          {errors.regularPrice && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.regularPrice.message}
            </p>
          )}
        </div>

        {/* Offer price */}
        <div className={`${isOffer === "yes" ? "col-span-6" : "hidden"}`}>
          <label className="block mb-1 text-sm font-medium text-primary">
            Offer price* {propertyType === "rent" ? <span>/ month</span> : <span></span>}
          </label>
          <input
            type="number"
            className={`w-full bg-transparent outline-none border ${
              errors.offerPrice ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("offerPrice", {
              required: "Offer price can not be empty",
            })}
            aria-invalid={errors.offerPrice ? "true" : "false"}
          />
          {errors.offerPrice && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.offerPrice.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="col-span-12 p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:bg-primaryWhite disabled:text-primaryBlack disabled:cursor-not-allowed select-none"
        >
          Submit Property
        </button>
      </form>
    </section>
  );
}
