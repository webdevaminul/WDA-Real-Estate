import WhyChooseUsImg1 from "../assets/whyChoosUs (1).jpg";
import WhyChooseUsImg2 from "../assets/whyChoosUs (2).jpg";
import WhyChooseUsImg3 from "../assets/whyChoosUs (3).jpg";
import WhyChooseUsImg4 from "../assets/whyChoosUs (4).jpg";
import Title from "./Title";

export default function WhyChooseUs() {
  return (
    <section className="grid grid-cols-12 sm:min-h-[calc(100vh-3.625rem)] gap-4 px-4 py-6 sm:py-8 md:py-10 bg-primaryBgShade1">
      <div className="col-span-12">
        <Title
          title={"Why Choose Us?"}
          subTitle={
            "Discover how our platform simplifies property management, connects buyers and sellers"
          }
        />
      </div>

      {/* Left Content */}
      <div className="col-span-12 md:col-span-4 lg:col-span-6 my-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {[
            {
              number: "1.",
              title: "Free to List",
              description:
                "No hidden fees—list your properties for free and attract potential buyers or renters",
            },
            {
              number: "2.",
              title: "Seamless Property Listings",
              description:
                "Easily create, edit, and manage your property listings after a simple signup process",
            },
            {
              number: "3.",
              title: "Secure and Reliable Platform",
              description:
                "Robust user authentication ensures a secure and trustworthy environment for all users",
            },
            {
              number: "4.",
              title: "Direct Contact with Owners",
              description:
                "Interested buyers or renters can contact property owners directly via email",
            },
          ].map((item, index) => (
            <div key={index}>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-highlightGray">
                {item.number}
              </h3>
              <h4 className="text-xl">{item.title}</h4>
              <p className="text-justify lg:text-left font-light text-highlightGray">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="col-span-12 md:col-span-8 lg:col-span-6 grid grid-cols-2 grid-rows-9 gap-4">
        <div className="col-span-1 row-span-4 overflow-hidden">
          <img
            src={WhyChooseUsImg1}
            alt="Gallery 1"
            className="w-full h-full object-cover aspect-video rounded"
            loading="lazy"
          />
        </div>
        <div className="col-span-1 row-span-5 overflow-hidden">
          <img
            src={WhyChooseUsImg2}
            alt="Gallery 2"
            className="w-full h-full object-cover aspect-video rounded"
            loading="lazy"
          />
        </div>
        <div className="col-span-1 row-span-5 overflow-hidden">
          <img
            src={WhyChooseUsImg3}
            alt="Gallery 3"
            className="w-full h-full object-cover aspect-video rounded"
            loading="lazy"
          />
        </div>
        <div className="col-span-1 row-span-4 overflow-hidden">
          <img
            src={WhyChooseUsImg4}
            alt="Gallery 4"
            className="w-full h-full object-cover aspect-video rounded"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
