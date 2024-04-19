import { Hero } from "@/components/Hero/Hero"
import { AllProducts } from "@/features/products"
import { products } from "../../../../mocks/products"
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb"
import { defaultBreadcrumbItems } from "@/helpers"


const CategoryPage = () => {
    return (
        <>
            <Hero heading={products[0].category!.name} 
            description="Best Products here" imageUrl="/bookstore3.svg" btnLabel="View All Categories" btnLink="/categories" />
            <CustomBreadcrumb items={[
                ...defaultBreadcrumbItems,
                {name: products[0].category!.name, link: '#',
                }
            ]} />
            <AllProducts products={products} />
        </>
    )
}
export default CategoryPage