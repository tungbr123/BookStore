
import { FeaturedProducts } from "@/features/home/FeaturedProducts";
import { Banner } from "@/features/home/Banner";
import { TopCategories } from "@/features/home/TopCategories";
import { featureItems } from "../../../mocks/featured";

export default function Home() {
  return (
    <div>
      <Banner />
      <TopCategories categories={featureItems.topCategories} />
      <FeaturedProducts title="Best Deals For You" products={featureItems.bestDeals}/>
      <FeaturedProducts title="Best Selling Products" products={featureItems.mostSellingProducts}/>
      <FeaturedProducts title="Trending Products" products={featureItems.trendingProducts} />
    </div>
  )
}
