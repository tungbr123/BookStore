'use client'

import { ICategory } from "@/model"
import { Card, CardBody, Flex, Grid, Heading, Image, Link } from "@chakra-ui/react"
import { TopCategoriesCard } from "../home/TopCategories"
import React from 'react'

interface ICategoriesProps{
    categories: ICategory[]
}

export const AllCategories=({categories}: ICategoriesProps) =>{
    return(
        <Grid templateColumns={{base: 'repeat(1,1fr)', lg: 'repeat(2,1fr)'}}
        gap="20px"
        mx="auto"
        py="2rem">
            {categories.map(
                (category)=>(
                    <CategoryCard key={category.id} category={category}/>
                )
            )}
        </Grid>
    )
}

interface ICategoryCardProps{
    category: ICategory
}
const CategoryCard = ({category}: ICategoryCardProps) =>{
    return(
        <Link href={'/categories/ ${category.id}'}>
            <Card direction="column" align="center" overflow="hidden" variant="outline" w='100%' h="100%" 
            p="10px" _hover={{bgColor:'gray.100' , cursor: 'pointer'}}>
                <Image src={category.image} alt={category.name} w='200' h='200' />
                <CardBody>
                    <Heading size={{base: 'sm' ,lg: 'md'}}>
                        {category.name}
                    </Heading>
                </CardBody>
            </Card>
        </Link>
    )
} 