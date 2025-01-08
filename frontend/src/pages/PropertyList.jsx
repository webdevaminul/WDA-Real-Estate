import { Link } from "react-router-dom";
import Title from "../components/Title";
import { PiCaretUpDown } from "react-icons/pi";
import { RiEyeLine, RiEditBoxLine, RiDeleteBin6Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState({ field: "createdAt", order: "desc" });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axiosSecure.get(
          `/api/property/list/${user?.userInfo?._id}?sortField=${sort.field}&sortOrder=${sort.order}`
        );
        // console.log("API response for property", res.data);
        setProperties(res.data);
      } catch (err) {
        setError(err.res?.data?.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [sort, user?.userInfo?._id]);

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = async (propertyId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      iconColor: "rgb(255, 95, 31)",
      customClass: {
        icon: "custom-swal-icon",
        popup: "custom-swal-popup",
      },
      showCancelButton: true,
      confirmButtonColor: "rgb(255, 95, 31)",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes",
      width: "22rem",
      padding: "1rem",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Send a DELETE request to the backend
          const res = await axiosSecure.delete(`/api/property/delete/${propertyId}`);

          if (res.data.success) {
            setProperties((prevProperties) =>
              prevProperties.filter((property) => property._id !== propertyId)
            );

            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              iconColor: "#22c55e",
              customClass: {
                icon: "custom-swal-icon",
                popup: "custom-swal-popup",
              },
              width: "22rem",
              padding: "1rem",
              confirmButtonColor: "rgb(255, 95, 31)",
            });
          }
        } catch (err) {
          console.error("Error deleting property:", err);
          Swal.fire({
            title: "Failed!",
            text: `${err.response?.data?.message}. Failed to delete property.`,
            icon: "error",
            iconColor: "#ef4444",
            customClass: {
              icon: "custom-swal-icon",
              popup: "custom-swal-popup",
            },
            width: "22rem",
            padding: "1rem",
            confirmButtonColor: "rgb(255, 95, 31)",
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.8rem)] flex items-center justify-center">
        <span className="text-primary loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-3.8rem)] flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5.5rem)] sm:min-h-[calc(100vh-3.625rem)] flex sm:items-center justify-center">
        <p className="p-4 text-center mt-10 sm:mt-0">
          No properties found. Add new properties in the "Create Property" page.
        </p>
      </div>
    );
  }

  return (
    <main className="py-4 sm:py-8 md:py-10">
      <Title
        title={"Your properties"}
        subTitle={"Manage your properties here. View, update, or delete any of your listings."}
      />

      <div className="overflow-x-auto px-6 py-6">
        <table className="min-w-full table-auto text-sm text-left text-primary border border-highlightGray/25">
          {/* Table Head */}
          <thead className="bg-primary/5">
            <tr className="border border-highlightGray/25">
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Property</span>
                  <span
                    className="rounded-full text-lg cursor-pointer p-1"
                    onClick={() => handleSort("propertyName")}
                  >
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Location</span>
                  <span
                    className="rounded-full text-lg cursor-pointer p-1"
                    onClick={() => handleSort("propertyAddress")}
                  >
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Area</span>
                  <span
                    className="rounded-full text-lg cursor-pointer p-1"
                    onClick={() => handleSort("propertyArea")}
                  >
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Price</span>
                  <span
                    className="rounded-full text-lg cursor-pointer p-1"
                    onClick={() => handleSort("regularPrice")}
                  >
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Type</span>
                  <span
                    className="rounded-full text-lg cursor-pointer p-1"
                    onClick={() => handleSort("propertyType")}
                  >
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Bed</span>
                  <span
                    className="rounded-full text-lg cursor-pointer p-1"
                    onClick={() => handleSort("propertyBedroom")}
                  >
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Bath</span>
                  <span
                    className="rounded-full text-lg cursor-pointer p-1"
                    onClick={() => handleSort("propertyBathroom")}
                  >
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 font-medium text-base">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-primaryBg divide-y divide-highlightGray/25">
            {properties.map((property) => (
              <tr key={property._id} className="hover:bg-primaryBgShade1/50">
                <td className="p-3">
                  <div className="flex items-center gap-3 transition-none">
                    <figure className="min-w-12 max-w-12 aspect-square rounded-lg overflow-hidden">
                      <img
                        src={property?.propertyImages[0] || "https://via.placeholder.com/150"}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    </figure>
                    <span className="font-semibold">{property?.propertyName}</span>
                  </div>
                </td>
                <td className="p-3">{property?.propertyAddress || "N/A"}</td>
                <td className="p-3">
                  {new Intl.NumberFormat().format(property?.propertyArea) || "N/A"} sqft
                </td>
                <td className="p-3">
                  $ {new Intl.NumberFormat().format(property?.regularPrice) || "N/A"}
                </td>
                <td className="p-3">{property?.propertyType || "N/A"}</td>
                <td className="p-3">{property?.propertyBedroom || "N/A"}</td>
                <td className="p-3">{property?.propertyBathroom || "N/A"}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2 text-lg">
                    <Link
                      className="text-blue-500 hover:bg-blue-500 hover:text-primaryWhite !transition-all !duration-200 ease-linear border border-highlightGray/25 p-1 rounded-md"
                      to={`/manage-posts/property/${property._id}`}
                    >
                      <RiEyeLine />
                    </Link>
                    <Link
                      className="text-yellow-500 hover:bg-yellow-500 hover:text-primaryWhite !transition-all !duration-200 ease-linear border border-highlightGray/25 p-1 rounded-md"
                      to={`/manage-posts/update-post/${property._id}`}
                    >
                      <RiEditBoxLine />
                    </Link>
                    <button
                      className="text-red-500 hover:bg-red-500 hover:text-primaryWhite !transition-all !duration-200 ease-linear border border-highlightGray/25 p-1 rounded-md"
                      onClick={() => handleDelete(property._id)}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
