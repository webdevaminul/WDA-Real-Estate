import { Helmet } from "react-helmet-async";
import Banner from "../components/Banner";
import PopularProperty from "../components/PopularProperty";
import Reviews from "../components/Reviews";
import WhyChooseUs from "../components/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <Helmet>
        <title>WDA Real Estate</title>
      </Helmet>
      <Banner />
      <PopularProperty />
      <WhyChooseUs />
      <Reviews />
    </main>
  );
}
