import { useEffect, useState } from "react";
import Title from "../components/Title";
import { LuImagePlus } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase.config";
import imageCompression from "browser-image-compression";
import { useMutation } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateProperty() {
  const [propertyImages, setPropertyImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const onSubmit = async (formData) => {
    setLoading(true);

    if (errorMessage) {
      console.log("Fix errors before submitting");
      setLoading(false);
      return;
    }

    const uploadedImageUrls = await Promise.all(
      propertyImages.map(async (image) => {
        const uploadedUrl = await uploadImageToFirebase(image.file);
        return uploadedUrl;
      })
    );

    const formWithImageFiles = {
      ...formData,
      propertyImages: uploadedImageUrls,
    };
    const { images, ...formWithoutImageFiles } = formWithImageFiles;

    const finalSubmissionData = {
      ...formWithoutImageFiles,
      propertyArea: Number(formWithoutImageFiles.propertyArea),
      propertyFloor: Number(formWithoutImageFiles.propertyFloor),
      propertyBedroom: Number(formWithoutImageFiles.propertyBedroom),
      propertyBathroom: Number(formWithoutImageFiles.propertyBathroom),
      regularPrice: Number(formWithoutImageFiles.regularPrice),
      offerPrice: formWithoutImageFiles.offerPrice
        ? Number(formWithoutImageFiles.offerPrice)
        : null,
    };

    createPropertyMutation.mutate(finalSubmissionData);

    setLoading(false);
  };

  const uploadImageToFirebase = async (file) => {
    const compressedImage = await compressImage(file);
    return new Promise((resolve, reject) => {
      const storage = getStorage(app); // Initialize Firebase storage
      const fileName = new Date().getTime() + compressedImage.name; // Generate a unique file name
      const storageRef = ref(storage, `WDAR Estate/Property/${fileName}`); // Create a reference to the file in storage
      const uploadTask = uploadBytesResumable(storageRef, compressedImage); // Start the upload

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

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 2, // Limit the file size to 2MB
      maxWidthOrHeight: 1920, // Limit the image size to 1000px on either dimension
      useWebWorker: true, // Use a web worker to compress the image
    };
    try {
      const compressedFile = await imageCompression(file, options);
      console.log("Compressed file size:", compressedFile.size / 1024, "KB");
      return compressedFile;
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  // Define the mutation for the creating property post
  const createPropertyMutation = useMutation({
    mutationFn: async (finalSubmissionData) => {
      const res = await axiosSecure.post(
        `/api/property/create`, // Make API call to create a new property
        finalSubmissionData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Error creating property");
      } else {
        toast.success("Property created successfully");
        navigate("/manage-posts/post-list");
      }
    },
    onError: () => {
      toast.error("Error creating property");
    },
  });

  useEffect(() => {
    if (!isTouched) return; // Skip validation until the form is touched

    if (propertyImages.length > 4) {
      setErrorMessage("You can't add more than 4 images");
    } else if (propertyImages.length < 1) {
      setErrorMessage("You must add at least 1 image");
    } else {
      setErrorMessage(""); // Clear the error message if no errors
    }
  }, [propertyImages, isTouched]);

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
                required: "You must add at least 1 image",
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
                  <img src={image.preview} className="object-cover w-full h-full" />
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
              required: "Property name cannot be empty",
              maxLength: {
                value: 30,
                message: "Property Name can't be more than 30 characters long",
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
              required: "Property location cannot be empty",
              maxLength: {
                value: 30,
                message: "Property location can't be more than 30 characters long",
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

        {/* Category */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-medium text-sm text-primary">Property Category*</label>
          <select
            className={`w-full text-primary bg-transparent outline-none border ${
              errors.propertyCategory ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-[9.5px]`}
            {...register("propertyCategory", {
              required: "Please select a property category",
            })}
            aria-invalid={errors.propertyCategory ? "true" : "false"}
          >
            <option className="bg-primaryBg text-primary" value=""></option>
            <option className="bg-primaryBg text-primary" value="Apartment">
              Apartment
            </option>
            <option className="bg-primaryBg text-primary" value="Condo">
              Condo
            </option>
            <option className="bg-primaryBg text-primary" value="Villa">
              Villa
            </option>
            <option className="bg-primaryBg text-primary" value="Duplex">
              Duplex
            </option>
            <option className="bg-primaryBg text-primary" value="Townhouse">
              Townhouse
            </option>
          </select>
          {errors.propertyCategory && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyCategory.message}
            </p>
          )}
        </div>

        {/* Basement */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-medium text-sm text-primary">Property Basement*</label>
          <select
            className={`w-full text-primary bg-transparent outline-none border ${
              errors.propertyBasement ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-[9.5px]`}
            {...register("propertyBasement", {
              required: "Please select a property basement",
            })}
            aria-invalid={errors.propertyBasement ? "true" : "false"}
          >
            <option className="bg-primaryBg text-primary" value=""></option>
            <option className="bg-primaryBg text-primary" value="Concrete">
              Concrete
            </option>
            <option className="bg-primaryBg text-primary" value="Wood">
              Wood
            </option>
            <option className="bg-primaryBg text-primary" value="Stone">
              Stone
            </option>
            <option className="bg-primaryBg text-primary" value="Earthen">
              Earthen
            </option>
            <option className="bg-primaryBg text-primary" value="Hybrid">
              Hybrid
            </option>
          </select>
          {errors.propertyBasement && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.propertyBasement.message}
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
              validate: (value) => {
                if (!value) {
                  return "Area cannot be empty";
                } else if (value < 1) {
                  return "Area must be greater than 0";
                }
                return true;
              },
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
              validate: (value) => {
                if (!value) {
                  return "Floor cannot be empty";
                } else if (value < 1) {
                  return "Floor must be greater than 0";
                }
                return true;
              },
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
              validate: (value) => {
                if (!value) {
                  return "Bedroom cannot be empty";
                } else if (value < 1) {
                  return "Bedroom must be greater than 0";
                }
                return true;
              },
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
              validate: (value) => {
                if (!value) {
                  return "Bathroom cannot be empty";
                } else if (value < 1) {
                  return "Bathroom must be greater than 0";
                }
                return true;
              },
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
                value: 2500,
                message: "Description can't be more than 2500 characters long",
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
                {...register("propertyFeatures.parking")}
              />
              <span>Parking</span>
            </label>
            <label className="flex items-center text-base gap-1 transition-none duration-0 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded checked:appearance-auto"
                {...register("propertyFeatures.masterBed")}
              />
              <span>Master Bed</span>
            </label>
            <label className="flex items-center text-base gap-1 transition-none duration-0 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded checked:appearance-auto"
                {...register("propertyFeatures.furnished")}
              />
              <span>Furnished</span>
            </label>
            <label className="flex items-center text-base gap-1 transition-none duration-0 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded checked:appearance-auto"
                {...register("propertyFeatures.swimming")}
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
                value="Sell"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded-full checked:appearance-auto"
                {...register("propertyType", {
                  required: "Please select your property type",
                })}
              />
              <span>Sell</span>
            </label>
            <label className="flex items-center text-base gap-1 cursor-pointer">
              <input
                type="radio"
                value="Rent"
                className="w-5 h-5 cursor-pointer accent-primary appearance-none border border-highlightGray/50 rounded-full checked:appearance-auto"
                {...register("propertyType", {
                  required: "Please select your property type",
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
          <label className="text-sm font-medium text-primary">Offer*</label>
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
            Regular price in USD* {propertyType === "Rent" ? <span>/ month</span> : <span></span>}
          </label>

          <input
            type="number"
            className={`w-full bg-transparent outline-none border ${
              errors.regularPrice ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("regularPrice", {
              validate: (value) => {
                const numericValue = Number(value);
                if (!numericValue) {
                  return "Regular price cannot be empty";
                } else if (numericValue < 0) {
                  return "Regular price must be greater than 0";
                }
                return true;
              },
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
            Offer price in USD* {propertyType === "Rent" ? <span>/ month</span> : <span></span>}
          </label>
          <input
            type="number"
            className={`w-full bg-transparent outline-none border ${
              errors.offerPrice ? "border-red-500" : "border-highlightGray/25"
            } rounded px-3 py-2`}
            {...register("offerPrice", {
              validate: (value) => {
                const offerValue = Number(value);
                const regularValue = Number(watch("regularPrice"));
                if (isOffer === "yes" && !offerValue) {
                  return `Offer price is required when "Offer = Yes"`;
                }
                if (isOffer === "yes" && offerValue >= regularValue) {
                  return "Offer price must be less than the regular price";
                }
                return true;
              },
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
          disabled={loading}
          className="col-span-12 p-2 mt-4 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:bg-primaryWhite disabled:text-primaryBlack disabled:cursor-not-allowed select-none"
        >
          {loading ? "Loading..." : "Create Property"}
        </button>
      </form>
    </section>
  );
}
