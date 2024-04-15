
import { FeaturedProducts } from "@/features/home/FeaturedProducts";
import { Banner } from "@/features/home/Banner";
import { TopCategories } from "@/features/home/TopCategories";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Banner />
      <TopCategories />
      <FeaturedProducts title="Best Deals For You" />
      <FeaturedProducts title="Best Selling Products"/>
      <FeaturedProducts title="Trending Products" />
    </div>
  )
}
