import React from "react";
import HeroSlider from "../components/Home/HeroSlider";
import CategoryGrid from "../components/Home/CategoryGrid";
import ProductSlider from "../components/Home/ProductSlider";
import FeatureSection from "../components/Home/FeatureSection";
import NewsletterSection from "../components/Home/NewsletterSection";
import RecentlyViewed from "../components/Home/RecentlyViewed";
import TestimonialCarousel from "../components/Home/TestimonialCarousel";
import ImpactSection from "../components/Home/ImpactSection";
import { useSelector } from "react-redux";
import Snowfall from "react-snowfall";
import PromoStrip from "../components/Home/PromoStrip";
const Index = () => {
  const { topRatedProducts, newProducts } = useSelector(
    (state) => state.product
  );
  return (
    <div className="min-h-screen">

      <Snowfall snowflakeCount={200} />
    
      <PromoStrip />
      <HeroSlider />
      
      <div className="container mx-auto px-4 pt-20">
        <CategoryGrid />
        <RecentlyViewed />

        {newProducts.length > 0 && (
          <ProductSlider title="New Arrivals" products={newProducts} />
        )}
        {topRatedProducts.length > 0 && (
          <ProductSlider
            title="Top Rated Products"
            products={topRatedProducts}
          />
        )}
        <FeatureSection />
        <ImpactSection />
        <TestimonialCarousel />
        <NewsletterSection />
      </div>
    </div>
  );
};

export default Index;
