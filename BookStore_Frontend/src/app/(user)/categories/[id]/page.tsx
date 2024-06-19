import { Hero } from "@/components/Hero/Hero"
import { AllProducts } from "@/features/products"
import { featureItems } from "../../../../../mocks/featured"
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb"
import { defaultBreadcrumbItems } from "@/helpers"


const CategoryPage = () => {
    return (
        <>
            <Hero heading={featureItems.trendingProducts[0].category!.name} 
            description="Best Products here" imageUrl="/bookstore3.svg" btnLabel="View All Categories" btnLink="/categories" />
            <CustomBreadcrumb items={[
                ...defaultBreadcrumbItems,
                {
                    name: featureItems.trendingProducts[0].category!.name, link: '#',
                }
            ]} />
            <AllProducts products={featureItems.mostSellingProducts} />
        </>
    )
}
export default CategoryPage