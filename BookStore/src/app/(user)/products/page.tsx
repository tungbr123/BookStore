import { AllProducts } from '@/features/products'
import React from 'react'

import { Hero } from '@/components/Hero/Hero'
import { IProduct } from '@/model'

const ProductsPage = async () => {
    const response = await fetch("http://localhost:8080/api/product/getAllProduct");

    const products: IProduct[] = await response.json()
    return (
        <>
            <Hero
                heading='Sách hay bạn tốt'
                description='Sách hay mang đến những trải nghiệm tuyệt vời nhất'
                imageUrl="https://americastarbooks.com/wp-content/uploads/2018/01/c58f32cc-b6f2-11e7-aaab-cac091044fd5.jpg"
                btnLabel='View all categories'
                btnLink='/categories'>

            </Hero>
            <AllProducts products={products} />
        </>
    )
}
export default ProductsPage