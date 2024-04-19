import { AllCategories } from "@/features/categories"
import { categories } from "../../../mocks/categories"
import { Hero } from "@/components/Hero/Hero"


const CategoriesPage = () => {
    return (
        <>
            <Hero
                heading='Các thể loại sách '
                description='Hãy tìm những thể loại sách yêu thích của bạn'
                imageUrl="https://americastarbooks.com/wp-content/uploads/2018/01/c58f32cc-b6f2-11e7-aaab-cac091044fd5.jpg"
                btnLabel='View all books'
                btnLink='/products'>

            </Hero>
            <AllCategories categories={categories} />
        </>
    )
}

export default CategoriesPage