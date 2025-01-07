import { RiFocus2Line } from "react-icons/ri";
import { IoIosAt } from "react-icons/io";
import { useSelector } from "react-redux";
import Title from "../components/Title";
import InfoField from "../components/InfoField";

export default function () {
  const { user } = useSelector((state) => state.auth);
  let day = "No data";
  let month = "No data";
  let year = "No data";

  if (user?.userInfo?.userBirth) {
    const dataBaseData = new Date(user.userInfo.userBirth);
    day = dataBaseData.getDate() || "No data";
    month = dataBaseData.toLocaleString("default", { month: "long" }) || "No data";
    year = dataBaseData.getFullYear() || "No data";
  }

  // Extract day, month, and year

  return (
    <main className="px-2 py-5 sm:p-10 flex flex-col gap-5">
      <div className="flex flex-col justify-center items-center gap-4">
        <figure className="w-32 h-32 border border-highlightGray rounded-full overflow-clip">
          <img
            src={user?.userInfo?.userPhoto}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </figure>
        <Title
          title={`Hi, ${user?.userInfo?.userName}`}
          subTitle={"Your information helps other users to contact with you."}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full pt-4">
        {/* Column 1: Basic Information */}
        <div className="col-span-2 lg:col-span-1 border border-highlightGray/20 p-4 rounded-lg bg-primaryBgShade1">
          <p className="text-lg mb-2 flex items-center font-sans font-light">
            <span className="mr-2 text-3xl sm:text-4xl text-purple-600 bg-purple-200 rounded-full p-1">
              <RiFocus2Line />
            </span>
            <span className="text-purpleColor">Basic Information</span>
          </p>

          <InfoField label={"Name"} value={`${user?.userInfo?.userName}`} />
          <InfoField label={"Date of Birth"} value={`${month} ${day}, ${year}`} />
          <InfoField label={"Gender"} value={`${user?.userInfo?.userGender}`} />
        </div>

        {/* Column 2: Contact Information */}
        <div className="col-span-2 lg:col-span-1 border border-highlightGray/20 p-4 rounded-lg bg-primaryBgShade1">
          <p className="text-lg mb-2 flex items-center font-sans font-light">
            <span className="mr-2 text-3xl sm:text-4xl text-blue-600 bg-blue-200 rounded-full p-1">
              <IoIosAt />
            </span>
            <span className="text-blueColor">Contact Information</span>
          </p>
          <InfoField label={"Email"} value={`${user?.userInfo?.userEmail}`} />
          <InfoField label={"Phone"} value={`${user?.userInfo?.userPhone}`} />
          <InfoField label={"Address"} value={`${user?.userInfo?.userAddress}`} />
        </div>
      </div>
    </main>
  );
}
