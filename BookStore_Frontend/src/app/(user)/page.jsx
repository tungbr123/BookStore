"use client";
import { FeaturedProducts } from "@/features/home/FeaturedProducts";
import { Banner } from "@/features/home/Banner";
import { TopCategories } from "@/features/home/TopCategories";
import { useEffect, useState } from "react";

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const [trendingResponse, bestSellingResponse, bestDealsResponse] = await Promise.all([
          fetch("http://localhost:8080/api/product/getTrendingProducts"),
          fetch("http://localhost:8080/api/product/getBestsellingProducts"),
          fetch("http://localhost:8080/api/product/getBestdealsProducts"),
        ]);

        if (!trendingResponse.ok || !bestSellingResponse.ok || !bestDealsResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const trending = await trendingResponse.json();
        const bestSelling = await bestSellingResponse.json();
        const deals = await bestDealsResponse.json();

        setTrendingProducts(trending);
        setBestSellingProducts(bestSelling);
        setBestDeals(deals);

        // Fetch categories
        const categoriesResponse = await fetch("http://localhost:8080/getAllCategories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Banner />
      <TopCategories categories={categories} />
      <FeaturedProducts title="Trending Products" products={trendingProducts} />
      <FeaturedProducts title="Best Deals For You" products={bestDeals} />
      <FeaturedProducts title="Best Selling Products" products={bestSellingProducts} />
    </div>
  );
}
