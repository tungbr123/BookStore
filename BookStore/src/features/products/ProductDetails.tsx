"use client"

import { AddToCartButton } from "@/components/AddToCartButton";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { Quantity } from "@/components/Quantity";
import { Rating } from "@/components/Rating";
import { defaultBreadcrumbItems, getSubstring, navItems } from "@/helpers";
import { IBreadcrumbItem, IProduct } from "@/model";
import { Box, Breadcrumb, Button, Divider, Grid, GridItem, Heading, Image, Link, Text } from "@chakra-ui/react"

interface IProductDetailsProps {
    product: IProduct;
}


export const ProductDetails = ({ product }: IProductDetailsProps) => {
    return (
        <>
            <CustomBreadcrumb
                items = {[
                    ...defaultBreadcrumbItems,
                    {
                        name: product.category!.name,
                        link: `/categories/${product.category.id}`
                    },
                    {
                        name: getSubstring(product.name, 20),
                        link: `/products/${product.name}`
                    }
                ]}
            />;
            <Grid
                templateColumns={{ base: 'repeat(1,1fr)', lg: 'repeat(2,1fr)' }}
                w={{ base: '100%', lg: '90%' }}
                mx='auto'
                p="2rem"
                gap="20">
                <GridItem p="1rem">
                    <Image src={product.mainImage} alt={product.name} mx="auto" />
                </GridItem>
                <GridItem p="1rem">
                    <Heading>{product.name}</Heading>
                    <Text my="1rem">{product.description}</Text>
                    <Rating rating={product.rating} />
                    <Text fontWeight="bold" fontSize="2rem" textDecoration="line-through">
                        {product.price}
                    </Text>
                    <Text fontWeight="bold" fontSize="2rem" >
                        {product.promotionalPrice}
                    </Text>
                    <Divider my="1rem" />
                    <Quantity />
                    <Divider my="1rem" />
                    <Box>
                        <Link href="/checkout">
                            <Button
                                variant="outline"
                                bgColor="brand.primary"
                                color="white"
                                borderRadius="50px"
                                size="sm"
                                w="130px"
                                mr="1rem"
                                my="0.5rem"
                                _hover={{ bgColor: 'none' }} >
                                BuyNow
                            </Button>
                        </Link>
                        <AddToCartButton product={product}/>
                    </Box>
                </GridItem>
            </Grid>
        </>
    )
}