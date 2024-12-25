import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosPublic from "../api/axiosPublic";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { IoLocationOutline, IoBedOutline, IoHomeOutline } from "react-icons/io5";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import { LuBath } from "react-icons/lu";
import { BiArea } from "react-icons/bi";
import { useSelector } from "react-redux";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("default", { day: "numeric", month: "long", year: "numeric" })
    : "No data";

const IconText = ({ icon: Icon, label, value }) => (
  <li className="flex flex-col items-center p-2">
    <p>
      <Icon className="text-3xl" />
    </p>
    <p>{value}</p>
    <h3 className="text-sm text-highlightGray">{label}</h3>
  </li>
);

const FeatureItem = ({ label, available }) => (
  <li className="flex items-center gap-1 p-2">
    {available ? (
      <IoIosCheckmarkCircle className="text-xl text-green-500" />
    ) : (
      <IoIosCloseCircle className="text-xl text-red-500" />
    )}{" "}
    {label}
  </li>
);

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const { data } = await axiosPublic.get(`/api/property/specific/${propertyId}`);
        const userRes = await axiosPublic.get(`/api/user/list/${data?.property?.userReference}`);
        setProperty(data?.property);
        setPostUser(userRes.data);
      } catch (error) {
        console.error("Error fetching property data:", error.response?.data || error.message);
        setErrorMessage("Failed to fetch property data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  const keySpecs = [
    { icon: IoBedOutline, label: "Bed", value: property?.propertyBedroom },
    { icon: LuBath, label: "Bath", value: property?.propertyBathroom },
    { icon: BiArea, label: "sq ft", value: property?.propertyArea },
    { icon: IoHomeOutline, label: "Floor", value: property?.propertyFloor },
  ];

  const features = [
    { label: "Parking", available: property?.propertyFeatures.parking },
    { label: "Master Bedroom", available: property?.propertyFeatures.masterBed },
    { label: "Furnished", available: property?.propertyFeatures.furnished },
    { label: "Swimming Pool", available: property?.propertyFeatures.swimming },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.8rem)] flex items-center justify-center">
        <span className="text-primary loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-[calc(100vh-3.8rem)] flex items-center justify-center">
        <p>{errorMessage}</p>
      </div>
    );
  }

  console.log(property.propertyType);

  return (
    <main className="mx-auto">
      {/* Header Slider */}
      <Swiper
        spaceBetween={0}
        effect="fade"
        navigation={false}
        pagination={{
          clickable: true,
        }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        className="mySwiper max-h-[calc(80vh-3.8rem)] overflow-hidden"
      >
        {property?.propertyImages?.map((propertyImage, i) => (
          <SwiperSlide key={i}>
            <img
              src={propertyImage}
              alt={`Property Image ${i + 1}`}
              className="object-center max-h-[calc(100vh-3.8rem)] w-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-3 lg:px-4 lg:py-5 grid grid-cols-12">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 lg:border-r border-highlightGray/25 lg:pr-4">
          <h2 className="text-2xl font-semibold">{property?.propertyName}</h2>
          <p className="mt-1 flex items-center gap-1">
            <IoLocationOutline />
            {property?.propertyAddress}
          </p>
          <div className="flex gap-4 items-center mt-4 md:mt-5">
            <span className="text-xl font-bold text-highlight">
              ${property.offerPrice ?? property.regularPrice}
              {property.propertyType === "Rent" && "/month"}
            </span>
            {property.isOffer === "yes" && (
              <span className="text-primary line-through">
                ${property.regularPrice}
                {property.propertyType === "Rent" && "/month"}
              </span>
            )}
          </div>

          {/* CTA */}
          <button
            disabled={user?.userInfo?._id === property?.userReference}
            className="mt-4 md:mt-5 text-sm px-6 py-2 bg-highlight hover:bg-highlightHover border-none rounded text-primaryWhite disabled:bg-primaryWhite disabled:text-primaryBlack disabled:cursor-not-allowed select-none"
          >
            Contact Agent
          </button>

          <div className="col-span-12 mt-4 md:mt-5 lg:mt-0 lg:pl-4 lg:hidden">
            {/* User Profile Section */}
            <div className="flex items-center mb-1">
              <img
                src={postUser?.user?.userPhoto}
                alt={`${postUser?.user?.userName}'s profile`}
                className="w-14 h-14 object-cover object-center rounded-full border border-highlightGray/25"
              />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{postUser?.user?.userName}</h3>
                <p className="text-sm">{postUser?.user?.userEmail}</p>
              </div>
            </div>

            {/* Property Details Table */}
            <table className="table-auto w-full">
              <tbody className="divide-y divide-highlightGray/25 border border-highlightGray/25 text-primary">
                <tr>
                  <td className="p-2">Category</td>
                  <td className="p-2">{property.propertyCategory}</td>
                </tr>
                <tr>
                  <td className="p-2">Type</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-2 rounded-full ${
                        property.propertyType === "Sell"
                          ? "bg-red-500 text-primaryWhite"
                          : "bg-yellow-500 text-primaryBlack"
                      }`}
                    >
                      {property.propertyType}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Basement</td>
                  <td className="p-2">{property.propertyBasement}</td>
                </tr>
                <tr>
                  <td className="p-2">Created</td>
                  <td className="p-2">{formatDate(property.createdAt)}</td>
                </tr>
                <tr>
                  <td className="p-2">Updated</td>
                  <td className="p-2">{formatDate(property.updatedAt)}</td>
                </tr>
              </tbody>
            </table>

            {/* Key Specs */}
            <div className="mt-4 md:mt-5">
              <h2 className="text-lg font-semibold border-b border-highlightGray/25 pb-1">
                Key Specs
              </h2>
              <ul className="grid grid-cols-4 gap-6 text-primary mt-1 max-w-lg">
                {keySpecs.map((spec, index) => (
                  <IconText key={index} {...spec} />
                ))}
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="mt-4 md:mt-5">
            <h2 className="text-lg font-semibold border-b border-highlightGray/25 pb-1">
              Features
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-primary mt-1">
              {features.map((feature, index) => (
                <FeatureItem key={index} {...feature} />
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="mt-4 md:mt-5">
            <h2 className="text-lg font-semibold border-b border-highlightGray/25 pb-1">
              Description
            </h2>
            <p className="whitespace-pre-wrap break-words max-w-full mt-1">
              {property.propertyDescription}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 mt-6 lg:mt-0 lg:pl-4 hidden lg:block">
          {/* User Profile Section */}
          <div className="flex items-center mb-2">
            <img
              src={postUser?.user?.userPhoto}
              alt={`${postUser?.user?.userName}'s profile`}
              className="w-14 h-14 object-cover object-center rounded-full border border-highlightGray/25"
            />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{postUser?.user?.userName}</h3>
              <p className="text-sm">{postUser?.user?.userEmail}</p>
            </div>
          </div>

          {/* Property Details Table */}
          <table className="table-auto w-full">
            <tbody className="divide-y divide-highlightGray/25 border border-highlightGray/25 text-primary">
              <tr>
                <td className="p-2">Category</td>
                <td className="p-2">{property.propertyCategory}</td>
              </tr>
              <tr>
                <td className="p-2">Type</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-2 rounded-full ${
                      property.propertyType === "Sell"
                        ? "bg-red-500 text-primaryWhite"
                        : "bg-yellow-500 text-primaryBlack"
                    }`}
                  >
                    {property.propertyType}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-2">Basement</td>
                <td className="p-2">{property.propertyBasement}</td>
              </tr>
              <tr>
                <td className="p-2">Created</td>
                <td className="p-2">{formatDate(property.createdAt)}</td>
              </tr>
              <tr>
                <td className="p-2">Updated</td>
                <td className="p-2">{formatDate(property.updatedAt)}</td>
              </tr>
            </tbody>
          </table>

          {/* Key Specs */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold border-b border-highlightGray/25 pb-1">
              Key Specs
            </h2>
            <ul className="grid grid-cols-4 gap-6 text-primary mt-1">
              {keySpecs.map((spec, index) => (
                <IconText key={index} {...spec} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
