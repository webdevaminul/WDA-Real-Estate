import { FaMinus, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import axiosPublic from "../api/axiosPublic";
import { IoLocationOutline } from "react-icons/io5";

export default function AllProperties() {
  const [allPropertyList, setAllPropertyList] = useState([]);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isBasementOpen, setIsBasementOpen] = useState(false);
  const [isFeatureOpen, setIsFeatureOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBasements, setSelectedBasements] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["Apartment", "Condo", "Villa", "Duplex", "Townhouse"];
  const types = ["Sell", "Rent"];
  const basements = ["Concrete", "Wood", "Stone", "Earthen", "Hybrid"];
  const features = ["parking", "masterBed", "furnished", "swimming"];

  useEffect(() => {
    fetchProperties();
  }, [
    selectedCategories,
    selectedTypes,
    selectedBasements,
    selectedFeatures,
    searchQuery,
    sortOption,
    currentPage,
  ]);

  const fetchProperties = async () => {
    try {
      const response = await axiosPublic.post("/api/property/all-properties", {
        categories: selectedCategories,
        types: selectedTypes,
        basements: selectedBasements,
        features: selectedFeatures,
        searchQuery,
        sortOption,
        page: currentPage,
        limit: 8,
      });
      setAllPropertyList(response.data.properties);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleCheckboxChange = (item, list, setList) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };
  // console.log({
  //   categories: selectedCategories,
  //   types: selectedTypes,
  //   basements: selectedBasements,
  //   features: selectedFeatures,
  //   searchQuery,
  //   sortOption,
  //   page: currentPage,
  //   limit: 8,
  // });

  console.log(allPropertyList);
  return (
    <main className="flex">
      {/* Sidebar Filters */}
      <aside className="hidden sm:block pb-2 sm:pb-16 bg-primaryBgShade1 fixed w-full sm:w-48 md:w-52 h-fit sm:h-full top-[3.5rem] sm:top-[3.625rem] left-0 bottom-0 z-30 shadow md:border-r border-highlightGray/10 overflow-y-auto scroll no-scrollbar">
        {/* Category Section */}
        <div className="px-2 text-primary">
          <div className="bg-primaryBgShade2 flex justify-between items-center p-3">
            <p className="select-none">Category</p>
            <span onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="cursor-pointer p-1">
              {isCategoryOpen ? (
                <FaMinus className="text-sm text-primary" />
              ) : (
                <FaPlus className="text-sm text-primary" />
              )}
            </span>
          </div>
          {isCategoryOpen && (
            <div className="bg-primaryBgShade2 flex flex-col px-3 pb-3">
              {categories.map((category) => (
                <label key={category} className="p-1 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer accent-primary"
                    checked={selectedCategories.includes(category)}
                    onChange={() =>
                      handleCheckboxChange(category, selectedCategories, setSelectedCategories)
                    }
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Type Section */}
        <div className="pt-1 px-2 text-primary">
          <div className="bg-primaryBgShade2 flex justify-between items-center p-3">
            <p className="select-none">Type</p>
            <span onClick={() => setIsTypeOpen(!isTypeOpen)} className="cursor-pointer p-1">
              {isTypeOpen ? (
                <FaMinus className="text-sm text-primary" />
              ) : (
                <FaPlus className="text-sm text-primary" />
              )}
            </span>
          </div>
          {isTypeOpen && (
            <div className="bg-primaryBgShade2 flex flex-col px-3 pb-3">
              {types.map((type) => (
                <label key={type} className="p-1 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer accent-primary"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type, selectedTypes, setSelectedTypes)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Basement Section */}
        <div className="pt-1 px-2 text-primary">
          <div className="bg-primaryBgShade2 flex justify-between items-center p-3">
            <p className="select-none">Basement</p>
            <span onClick={() => setIsBasementOpen(!isBasementOpen)} className="cursor-pointer p-1">
              {isBasementOpen ? (
                <FaMinus className="text-sm text-primary" />
              ) : (
                <FaPlus className="text-sm text-primary" />
              )}
            </span>
          </div>
          {isBasementOpen && (
            <div className="bg-primaryBgShade2 flex flex-col px-3 pb-3">
              {basements.map((basement) => (
                <label key={basement} className="p-1 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer accent-primary"
                    checked={selectedBasements.includes(basement)}
                    onChange={() =>
                      handleCheckboxChange(basement, selectedBasements, setSelectedBasements)
                    }
                  />
                  <span>{basement}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Feature Section */}
        <div className="pt-1 px-2 text-primary">
          <div className="bg-primaryBgShade2 flex justify-between items-center p-3">
            <p className="select-none">Feature</p>
            <span onClick={() => setIsFeatureOpen(!isFeatureOpen)} className="cursor-pointer p-1">
              {isFeatureOpen ? (
                <FaMinus className="text-sm text-primary" />
              ) : (
                <FaPlus className="text-sm text-primary" />
              )}
            </span>
          </div>
          {isFeatureOpen && (
            <div className="bg-primaryBgShade2 flex flex-col px-3 pb-3">
              {features.map((feature) => (
                <label key={feature} className="p-1 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer accent-primary"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() =>
                      handleCheckboxChange(feature, selectedFeatures, setSelectedFeatures)
                    }
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Section */}
      <section className="sm:pl-48 md:pl-52 text-justify w-full bg-primaryBg sm:min-h-[calc(100vh-3.625rem)]">
        <div className="grid grid-cols-12 p-4 gap-5">
          <input
            type="text"
            placeholder="Name or location..."
            className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 2xl:col-span-2 p-[6.5px] border border-highlightGray/20 bg-primaryBg rounded outline-primaryBgShade2 placeholder:text-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* The button to open modal */}

          <label
            htmlFor="my_modal_7"
            className="col-span-6 sm:hidden border border-highlightGray/20 p-2 cursor-pointer flex justify-start font-normal rounded text-primary font-body"
          >
            Filter
          </label>

          {/* Put this part before </body> tag */}
          <input type="checkbox" id="my_modal_7" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box bg-primaryBgShade1 rounded-none p-2">
              <aside className="overflow-auto scroll no-scrollbar">
                {/* Category Section */}
                <div className="p-1 text-primary">
                  <div className="bg-primaryBgShade2 flex justify-between items-center p-3">
                    <p className="select-none">Category</p>
                    <span
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="cursor-pointer p-1"
                    >
                      {isCategoryOpen ? (
                        <FaMinus className="text-sm text-primary" />
                      ) : (
                        <FaPlus className="text-sm text-primary" />
                      )}
                    </span>
                  </div>
                  {isCategoryOpen && (
                    <div className="bg-primaryBgShade2 flex flex-col px-3 pb-3">
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="p-1 flex items-center gap-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer accent-primary"
                            checked={selectedCategories.includes(category)}
                            onChange={() =>
                              handleCheckboxChange(
                                category,
                                selectedCategories,
                                setSelectedCategories
                              )
                            }
                          />
                          <span>{category}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Type Section */}
                <div className="p-1 text-primary">
                  <div className="bg-primaryBgShade2 flex justify-between items-center p-3">
                    <p className="select-none">Type</p>
                    <span onClick={() => setIsTypeOpen(!isTypeOpen)} className="cursor-pointer p-1">
                      {isTypeOpen ? (
                        <FaMinus className="text-sm text-primary" />
                      ) : (
                        <FaPlus className="text-sm text-primary" />
                      )}
                    </span>
                  </div>
                  {isTypeOpen && (
                    <div className="bg-primaryBgShade2 flex flex-col px-3 pb-3">
                      {types.map((type) => (
                        <label key={type} className="p-1 flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer accent-primary"
                            checked={selectedTypes.includes(type)}
                            onChange={() =>
                              handleCheckboxChange(type, selectedTypes, setSelectedTypes)
                            }
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Basement Section */}
                <div className="p-1 text-primary">
                  <div className="bg-primaryBgShade2 flex justify-between items-center p-3">
                    <p className="select-none">Basement</p>
                    <span
                      onClick={() => setIsBasementOpen(!isBasementOpen)}
                      className="cursor-pointer p-1"
                    >
                      {isBasementOpen ? (
                        <FaMinus className="text-sm text-primary" />
                      ) : (
                        <FaPlus className="text-sm text-primary" />
                      )}
                    </span>
                  </div>
                  {isBasementOpen && (
                    <div className="bg-primaryBgShade2 flex flex-col px-3 pb-3">
                      {basements.map((basement) => (
                        <label
                          key={basement}
                          className="p-1 flex items-center gap-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer accent-primary"
                            checked={selectedBasements.includes(basement)}
                            onChange={() =>
                              handleCheckboxChange(
                                basement,
                                selectedBasements,
                                setSelectedBasements
                              )
                            }
                          />
                          <span>{basement}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feature Section */}
                <div className="p-1 text-primary">
                  <div className="bg-primaryBgShade2 flex justify-between items-center p-3">
                    <p className="select-none">Feature</p>
                    <span
                      onClick={() => setIsFeatureOpen(!isFeatureOpen)}
                      className="cursor-pointer p-1"
                    >
                      {isFeatureOpen ? (
                        <FaMinus className="text-sm text-primary" />
                      ) : (
                        <FaPlus className="text-sm text-primary" />
                      )}
                    </span>
                  </div>
                  {isFeatureOpen && (
                    <div className="bg-primaryBgShade2 flex flex-col px-3 pb-3">
                      {features.map((feature) => (
                        <label key={feature} className="p-1 flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer accent-primary"
                            checked={selectedFeatures.includes(feature)}
                            onChange={() =>
                              handleCheckboxChange(feature, selectedFeatures, setSelectedFeatures)
                            }
                          />
                          <span>{feature}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </div>
            <label className="modal-backdrop" htmlFor="my_modal_7">
              Close
            </label>
          </div>

          <div className="hidden lg:block col-span-6 lg:col-span-4 xl:col-span-6 2xl:col-span-8"></div>
          <select
            className="col-span-6 lg:col-span-4 xl:col-span-3 2xl:col-span-2 p-2 border border-highlightGray/20 bg-primaryBg rounded text-primary outline-primaryBgShade2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
          {allPropertyList.map((singleProperty) => (
            <div
              key={singleProperty._id}
              className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 2xl:col-span-2"
            >
              <div className="">
                <figure>
                  <img
                    src={singleProperty.propertyImages[0]}
                    alt={singleProperty.propertyName}
                    className="w-full"
                    loading="lazy"
                  />
                </figure>
                <div className="px-2 py-3 bg-primaryBgShade2 border border-highlightGray/20">
                  <div className="flex gap-2 items-center justify-between">
                    <p className="text-xl font-semibold">
                      ${singleProperty.offerPrice ?? singleProperty.regularPrice}
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
                      {singleProperty.propertyArea}
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
                      className="w-12 h-12 md:w-14 md:h-14 object-cover object-center rounded-full border border-highlightGray/25"
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
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`p-2 border ${
                page === currentPage ? "bg-primary text-white" : "bg-white text-primary"
              } rounded`}
            >
              {page}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
