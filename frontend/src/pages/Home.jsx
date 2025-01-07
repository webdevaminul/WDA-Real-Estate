import Banner from "../components/Banner";
import PopularProperty from "../components/PopularProperty";
import Reviews from "../components/Reviews";
import WhyChooseUs from "../components/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <Banner />
      <PopularProperty />
      <WhyChooseUs />
      <Reviews />
    </main>
  );
}
