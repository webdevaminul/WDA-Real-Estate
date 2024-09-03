import { RiFocus2Line } from "react-icons/ri";
import { IoIosAt } from "react-icons/io";
import { useSelector } from "react-redux";

export default function () {
  const { user } = useSelector((state) => state.auth);

  return (
    <main className="p-2 sm:p-10 flex flex-col gap-5">
      <div className="flex flex-col justify-center items-center">
        <figure className="w-32 h-32 border border-highlightGray rounded-full overflow-clip">
          <img
            src={user?.userInfo?.userPhoto}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </figure>
        <h2 className="mt-1 text-2xl sm:text-4xl">Hi, {user?.userInfo?.userName}</h2>
        <p className="text-sm">Your information helps other users to contact with you.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Column 1: Basic Information */}
        <div className="col-span-2 lg:col-span-1 border border-highlightGray/20 p-4 rounded-lg bg-primaryBgShade1">
          <p className="text-lg mb-2 flex items-center font-sans font-light">
            <span className="mr-2 text-3xl sm:text-4xl text-purple-600 bg-purple-200 rounded-full p-1">
              <RiFocus2Line />
            </span>
            <span className="text-purpleColor">Basic Information</span>
          </p>
          <p>
            <span className="text-sm">Name:</span>
            <span className="text-lg text-secondary font-serif"> {user?.userInfo?.userName}</span>
          </p>
          <p>
            <span className="text-sm">Date of Birth:</span>
            <span className="text-lg text-secondary font-serif">
              {user?.userInfo?.userBirth || "No data"}
            </span>
          </p>
          <p>
            <span className="text-sm">Gender:</span>
            <span className="text-lg text-secondary font-serif">
              {user?.userInfo?.userGender || "No data"}
            </span>
          </p>
        </div>

        {/* Column 2: Contact Information */}
        <div className="col-span-2 lg:col-span-1 border border-highlightGray/20 p-4 rounded-lg bg-primaryBgShade1">
          <p className="text-lg mb-2 flex items-center font-sans font-light">
            <span className="mr-2 text-3xl sm:text-4xl text-blue-600 bg-blue-200 rounded-full p-1">
              <IoIosAt />
            </span>
            <span className="text-blueColor">Contact Information</span>
          </p>
          <p>
            <span className="text-sm">Email:</span>
            <span className="text-lg text-secondary font-serif"> {user?.userInfo?.userEmail}</span>
          </p>
          <p>
            <span className="text-sm">Phone:</span>
            <span className="text-lg text-secondary font-serif">
              {user?.userInfo?.userPhone || "No data"}
            </span>
          </p>
          <p>
            <span className="text-sm">Address:</span>
            <span className="text-lg text-secondary font-serif">
              {user?.userInfo?.userAddress || "No data"}
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
