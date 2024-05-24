'use client'

import { IProduct } from "@/model";
import { CSSProperties } from "react"

const slideStyles: CSSProperties = {
    boxSizing: "border-box",
    maxWidth: "350px"
}

interface RelatedProductsProps {
    title: string;
    products: IProduct[];
}

export const RelatedProducts =({ title, products }: RelatedProductsProps) => {
    return (
        <div>Hello</div>
    )
}
