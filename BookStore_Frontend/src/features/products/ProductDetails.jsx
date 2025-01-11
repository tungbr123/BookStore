"use client";

import { AddToCartButton } from "@/components/AddToCartButton";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { Quantity } from "@/components/Quantity";
import { Rating } from "@/components/Rating";
import { defaultBreadcrumbItems, getSubstring, navItems } from "@/helpers";
import { Box, useToast, Breadcrumb, Button, Divider, Grid, GridItem, Heading, Image, Link, Stack, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
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
import { useSelector } from "react-redux";
import { useRecentlyViewedProducts } from "@/RecentlyViewedProductsContext";

export const ProductDetails = ({ product }) => {
    if (product) {
        const toast = useToast();
        const [quantity, setQuantity] = useState(1);
        const { isAdded, addItem, resetItems } = useContext(AppConText);
        const { isOpen, onOpen, onClose } = useDisclosure();
        const [check, setCheck] = useCheckOut();
        const loggedUser = useSelector((state) => state.auth);
        const router = useRouter();
        const [reviews, setReviews] = useState([]);
        const [vouchers, setVouchers] = useState([]);
        const [tooltipOpen, setTooltipOpen] = useState(null);
        const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewedProducts();
        const [sameCategoryProducts, setSameCategoryProducts] = useState([]);


        const productData = {
            productid: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            promotional_price: product.promotional_price,
            quantity: product.quantity,
            image: product.image,
            category: product.category,
            rating: product.rating,
            count: quantity,
        };
        useEffect(() => {
            const fetchSameCategoryProducts = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/product/getAllProductsByCategory?productid=${product.id}`);
                    setSameCategoryProducts(response.data);
                } catch (error) {
                    console.error('Failed to fetch products with same category:', error);
                }
            }
            fetchSameCategoryProducts()
        }, [product]);

        useEffect(() => {
            // Thêm sản phẩm vào danh sách đã xem
            addToRecentlyViewed(product);
        }, [product]);
        useEffect(() => {
            const fetchReviews = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/getReviews/${product.id}`);
                    setReviews(response.data.data);
                } catch (error) {
                    console.error('Failed to fetch reviews:', error);
                }
            };

            const fetchVouchers = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/getProductVouchers/${product.id}`);
                    setVouchers(response.data);
                } catch (error) {
                    console.error('Failed to fetch vouchers:', error);
                }
            };

            fetchReviews();
            fetchVouchers();
        }, [product.id]);
        const handleSaveVoucher = async (voucherId) => {
            try {
                const response = await axios.get(`http://localhost:8080/getUserVouchers?userid=${loggedUser.userid}`);
                const userVouchers = response.data.data;

                // Kiểm tra nếu voucher đã tồn tại cho sản phẩm hiện tại
                const voucherExists = userVouchers.some(
                    (voucher) => voucher.product_id == product.id && voucher.voucher_id == voucherId
                );
                if (voucherExists) {
                    toast({
                        title: 'You have already collected this voucher',
                        status: 'info',
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    // Thêm mới voucher vào danh sách user vouchers
                    const userVoucher = {
                        user_id: loggedUser.userid,
                        voucher_id: voucherId,
                        product_id: product.id, // Thêm thông tin product_id để liên kết
                    };
                    await axios.post('http://localhost:8080/addUserVoucher', userVoucher);
                    toast({
                        title: 'Voucher is added to your account!',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                }

            } catch (error) {
                toast({
                    title: 'Lỗi khi lưu voucher.',
                    description: 'Vui lòng thử lại sau.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        const handleBuyNowButton = () => {
            setCheck([]);
            setCheck([productData]);
            router.push('/checkout');
        };
        return (
            <>
            <Grid templateColumns={{ base: 'repeat(1,1fr)', lg: 'repeat(2,1fr)' }} w={{ base: '100%', lg: '90%' }} mx='auto' p="2rem" gap="20">
                <GridItem p="1rem">
                    <Image src={product.image} alt={product.name} mx="auto" />
                </GridItem>
                <GridItem p="1rem">
                    <Heading>{product.name}</Heading>
                    <Box mt="2rem">
                        <Text fontWeight="bold">Discount Code:</Text>
                        <Stack direction="row" spacing={2} mt={2}>
                            {vouchers
                                .filter((voucher) => new Date(voucher.end_date) >= new Date()) // Filter vouchers that are not expired
                                .map((voucher) => (
                                    <Tooltip
                                        key={voucher.id}
                                        isOpen={tooltipOpen === voucher.voucher_id}
                                        label={
                                            <Box p="0" bg="white" borderRadius="md" boxShadow="md" border="1px solid" borderColor="gray.200">
                                                <Image src={voucher.image_voucher} boxSize="50px" mb="1rem" />
                                                <Text>Discount: {voucher.discount_value}đ</Text>
                                                <Text>Min Order: {voucher.min_order_value}đ</Text>
                                                <Text>Expires: {new Date(voucher.end_date).toLocaleDateString()}</Text>
                                            </Box>
                                        }
                                        placement="bottom"
                                        bg="white"
                                        color="black"
                                        p="0"
                                        hasArrow
                                    >
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            onClick={() => handleSaveVoucher(voucher.voucher_id)}
                                            onMouseEnter={() => setTooltipOpen(voucher.voucher_id)}
                                            onMouseLeave={() => setTooltipOpen(null)}
                                        >
                                            Discount {voucher.discount_value}đ
                                        </Button>
                                    </Tooltip>
                                ))}
                        </Stack>
                    </Box>
        
                    <ReactStars count={5} value={product.rating} size={18} color2={colors.brand.primary} edit={false} />
                    <Text fontWeight="bold" fontSize="2rem">{product.promotional_price}</Text>
                    <Text fontWeight="bold" fontSize="2rem" textDecoration="line-through">{product.price}</Text>
                    <Divider my="1rem" />
                    <Quantity setQuantity={(value) => setQuantity(value)} disabled={isAdded('cart', product.id)} />
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
                            onClick={handleBuyNowButton}
                        >
                            Buy Now
                        </Button>
                        <AddToCartButton product={product} count={quantity} />
                    </Box>
                    <Stack py="2rem">
                        <Box borderWidth={1} borderColor="gray.100" p="1rem">
                            <Text fontWeight="bold">Free Delivery</Text>
                            <Link textDecor="underline" color="gray.500">
                                Enter Your Postal Code for Delivery Availability
                            </Link>
                        </Box>
                        <Box borderWidth={1} borderColor="gray.100" p="1rem">
                            <Text fontWeight="bold">Return Delivery</Text>
                            <Text color="gray.500">
                                Free 30 Days Delivery Returns <Link textDecor="underline">Details</Link>
                            </Text>
                        </Box>
                    </Stack>
                </GridItem>
            </Grid>
            <Grid
                w={{ base: '100%', lg: '90%' }}
                mx="auto"
                p="2rem"
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                boxShadow="lg"
                bg="white"
            >
                <Heading size="md" mb="4" textAlign="left">
                    Product Details
                </Heading>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
                    <Box>
                        <Text>
                            <b>Translator:</b> {product.translator || 'Updating'}
                        </Text>
                        <Text>
                            <b>Supplier:</b> {product.supplier || 'Updating'}
                        </Text>
                        <Text>
                            <b>Publisher:</b> {product.publisher || 'Updating'}
                        </Text>
                        <Text>
                            <b>Publish Date:</b> {product.published_date || 'Updating'}
                        </Text>
                    </Box>
                    <Box>
                        <Text>
                            <b>Pages:</b> {product.pages || 'Updating'}
                        </Text>
                        <Text>
                            <b>Weight:</b> {product.weight || 'Updating'} grams
                        </Text>
                        <Text>
                            <b>Author:</b>{' '}
                            {Array.isArray(product.author_name) && product.author_name.length > 0
                                ? product.author_name.map((author, index) => (
                                    <span key={index}>
                                        {author.replace(/\r\n/g, '')}
                                        {index < product.author_name.length - 1 && ', '}
                                    </span>
                                ))
                                : 'Updating'}
                        </Text>
                    </Box>
                </Grid>
            </Grid>
        
            <Grid w={{ base: '100%', lg: '90%' }} mx='auto' p="2rem">
                <SectionHeading title="Product Introduction" />
                <Text my="1rem">{product.description}</Text>
            </Grid>
            <Grid w={{ base: '100%', lg: '90%' }} mx='auto' p="2rem">
                <Heading mb={5} textAlign="left">Customer Reviews</Heading>
                {reviews.map((review, index) => (
                    <Review key={index} review={review} />
                ))}
            </Grid>
            {/* <FeaturedProducts title="Related Products" products={featureItems.relatedProducts} /> */}
            <FeaturedProducts title="Products With Same Category" products={sameCategoryProducts} />
        </>
        
        );
    }
};
