import { useEffect, useState } from "react";
import Title from "../components/Title";
import { LuImagePlus } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase.config";
import imageCompression from "browser-image-compression";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosPublic from "../api/axiosPublic";
import axiosSecure from "../api/axiosSecure";
import axios from "axios";
import { Helmet } from "react-helmet-async";

export default function UpdateProperty() {
  const { propertyId } = useParams();
  const [fetchedImages, setFetchedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const propertyType = watch("propertyType");
  const isOffer = watch("isOffer");

  useEffect(() => {
    // Fetch property data manually
    const fetchPropertyData = async () => {
      try {
        const res = await axiosPublic.get(`/api/property/specific/${propertyId}`);
        const { propertyType, isOffer, regularPrice, offerPrice, propertyImages, ...rest } =
          res.data.property;

        setFetchedImages(propertyImages);

        // Set form values
        Object.entries({ propertyType, isOffer, regularPrice, offerPrice, ...rest }).forEach(
          ([key, value]) => setValue(key, value)
        );
      } catch (error) {
        console.error("Error fetching property data:", error.response?.data || error.message);
        setErrorMessage("Failed to fetch property data. Please try again.");
      }
    };

    fetchPropertyData();
  }, [propertyId, setValue]);

  const handleSelectedImage = (event) => {
    setIsTouched(true);
    const selectedFiles = Array.from(event.target.files);

    const newFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => prev.concat(newFiles));
  };

  const handleImageDelete = (image, isFetched) => {
    setIsTouched(true);
    if (isFetched) {
      setFetchedImages((prev) => prev.filter((img) => img !== image));
      setRemovedImages((prev) => prev.concat(image));
    } else {
      setNewImages((prev) => prev.filter((img) => img.preview !== image.preview));
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 2, // Limit the file size to 2MB
      maxWidthOrHeight: 1920, // Limit the image size to 1000px on either dimension
      useWebWorker: true, // Use a web worker to compress the image
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const compressedImage = await compressImage(file);

    const formData = new FormData();
    formData.append("file", compressedImage);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "WDA-Real-Estate/Properties"); // Organize by folder

    try {
      const response = await axios.post(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL);
      return response.data.secure_url; // Return the URL of the uploaded image
    } catch (error) {
      console.error("Image Upload to Cloudinary failed:", error);
      throw error;
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);

    if (errorMessage) {
      // console.log("Fix errors before submitting");
      setLoading(false);
      return;
    }

    try {
      // Upload new images to Firebase
      const newImageUrls = await Promise.all(
        newImages.map(async (image) => {
          const uploadedUrl = await uploadImageToCloudinary(image.file);
          return uploadedUrl;
        })
      );

      const formWithImageFiles = {
        ...formData,
        propertyImages: [...fetchedImages, ...newImageUrls],
        offerPrice: formData.isOffer === "yes" ? Number(formData.offerPrice) : null,
      };

      const { images, ...formWithOutImageFiles } = formWithImageFiles;

      // console.log("updatedData", formWithOutImageFiles);

      // // Update the property using your API
      updatePropertyMutation.mutate(formWithOutImageFiles);
    } catch (error) {
      console.error("Error updating property:", error.response?.data || error.message);
      setErrorMessage("Failed to update property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Define the mutation for the update property post
  const updatePropertyMutation = useMutation({
    mutationFn: async (formWithOutImageFiles) => {
      const res = await axiosSecure.patch(
        `/api/property/update/${propertyId}`,
        formWithOutImageFiles
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Property updated successfully");
        navigate("/manage-posts/post-list");
      } else {
        toast.error("Error updating property");
      }
    },
    onError: () => {
      toast.error("Error updating property");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (!isTouched) return; // Skip validation until the form is touched

    const totalImages = [...fetchedImages, ...newImages];

    if (totalImages.length > 4) {
      setErrorMessage("You can't add more than 4 images");
    } else if (totalImages.length < 1) {
      setErrorMessage("You must add at least 1 image");
    } else {
      setErrorMessage(""); // Clear the error message if no errors
    }
  }, [fetchedImages, newImages, isTouched]);

  return (
    <section className="container mx-auto bg-primaryBg pt-4 pb-3 sm:pt-8">
      <Helmet>
        <title>Property Update | WDA Real Estate</title>
      </Helmet>
      <Title title={"Update Property"} subTitle={"Update your property details for better deals"} />

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
            {[...fetchedImages, ...newImages].map((image, i) => (
              <figure
                key={i}
                className="relative border border-highlightGray/25 col-span-6 lg:col-span-3 aspect-video"
              >
                <img
                  src={typeof image === "string" ? image : image.preview}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  className="bg-red-500 absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center text-sm text-white"
                  onClick={() => handleImageDelete(image, typeof image === "string")}
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
                value: 50,
                message: "Property Name can't be more than 50 characters long",
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
                value: 60,
                message: "Property location can't be more than 60 characters long",
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
              maxLength: {
                value: 5,
                message: "Area can't be more than 5 digits long",
              },
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
                } else if (value > 1000) {
                  return "Floor must be less than 1,000";
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
                } else if (value > 1000) {
                  return "Bedroom must be less than 1,000";
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
                } else if (value > 1000) {
                  return "Bathroom must be less than 1,000";
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
                message: "Description can't be more than 2,500 characters long",
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
            Regular price* {propertyType === "Rent" ? <span>/ month</span> : <span></span>}
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
                } else if (numericValue > 999999999999) {
                  return "Regular price must be less than 999,999,999,999";
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
            Offer price* {propertyType === "Rent" ? <span>/ month</span> : <span></span>}
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
                  return `Offer price is required when "Any offer = yes"`;
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
          {loading ? "Loading..." : "Update Property"}
        </button>
      </form>
    </section>
  );
}
