import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { EffectFade, Autoplay } from "swiper/modules";
import propertyImage1 from "../assets/1.jpg";
import propertyImage2 from "../assets/2.jpg";
import propertyImage3 from "../assets/3.jpg";
import propertyImage4 from "../assets/4.jpg";
import propertyImage5 from "../assets/5.jpg";
import propertyImage6 from "../assets/6.jpg";
import propertyImage7 from "../assets/7.jpg";

export default function Banner() {
  const bannerImages = [
    propertyImage1,
    propertyImage2,
    propertyImage3,
    propertyImage4,
    propertyImage5,
    propertyImage6,
    propertyImage7,
  ];
  return (
    <div className="relative w-full h-[60vh] sm:h-[80vh] md:h-[90vh] lg:h-screen max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-3.625rem)] overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Overlay Text */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primaryWhite">
          Welcome to WDAR Estate
        </h1>
        <p className="mb-6 text-primaryWhite text-lg">
          Discover the best properties to buy, rent, or sell. Your dream home awaits.
        </p>
        <Link
          to="/property-list"
          className="text-lg bg-highlight hover:bg-highlightHover px-3 py-2 rounded text-white"
        >
          Explore Now
        </Link>
      </div>

      {/* Swiper */}
      <Swiper
        spaceBetween={0}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Autoplay]}
        className="mySwiper h-full"
      >
        {bannerImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={image}
                alt="Property Image"
                loading="lazy"
                className="object-center w-full h-full object-cover animate-zoom"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
