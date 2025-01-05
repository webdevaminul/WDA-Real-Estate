import { useEffect, useState } from "react";
import Title from "./Title";
import axiosPublic from "../api/axiosPublic";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";

export default function PopularProperty() {
  const [popularProperties, setPopularProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch popular properties from API
  useEffect(() => {
    fetchPopularProperties();
  }, []);

  // Function to fetch popular properties from API
  const fetchPopularProperties = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get("api/property/popular");
      setPopularProperties(response.data.popularProperties);
    } catch (error) {
      console.error("Error fetching popular properties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sm:max-h-[calc(100vh-3.625rem)]">
      <Title
        title={"Discover Top Properties"}
        subTitle={"Browse our most sought-after properties, carefully selected for you"}
      />

      <div className="grid grid-cols-12 p-3 gap-4">
        {loading ? (
          <div className="col-span-12 min-h-[calc(100vh-18rem)] sm:min-h-[calc(100vh-14rem)] flex items-center justify-center">
            <span className="text-primary loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <>
            {popularProperties.map((singleProperty) => (
              <Link
                to={`/property/${singleProperty._id}`}
                key={singleProperty._id}
                className="group col-span-12 sm:col-span-6 lg:col-span-3 border border-highlightGray/20 hover:border-highlight !transition-colors !duration-300 rounded overflow-hidden cursor-pointer"
              >
                <figure className="overflow-hidden aspect-video relative">
                  <img
                    src={singleProperty.propertyImages[0]}
                    alt={singleProperty.propertyName}
                    className="w-full transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {singleProperty.offerPrice && singleProperty.regularPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-primaryWhite text-sm px-2 py-1 rounded">
                      {Math.round(
                        ((singleProperty.regularPrice - singleProperty.offerPrice) /
                          singleProperty.regularPrice) *
                          100
                      )}
                      % OFF
                    </div>
                  )}
                </figure>
                <div className="px-2 py-3 bg-primaryBgShade2 group-hover:bg-primaryBg !transition-colors !duration-300">
                  <div className="flex gap-2 items-center justify-between">
                    <p className="text-xl font-semibold">
                      ${" "}
                      {new Intl.NumberFormat().format(
                        singleProperty.offerPrice ?? singleProperty.regularPrice
                      )}
                      <span className="font-normal text-sm">
                        {singleProperty.propertyType === "Rent" && "/month"}
                      </span>
                    </p>
                    <p
                      className={`px-3 py-2 rounded-full ${
                        singleProperty.propertyType === "Sell"
                          ? "bg-red-400 text-primaryWhite"
                          : "bg-yellow-300 text-primaryBlack"
                      }`}
                    >
                      {singleProperty.propertyType}
                    </p>
                  </div>
                  <h2 className="text-lg font-semibold h-14 flex items-center text-left">
                    {singleProperty.propertyName}
                  </h2>
                  <p className="my-1 flex items-center gap-1 text-highlightGray">
                    <IoLocationOutline />
                    {singleProperty?.propertyAddress}
                  </p>
                  <ul className="flex justify-between text-primary mt-1 py-3 border-y border-highlightGray/20">
                    <li className="flex gap-1 items-center justify-center text-nowrap">
                      {new Intl.NumberFormat().format(singleProperty.propertyArea)}
                      <span className="text-highlightGray">sqft</span>
                    </li>
                    <li className="flex gap-1 items-center justify-center text-nowrap">
                      {singleProperty.propertyBedroom}
                      <span className="text-highlightGray">Bed</span>
                    </li>
                    <li className="flex gap-1 items-center justify-center text-nowrap">
                      {singleProperty.propertyBathroom}
                      <span className="text-highlightGray">Bath</span>
                    </li>
                  </ul>
                  <div className="flex items-center mt-3">
                    <img
                      src={singleProperty?.userReference?.userPhoto}
                      alt={`${singleProperty?.userReference?.userName}'s profile`}
                      className="w-12 h-12 object-cover object-center rounded-full border border-highlightGray/25"
                    />
                    <div className="sm:ml-2 md:ml-4">
                      <h3 className="text-lg font-semibold">
                        {singleProperty?.userReference?.userName}
                      </h3>
                      <p className="text-sm break-all">
                        {singleProperty?.userReference?.userEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
