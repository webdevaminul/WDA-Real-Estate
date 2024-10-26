import { Link } from "react-router-dom";
import Title from "../components/Title";
import { PiCaretUpDown } from "react-icons/pi";
import { RiEyeLine, RiEditBoxLine, RiDeleteBin6Line } from "react-icons/ri";

export default function PropertyList() {
  return (
    <main>
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
                  <span className="rounded-full text-lg cursor-pointer p-1">
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Location</span>
                  <span className="rounded-full text-lg cursor-pointer p-1">
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Area</span>
                  <span className="rounded-full text-lg cursor-pointer p-1">
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Price</span>
                  <span className="rounded-full text-lg cursor-pointer p-1">
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Type</span>
                  <span className="rounded-full text-lg cursor-pointer p-1">
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Bed</span>
                  <span className="rounded-full text-lg cursor-pointer p-1">
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-base font-medium">
                <div className="flex items-center justify-between gap-1 transition-none duration-0">
                  <span className="text-nowrap">Bath</span>
                  <span className="rounded-full text-lg cursor-pointer p-1">
                    <PiCaretUpDown />
                  </span>
                </div>
              </th>
              <th className="p-3 font-medium text-base">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-primaryBg divide-y divide-highlightGray/25">
            {/* Row 1 */}
            <tr className="hover:bg-primaryBgShade1/50">
              <td className="p-3">
                <div className="flex items-center gap-3 transition-none">
                  <figure className="w-12 aspect-square rounded-lg overflow-hidden">
                    <img
                      src="https://via.placeholder.com/150"
                      className="w-full h-full object-cover object-center"
                    />
                  </figure>

                  <span className="font-semibold">Luxury Villa</span>
                </div>
              </td>
              <td className="p-3">San Francisco, CA</td>
              <td className="p-3">1823</td>
              <td className="p-3">$2,500/month</td>
              <td className="p-3">Rent</td>
              <td className="p-3">2</td>
              <td className="p-3">1</td>
              <td className="p-3">
                <div className="flex items-center gap-2 text-lg">
                  <Link
                    className="text-blue-500 border border-highlightGray/25 p-1 rounded-md tooltip"
                    data-tip="View"
                  >
                    <RiEyeLine />
                  </Link>
                  <Link
                    className="text-yellow-500 border border-highlightGray/25 p-1 rounded-md tooltip"
                    data-tip="Update"
                  >
                    <RiEditBoxLine />
                  </Link>
                  <Link
                    className="text-red-500 border border-highlightGray/25 p-1 rounded-md tooltip"
                    data-tip="Delete"
                  >
                    <RiDeleteBin6Line />
                  </Link>
                </div>
              </td>
            </tr>

            {/* Row 2 */}
            <tr className="hover:bg-primaryBgShade1/50">
              <td className="p-3">
                <div className="flex items-center gap-3 transition-none">
                  <figure className="w-12 aspect-square rounded-lg overflow-hidden">
                    <img
                      src="https://via.placeholder.com/150"
                      className="w-full h-full object-cover object-center"
                    />
                  </figure>

                  <span className="font-semibold">Luxury Villa</span>
                </div>
              </td>
              <td className="p-3">San Francisco, CA</td>
              <td className="p-3">1823</td>
              <td className="p-3">$3,500</td>
              <td className="p-3">Sell</td>
              <td className="p-3">2</td>
              <td className="p-3">1</td>
              <td className="p-3">
                <div className="flex items-center gap-2 text-lg">
                  <Link
                    className="text-blue-500 border border-highlightGray/25 p-1 rounded-md tooltip"
                    data-tip="View"
                  >
                    <RiEyeLine />
                  </Link>
                  <Link
                    className="text-yellow-500 border border-highlightGray/25 p-1 rounded-md tooltip"
                    data-tip="Update"
                  >
                    <RiEditBoxLine />
                  </Link>
                  <Link
                    className="text-red-500 border border-highlightGray/25 p-1 rounded-md tooltip"
                    data-tip="Delete"
                  >
                    <RiDeleteBin6Line />
                  </Link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
