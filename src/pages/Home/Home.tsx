import { TrendingBooksCarousel } from "../../components/TrendingBooksCarousel";
import { SFBooksCarousel } from "../../components/SFBooksCarousel";
import { HPBooksCarousel } from "../../components/HPBooksCarousel";
import { FrenchBooksCarousel } from "../../components/FrenchBooksCarousel";
import { RecentUpdatesCarousel } from "../../components/RecentUpdatesCarousel";


export const HomePage = () => {

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <TrendingBooksCarousel/>
      <SFBooksCarousel/>
      <HPBooksCarousel/>
      <FrenchBooksCarousel/>
      <RecentUpdatesCarousel/>
    </div>
  
  );
};




