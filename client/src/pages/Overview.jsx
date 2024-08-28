import { RiFocus2Line } from "react-icons/ri";
import { IoIosAt } from "react-icons/io";
import { LuUserCog2 } from "react-icons/lu";

export default function () {
  return (
    <main className="p-2 sm:p-10 flex flex-col gap-5">
      <div>
        <figure className="w-40 h-40 rounded-full overflow-clip border border-highlightGray">
          <img
            src="https://lh3.googleusercontent.com/a/ACg8ocJ6GHDsJub48BSYgH6IC_aNbXI_NNrW5qq8Cpg5FBZ24xWVzrbs=s288-c-no"
            alt="profile"
          />
        </figure>
        <p className="mt-1 text-4xl">Hi, Aminul Islam</p>
        <p className="text-sm">Your information helps other users to contact with you.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Column 1: Basic Information */}
        <div className="col-span-2 lg:col-span-1 border border-highlightGray/20 p-4 rounded-lg bg-primaryBgShade1">
          <p className="text-lg font-semibold mb-2 flex items-center">
            <span className="mr-2 text-4xl text-purple-600 bg-purple-200 rounded-full p-1">
              <RiFocus2Line />
            </span>
            <span className="text-purpleColor">Basic Information</span>
          </p>
          <p>
            <span className="text-sm">Name:</span>
            <span className="text-lg text-secondary font-serif"> Aminul Islam</span>
          </p>
          <p>
            <span className="text-sm">Date of Birth:</span>
            <span className="text-lg text-secondary font-serif"> January 1, 1990</span>
          </p>
          <p>
            <span className="text-sm">Gender:</span>
            <span className="text-lg text-secondary font-serif"> Male</span>
          </p>
        </div>

        {/* Column 2: Contact Information */}
        <div className="col-span-2 lg:col-span-1 border border-highlightGray/20 p-4 rounded-lg bg-primaryBgShade1">
          <p className="text-lg font-semibold mb-2 flex items-center">
            <span className="mr-2 text-4xl text-blue-600 bg-blue-200 rounded-full p-1">
              <IoIosAt />
            </span>
            <span className="text-blueColor">Contact Information</span>
          </p>
          <p>
            <span className="text-sm">Email:</span>
            <span className="text-lg text-secondary font-serif"> abir13719@gmail.com</span>
          </p>
          <p>
            <span className="text-sm">Phone:</span>
            <span className="text-lg text-secondary font-serif"> +1234567890</span>
          </p>
          <p>
            <span className="text-sm">Address:</span>
            <span className="text-lg text-secondary font-serif"> City, Country</span>
          </p>
        </div>
      </div>
    </main>
  );
}
