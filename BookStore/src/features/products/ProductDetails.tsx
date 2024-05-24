"use client"

import { AddToCartButton } from "@/components/AddToCartButton";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { Quantity } from "@/components/Quantity";
import { Rating } from "@/components/Rating";
import { defaultBreadcrumbItems, getSubstring, navItems } from "@/helpers";
import { IBreadcrumbItem, IProduct } from "@/model";
import { Box, Breadcrumb, Button, Divider, Grid, GridItem, Heading, Image, Link, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { FeaturedProducts } from "../home/FeaturedProducts";
import { featureItems } from "../../../mocks/featured";
import { useContext, useState } from "react";
import { AppConText } from "@/context/AppContext";
import { SectionHeading } from "@/components/SectionHeading";




interface IProductDetailsProps {
    product: IProduct;
}


export const ProductDetails = ({ product }: IProductDetailsProps) => {
    const [quantity, setQuantity] = useState(1);
    const { isAdded, addItem, resetItems } = useContext(AppConText);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const quantity1 = 1
    return (

        <>
            <CustomBreadcrumb
                items={[
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
                    <Rating rating={product.rating} />
                    <Text fontWeight="bold" fontSize="2rem" textDecoration="line-through">
                        {product.price}
                    </Text>
                    <Text fontWeight="bold" fontSize="2rem" >
                        {product.promotionalPrice}
                    </Text>
                    <Divider my="1rem" />
                    <Quantity setQuantity={(_valueAsString, valueAsNumber) =>
                        setQuantity(valueAsNumber)
                    }
                        disabled={isAdded('cart', product.id)} />
                    <Divider my="1rem" />
                    <Box>
                        <Link href="/checkout">
                            <Button
                                variant="outline"
                                bgColor="brand.primary"
                                color="white"
                                borderRadius="50px"
                                size="sm"
                                w="160px"
                                mr="1rem"
                                my="0.5rem"
                                _hover={{ bgColor: 'none' }}
                                onClick={() => {
                                    resetItems('checkout');
                                    addItem('checkout', product, quantity1)
                                    onClose()
                                }}>
                                Buy Now
                            </Button>
                        </Link>
                        <AddToCartButton product={product} count={quantity} />
                    </Box>
                    <Stack py="2rem">
                        <Box borderWidth={1} borderColor="gray.100" p="1rem">
                            <Text fontWeight="bold">Free Deliver</Text>
                            <Link textDecor="underline" color="gray.500">
                                Enter Your postal Code for Delivery Availability
                            </Link>
                        </Box>

                        <Box borderWidth={1} borderColor="gray.100" p="1rem">
                            <Text fontWeight="bold">Return Delivery</Text>
                            <Text color="gray.500">
                                Free 30 Days Delivery Returns
                                <Link textDecor="underline"> Details</Link>
                            </Text>
                        </Box>
                    </Stack>
                </GridItem>
            </Grid>
            <Grid
                w={{ base: '100%', lg: '90%' }}
                mx='auto'
                p="2rem">
                <SectionHeading title="Giới thiệu sách" />
                <Text my="1rem">{product.description}</Text>
            </Grid>

            <FeaturedProducts title="Related Products" products={featureItems.relatedProducts} />
        </>
    )
}

