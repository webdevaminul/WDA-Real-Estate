import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] container mx-auto">
      <div className="w-full max-w-4xl mx-auto sm:bg-slate-100 sm:shadow-md sm:border sm:rounded-3xl flex flex-col gap-4 sm:flex-row-reverse h-[80vh]">
        <div className="h-full w-full sm:w-1/2 md:w-[55%] p-3 sm:p-5 md:p-7 flex flex-col justify-center">
          <h1 className="text-slate-700 text-2xl lg:text-3xl text-center font-semibold lg:font-bold mb-4">
            Register
          </h1>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="User Name"
              className="border p-2 sm:p-3 rounded-lg outline-slate-500"
              id="userName"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 sm:p-3 rounded-lg outline-slate-500"
              id="userEmail"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 sm:p-3 rounded-lg outline-slate-500"
              id="userPassword"
              onChange={handleChange}
            />

            <button
              type="submit"
              className="bg-slate-500 hover:bg-slate-400 text-white p-2 sm:p-3 rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              SIGN UP
            </button>
          </form>

          <div className="flex gap-2 mt-3">
            <p>Already have an account?</p>
            <Link to="/sign-in" className="text-blue-500 hover:underline font-semibold">
              SIGN IN
            </Link>
          </div>
        </div>

        <div className="registration-bg min-h-full w-full sm:w-1/2 md:w-[45%] flex flex-col justify-between sm:rounded-r-none sm:rounded-3xl ">
          <h3 className="font-semibold lg:font-bold text-slate-500 text-2xl lg:text-3xl p-2 sm:p-3">
            Connecting <br /> People & Property
          </h3>

          <h2 className="font-bold text-2xl text-center flex-wrap p-2 sm:p-3">
            <span className="text-slate-500">WDA</span>
            <span className="text-slate-800">R Estate</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
