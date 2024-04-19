
import { ProductDetails } from "@/features/products/ProductDetails"
import { products } from "../../../../mocks/products"

const ProductDetailsPage =() =>{
    return <div>
        <ProductDetails product={products[0]} />
    </div>
}

export default ProductDetailsPage