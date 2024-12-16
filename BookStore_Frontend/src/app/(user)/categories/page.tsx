"use client"
import { AllCategories } from "@/features/categories"
import { categories } from "../../../../mocks/categories"
import { Hero } from "@/components/Hero/Hero"
import { ICategory } from "@/model";
import { useEffect, useState } from "react";
import { useCategoryContext } from "@/CategoryContext";


const CategoriesPage = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const {selectedCategory, setSelectedCategory} = useCategoryContext()
    useEffect(() => {
        fetchCategories();
      }, []);
    const fetchCategories = async () => {
        try {
            const response = await fetch(`http://localhost:8080/getAllCategories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <>
            <Hero
                heading='All Book Categories'
                description="Let's find your favorite category"
                imageUrl="https://americastarbooks.com/wp-content/uploads/2018/01/c58f32cc-b6f2-11e7-aaab-cac091044fd5.jpg"
                btnLabel='View all books'
                btnLink='/products'>

            </Hero>
            <AllCategories categories={categories} />
        </>
    )
}

export default CategoriesPage