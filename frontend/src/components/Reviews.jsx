// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

// Import required modules
import { Autoplay } from "swiper/modules";
import Title from "./Title";

// Function to cut text to a specific length
const cutText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Function to render stars based on rating
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center text-highlight text-lg">
      {Array(fullStars)
        .fill()
        .map((_, index) => (
          <FaStar key={`full-${index}`} />
        ))}
      {halfStar === 1 && <FaStarHalfAlt />}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <FaRegStar key={`empty-${index}`} />
        ))}
    </div>
  );
};

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      message:
        "The platform's search and filter options made finding the perfect property incredibly easy. I was able to narrow down my choices by price, property type within minutes. The ability to contact the owner directly through the platform made the entire process seamless and stress-free. It's by far the best property platform I’ve used!",
      userName: "Sophia P.",
      rating: 5,
    },
    {
      id: 2,
      message:
        "I listed my property for rent on this platform, and the experience was fantastic! Within a few days, I received multiple inquiries from potential tenants. The interface is intuitive, making it simple to upload photos, set prices, and add detailed descriptions. I love how easy it is to manage my property listings and connect with interested renters.",
      userName: "James K.",
      rating: 4.5,
    },
    {
      id: 3,
      message:
        "As someone looking to buy a property, this platform exceeded my expectations. The detailed property descriptions, high-quality photos, and advanced search features made my search incredibly efficient. Being able to email the owners directly through the platform saved me so much time, and I felt confident throughout the process. Highly recommend it to anyone!",
      userName: "Emily S.",
      rating: 5,
    },
    {
      id: 4,
      message:
        "Managing my property listings has never been this easy! The platform allows me to create, edit, and delete listings effortlessly. I appreciate how potential buyers can reach out to me directly through email. The map feature is especially useful for showcasing property locations, and the whole experience has been nothing short of excellent.",
      userName: "Emma T.",
      rating: 4.8,
    },
  ];

  return (
    <section className="py-10 md:min-h-[calc(100vh-3.625rem)]">
      <div className="p-4">
        <Title
          title={"What Our Clients Say"}
          subTitle={"Read testimonials from happy homeowners and satisfied clients."}
        />
        <Swiper
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="mt-6 sm:mt-10"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-primaryBgShade1 border border-highlightGray/20 rounded p-6 flex flex-col gap-4 h-full">
                <p className="text-lg leading-relaxed">"{cutText(review.message, 210)}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <figure className="w-14 h-14 rounded-full overflow-hidden border border-highlightGray/20">
                    <img
                      src={`https://randomuser.me/api/portraits/lego/${review.id}.jpg`}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div>
                    <p className="font-light">{review.userName}</p>
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
