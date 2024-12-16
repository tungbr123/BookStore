"use client"
import { ProductDetails } from "@/features/products/ProductDetails"
import {featureItems} from "../../../../../mocks/featured"
import { useParams } from 'react-router-dom';
import showToast from "@/hooks/useToast";
import { useEffect, useState } from "react";
import api from "@/ApiProcess/api";
import { IProduct } from "@/model";

const ProductDetailsPage =() =>{
    const [product, setProduct] = useState<IProduct | null>(null);

    useEffect(() => {
      // Extract ID from the URL
      const path = window.location.pathname;
      const id = path.split('/').pop(); // This gets the last part of the URL
    //   showToast(`http://localhost:8080/api/product/getProduct?id=${id}`)
      // Fetch product data based on the id
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/product/getProduct?id=${id}`);
          const data:IProduct = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
  
      fetchProduct();
    }, []);
    return <div>
        <ProductDetails product={product} />
    </div>
}

export default ProductDetailsPage