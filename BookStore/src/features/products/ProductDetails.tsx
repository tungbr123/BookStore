"use client"

import { AddToCartButton } from "@/components/AddToCartButton";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { Quantity } from "@/components/Quantity";
import { Rating } from "@/components/Rating";
import { defaultBreadcrumbItems, getSubstring, navItems } from "@/helpers";
import { IBreadcrumbItem, ICategory, IProduct, IReview } from "@/model";
import { Box, Breadcrumb, Button, Divider, Grid, GridItem, Heading, Image, Link, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { FeaturedProducts } from "../home/FeaturedProducts";
import { featureItems } from "../../../mocks/featured";
import { useContext, useEffect, useState } from "react";
import { AppConText } from "@/context/AppContext";
import { SectionHeading } from "@/components/SectionHeading";
import ReactStars from "react-stars";
import { colors } from "@/theme";
import Review from "@/components/Review";
import showToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useCheckOut } from "@/checkoutContext";
import axios from "axios";
interface ProductBuyNow{
    productid: number;
    name: string;
    description: string;
    price: number;
    promotional_price: number;
    quantity: number;
    image: string;
    category: ICategory;
    rating: number;
    count: number
  }
// const reviews: IReview[] = [
//     {
//         reviewerName: "John Doe",
//         rating: 5,
//         text: "This product is amazing! Highly recommend.",
//         avatarUrl: "https://bit.ly/broken-link"
//     },
//     {
//         reviewerName: "Jane Smith",
//         rating: 4,
//         text: "Very good, but could be improved in some areas.",
//         avatarUrl: "https://bit.ly/dan-abramov"
//     },
//     // Add more reviews as needed
// ];

interface IProductDetailsProps {
    product: IProduct;
}


export const ProductDetails = ({ product }: IProductDetailsProps) => {
    const [quantity, setQuantity] = useState(1);
    const { isAdded, addItem, resetItems } = useContext(AppConText);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const quantity1 = 1
    const [check, setCheck] = useCheckOut()
    const router= useRouter()
    const [reviews, setReviews] = useState<IReview[]>([]);
    const product1 : ProductBuyNow = 
      {
        productid: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        promotional_price: product.promotional_price,
        quantity: product.quantity,
        image: product.image,
        category: product.category,
        rating: product.rating,
        count: 1
      }
      useEffect(() => {
        const fetchReviews = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/getReviews/${product.id}`);
            setReviews(response.data.data); // Assuming the API returns an array of reviews
          } catch (error) {
            console.error('Failed to fetch reviews:', error);
          }
        };
    
        fetchReviews();
      }, [product.id]);
    const handleBuyNowButton =() => {
      setCheck([])
      setCheck([product1])
      router.push('/checkout')
    }
    return (

        <>
            {/* <CustomBreadcrumb
                items={[
                    ...defaultBreadcrumbItems,
                    {
                        name: product.category!.name,
                        link: `/categories/${product.category.id}`
                    },
                    {
                        name: getSubstring(product.name, 20),
                        link: `/products/${product.id}`
                    }
                ]}
            />; */}

            <Grid
                templateColumns={{ base: 'repeat(1,1fr)', lg: 'repeat(2,1fr)' }}
                w={{ base: '100%', lg: '90%' }}
                mx='auto'
                p="2rem"
                gap="20">
                <GridItem p="1rem">
                    <Image src={product.image} alt={product.name} mx="auto" />
                </GridItem>
                <GridItem p="1rem">
                    <Heading>{product.name}</Heading>
                    <ReactStars count={5} value={product.rating} size={18} color2={colors.brand.primary} edit={false}></ReactStars>
                    <Text fontWeight="bold" fontSize="2rem" textDecoration="line-through">
                        {product.price}
                    </Text>
                    <Text fontWeight="bold" fontSize="2rem" >
                        {product.promotional_price}
                    </Text>
                    <Divider my="1rem" />
                    <Quantity setQuantity={(_valueAsString, valueAsNumber) =>
                        setQuantity(valueAsNumber)
                    }
                        disabled={isAdded('cart', product.id)} />
                    <Divider my="1rem" />
                    <Box>
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
                                onClick={handleBuyNowButton}>
                                Buy Now
                            </Button>
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
            <Grid
                w={{ base: '100%', lg: '90%' }}
                mx='auto'
                p="2rem">
                <Heading mb={5} textAlign="left">Customer Reviews</Heading>
                {reviews.map((review, index) => (
                    <Review key={index} review={review} />
                ))}
           </Grid>
            <FeaturedProducts title="Related Products" products={featureItems.relatedProducts} />
        </>
    )
}

