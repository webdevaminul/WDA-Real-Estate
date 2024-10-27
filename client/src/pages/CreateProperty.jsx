import { useRef } from "react";
import Title from "../components/Title";
import { LuImagePlus } from "react-icons/lu";
import home1 from "../assets/home1.jpeg";
import home2 from "../assets/home2.jpg";
import { useForm } from "react-hook-form";

export default function CreateProperty() {
  const imageRef = useRef(null);

  // Hook from react-hook-form to manage form state and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    console.log("Create property formData", formData);
  };

  return (
    <section className="container mx-auto bg-primaryBg">
      <Title
        title={"Add Property"}
        subTitle={"The more information you will provide, the better deal you will have"}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-5 p-5">
        {/* Add Images */}
        <div className="col-span-12 grid grid-cols-12 gap-3 mt-4">
          {/* Take images input */}
          <div className="col-span-12 md:col-span-4 lg:col-span-2">
            <input type="file" ref={imageRef} accept="image/*" hidden multiple />
            <div
              onClick={() => imageRef.current.click()}
              className="transition-none border border-highlightGray/25 flex gap-2 flex-col items-center justify-center text-primary cursor-pointer px-2 py-5 w-full h-full"
            >
              <p className="flex flex-nowrap items-center justify-center gap-1">
                <span>
                  <LuImagePlus className="text-lg" />
                </span>
                <span className="text-nowrap">Add Images</span>
              </p>
              <p className="text-sm text-center text-primary/50">
                The first image will be the cover max (4)
              </p>
            </div>
          </div>

          {/* Show images previews */}
          <div className="col-span-12 md:col-span-8 lg:col-span-10 grid grid-cols-12 gap-3 w-full">
            <figure className="border border-highlightGray/25 col-span-6 lg:col-span-3 aspect-video h-full w-full">
              <img src={home1} className="object-cover object-center h-full w-full" />
            </figure>

            <figure className="border border-highlightGray/25 col-span-6 lg:col-span-3 aspect-video h-full w-full">
              <img src={home2} className="object-cover object-center h-full w-full" />
            </figure>

            <figure className="border border-highlightGray/25 col-span-6 lg:col-span-3 aspect-video h-full w-full">
              <img src={home1} className="object-cover object-center h-full w-full" />
            </figure>

            <figure className="border border-highlightGray/25 col-span-6 lg:col-span-3 aspect-video h-full w-full">
              <img src={home2} className="object-cover object-center h-full w-full" />
            </figure>
          </div>
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
        <div className="col-span-6">
          <label className="block mb-1 text-sm font-medium text-primary">Regular price*</label>
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
        <div className="col-span-6">
          <label className="block mb-1 text-sm font-medium text-primary">Offer price*</label>
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
