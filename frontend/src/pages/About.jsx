import { FaGithub, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import aminul_islam_img from "../assets/aminul_islam.png";
import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <section className="sm:min-h-[clac(100vh-3.625rem)] py-4 sm:py-6 md:py-10">
      <Helmet>
        <title>About | WDA Real Estate</title>
      </Helmet>
      {/* Website Information, Features, and Technologies */}
      <div className="max-w-6xl mx-auto">
        <div className="p-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-highlight mb-4">
            WDA Real Estate
          </h2>
          <p className="text-lg font-light mb-4">
            WDA Real Estate is a modern platform to buy, rent, and sell properties. It offers an
            intuitive user experience, enabling users to explore and manage properties with ease.
          </p>

          <div className="grid grid-cols-12 gap-8">
            {/* Features */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <h3 className="text-xl text-blue-600 mb-4">Key Features</h3>
              <ul className="list-disc list-inside text-primary font-light space-y-2">
                <li>Email Verification for secure account creation.</li>
                <li>Password Recovery to reset forgotten credentials.</li>
                <li>Account/Profile Update for user personalization.</li>
                <li>Access & Refresh Tokens for seamless login experience.</li>
                <li>Form Validation for error-free data submissions.</li>
                <li>Dark Mode for user comfort.</li>
                <li>Property CRUD (Create, Edit, Delete) operations.</li>
                <li>Direct image uploads from local devices.</li>
                <li>Search, filter, and sort properties effortlessly.</li>
                <li>Pagination for smooth navigation through listings.</li>
                <li>Responsive design for all devices.</li>
              </ul>
            </div>

            {/* Frontend Technologies */}
            <div className="col-span-12 sm:col-span-3 lg:col-span-4">
              <h3 className="text-xl text-blue-600 mb-4">Frontend Technologies</h3>
              <ul className="list-disc list-inside text-primary font-light space-y-2">
                <li>React.js</li>
                <li>Redux</li>
                <li>Tailwind CSS</li>
                <li>DaisyUI</li>
                <li>React Icons</li>
                <li>TanStack Query</li>
                <li>Axios with Interceptors</li>
                <li>Firebase</li>
                <li>Cloudinary</li>
                <li>Toastify</li>
                <li>SweetAlert2</li>
                <li>Swiper.js</li>
              </ul>
            </div>

            {/* Backend Technologies */}
            <div className="col-span-12 sm:col-span-3 lg:col-span-4">
              <h3 className="text-xl text-blue-600 mb-4">Backend Technologies</h3>
              <ul className="list-disc list-inside text-primary font-light space-y-2">
                <li>Node.js</li>
                <li>Express.js</li>
                <li>Mongoose</li>
                <li>Nodemailer</li>
                <li>Bcrypt.js</li>
                <li>CORS</li>
                <li>Dotenv</li>
                <li>JSON Web Token</li>
                <li>Cookie-Parser</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* About Aminul Islam */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-primaryBgShade1 border border-highlightGray/20 rounded p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">About Me</h1>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 gap-1 flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-lg font-light">
                Hello! I'm <span className="font-bold text-highlight">Aminul Islam</span>, a MERN
                Stack Web Developer passionate about building scalable and efficient web
                applications.
              </p>
              <ul className="mt-4 space-y-2 text-primary">
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-highlight" />
                  <span>Email: webdev.aminul@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaGithub className="text-highlight" />
                  <span>
                    GitHub:{" "}
                    <a
                      href="https://github.com/webdevaminul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      github.com/webdevaminul
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FaPhoneAlt className="text-highlight" />
                  <span>Phone/WhatsApp: +8801540368036</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-highlight" />
                  <span>Address: Savar, Dhaka, Bangladesh</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 ">
              <img
                src={aminul_islam_img}
                alt="Aminul Islam"
                className="mx-auto w-64 md:w-80 border border-highlightGray/20 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
