import { Link } from "react-router-dom";
import Title from "../components/Title";
import { PiCaretUpDown } from "react-icons/pi";
import { RiEyeLine, RiEditBoxLine, RiDeleteBin6Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState({ field: "createdAt", order: "desc" });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axiosInstance.get(
          `api/property/list/${user?.userInfo?._id}?sortField=${sort.field}&sortOrder=${sort.order}`
        );
        console.log("API response for property", res.data);
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

  console.log("properties", properties);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main>
      <Title
        title={"Your properties"}
        subTitle={"Manage your properties here. View, update, or delete any of your listings."}
      />

      <div className="overflow-x-auto px-6 py-6">
        <table className="min-w-full h-screen table-auto text-sm text-left text-primary border border-highlightGray/25">
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
                <td className="p-3">{property?.propertyArea || "N/A"} sqft</td>
                <td className="p-3">${property?.regularPrice || "N/A"}</td>
                <td className="p-3">{property?.propertyType || "N/A"}</td>
                <td className="p-3">{property?.propertyBedroom || "N/A"}</td>
                <td className="p-3">{property?.propertyBathroom || "N/A"}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2 text-lg">
                    <Link
                      className="text-blue-500 border border-highlightGray/25 p-1 rounded-md tooltip"
                      data-tip="View"
                      to={`/property/${property._id}`}
                    >
                      <RiEyeLine />
                    </Link>
                    <Link
                      className="text-yellow-500 border border-highlightGray/25 p-1 rounded-md tooltip"
                      data-tip="Update"
                      to={`/property/edit/${property._id}`}
                    >
                      <RiEditBoxLine />
                    </Link>
                    <button
                      className="text-red-500 border border-highlightGray/25 p-1 rounded-md tooltip"
                      data-tip="Delete"
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
