import { Link } from "react-router-dom";
import { RiDeleteBin2Line, RiEditBoxLine } from "react-icons/ri";
import { GrView } from "react-icons/gr";

export default function PropertyList() {
  return (
    <main>
      <div className="p-4">
        <h2 className="text-2xl md:text-4xl text-center font-semibold text-primary mb-2">
          Your properties
        </h2>
        <p className="text-center text-primary mb-6">
          Manage your properties here. View, update, or delete any of your listings.
        </p>
      </div>

      <div className="overflow-x-auto px-6">
        <table className="min-w-full table-auto text-sm text-left text-primary border border-highlightGray/25">
          {/* Table Head */}
          <thead className="bg-primary/5">
            <tr>
              <th className="px-6 py-4 font-medium">Property</th>
              <th className="px-6 py-4 font-medium">Area</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Bed</th>
              <th className="px-6 py-4 font-medium">Bath</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-primaryBg divide-y divide-highlightGray/25">
            {/* Row 1 */}
            <tr className="hover:bg-primaryBgShade1/25">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3 transition-none">
                  <figure className="w-14 aspect-square rounded-lg overflow-hidden">
                    <img
                      src="https://via.placeholder.com/150"
                      className="w-full h-full object-cover object-center"
                      alt="Luxury Villa"
                    />
                  </figure>

                  <span className="font-semibold">Luxury Villa</span>
                </div>
              </td>
              <td className="px-6 py-4">1823 sq feet</td>
              <td className="px-6 py-4">San Francisco, CA</td>
              <td className="px-6 py-4">$2,500/month</td>
              <td className="px-6 py-4">Rent</td>
              <td className="px-6 py-4">2</td>
              <td className="px-6 py-4">1</td>
              <td className="px-6 py-4 space-x-2 text-2xl flex items-center flex-nowrap h-16 my-3">
                <Link className="text-blue-500">
                  <GrView />
                </Link>
                <Link className="text-yellow-500">
                  <RiEditBoxLine />
                </Link>
                <Link className="text-red-500 pb-[2px]">
                  <RiDeleteBin2Line />
                </Link>
              </td>
            </tr>

            {/* Row 2 */}
            <tr className="hover:bg-primaryBgShade1/25">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3 transition-none">
                  <figure className="w-14 aspect-square rounded-lg overflow-hidden">
                    <img
                      src="https://via.placeholder.com/150"
                      className="w-full h-full object-cover object-center"
                      alt="Luxury Villa"
                    />
                  </figure>

                  <span className="font-semibold">Luxury Villa</span>
                </div>
              </td>
              <td className="px-6 py-4">1823 sq feet</td>
              <td className="px-6 py-4">Miami, FL</td>
              <td className="px-6 py-4">$1,200,000</td>
              <td className="px-6 py-4">Sale</td>
              <td className="px-6 py-4">4</td>
              <td className="px-6 py-4">3</td>
              <td className="px-6 py-4 space-x-2 text-2xl flex items-center flex-nowrap h-16 my-3">
                <Link className="text-blue-500">
                  <GrView />
                </Link>
                <Link className="text-yellow-500">
                  <RiEditBoxLine />
                </Link>
                <Link className="text-red-500 pb-[2px]">
                  <RiDeleteBin2Line />
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
