"use client"
import { ProductCard } from '@/components/ProductCard'
import { IProduct } from '@/model'
import { Flex } from '@chakra-ui/react'
import React from 'react'

interface IAllProductsProps {
    products: IProduct[]
}

export const AllProducts = ({ products }: IAllProductsProps) => {
    console.log(products)
    return (
        <Flex
            flexWrap="wrap"
            w={{ base: "100%", lg: "90%" }}
            mx="auto"
            justify={{ base: "center", lg: "space-between" }}>
            {
                products.map(
                    (product) => (
                        <ProductCard key={product.id} product={product} />
                    )
                )
            }
        </Flex>
    )
}
