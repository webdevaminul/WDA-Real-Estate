import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.id]: e.target.value,
  //   });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/auth/signup", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     const data = await res.json();
  //     console.log(data);
  //     if (!data.success) {
  //       setError(data.message);
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-[90vh] container mx-auto">
      <div className="w-full max-w-4xl mx-auto sm:bg-slate-100 sm:shadow-md sm:border sm:rounded-3xl flex flex-col gap-4 sm:flex-row-reverse h-[80vh]">
        <div className="h-full w-full sm:w-1/2 md:w-[55%] p-3 sm:p-5 md:p-7 flex flex-col justify-center">
          <h1 className="text-slate-700 text-2xl lg:text-3xl text-center font-semibold lg:font-bold mb-4">
            Register
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="User Name*"
              className={`border p-2 sm:p-3 rounded-lg outline-slate-500 ${
                errors.userName ? "border-red-500 outline-red-500" : ""
              } `}
              {...register("userName", { required: "User name is required" })}
              aria-invalid={errors.userName ? "true" : "false"}
            />
            {errors.userName && (
              <p role="alert" className="text-red-500">
                {errors.userName.message}
              </p>
            )}

            <input
              type="email"
              placeholder="Email Address*"
              className={`border p-2 sm:p-3 rounded-lg outline-slate-500 ${
                errors.userEmail ? "border-red-500 outline-red-500" : ""
              }`}
              {...register("userEmail", {
                required: "Email address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              aria-invalid={errors.userEmail ? "true" : "false"}
            />
            {errors.userEmail && (
              <p role="alert" className="text-red-500">
                {errors.userEmail.message}
              </p>
            )}

            <input
              type="password"
              placeholder="Password"
              className={`border p-2 sm:p-3 rounded-lg outline-slate-500 ${
                errors.userPassword ? "border-red-500 outline-red-500" : ""
              }`}
              {...register("userPassword", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                  message: "Password must contain at least one letter and one number",
                },
              })}
              aria-invalid={errors.userPassword ? "true" : "false"}
            />
            {errors.userPassword && (
              <p role="alert" className="text-red-500">
                {errors.userPassword.message}
              </p>
            )}

            <button
              disabled={loading}
              type="submit"
              className="bg-slate-500 hover:bg-slate-400 text-white p-2 sm:p-3 rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "SIGN UP"}
            </button>
          </form>

          <div className="flex flex-col gap-2 mt-3">
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
