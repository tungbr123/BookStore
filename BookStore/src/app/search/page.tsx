"use client"

import api from "@/ApiProcess/api"
import { AllProducts } from "@/features/products"
import showToast from "@/hooks/useToast";
import { IProduct } from "@/model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function SearchedPage () {
    ;
    // const [decodedName, setDecodedName] = useState('');
    const [products, setProducts] = useState<IProduct[]>([]);
    var decodedName= ''
    const name = useSearchParams().get("name");
    useEffect(() => {
        const fetchProducts = async () => {
            if (name) {
                const decodedName = decodeURIComponent(name);
                try {
                    const response = await fetch(`http://localhost:8080/api/product/getAllProductByName?search=${decodedName}`);
                    const products: IProduct[] = await response.json();
                    setProducts(products);
                } catch (error) {
                    showToast("Error fetching search results:");
                }
            }
        };

        fetchProducts();
    }, [name]);
    return (
        <AllProducts products={products} />
    )
}
