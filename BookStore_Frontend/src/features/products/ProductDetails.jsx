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

export const ProductDetails = ({ product }) => {
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
        count: 1,
    };

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
                console.log(response.data)
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
            const userVoucher = {
                user_id: loggedUser.userid, // Replace with actual userId
                voucher_id: voucherId,
            };

            await axios.post('http://localhost:8080/addUserVoucher', userVoucher);
            toast({
                title: 'Voucher đã được lưu vào tài khoản của bạn!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
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
                        <Text fontWeight="bold">Mã giảm giá:</Text>
                        <Stack direction="row" spacing={2} mt={2}>
                            {vouchers
                                .filter((voucher) => new Date(voucher.end_date) >= new Date()) // Lọc những voucher chưa hết hạn
                                .map((voucher) => (
                                    <Tooltip
                                        key={voucher.id}
                                        isOpen={tooltipOpen === voucher.voucher_id}
                                        label={
                                            <Box p="0" bg="white" borderRadius="md" boxShadow="md" border="1px solid" borderColor="gray.200">
                                                <Image src={voucher.image_voucher} boxSize="50px" mb="1rem" />
                                                <Text>Giảm: {voucher.discount_value}đ</Text>
                                                <Text>Đơn tối thiểu: {voucher.min_order_value}đ</Text>
                                                <Text>Hết hạn: {new Date(voucher.end_date).toLocaleDateString()}</Text>
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
                                            Giảm {voucher.discount_value}đ
                                        </Button>
                                    </Tooltip>
                                ))}
                        </Stack>
                    </Box>

                    <ReactStars count={5} value={product.rating} size={18} color2={colors.brand.primary} edit={false} />
                    <Text fontWeight="bold" fontSize="2rem" textDecoration="line-through">{product.price}</Text>
                    <Text fontWeight="bold" fontSize="2rem">{product.promotional_price}</Text>
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
                                Enter Your postal Code for Delivery Availability
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
            <Grid w={{ base: '100%', lg: '90%' }} mx='auto' p="2rem">
                <SectionHeading title="Giới thiệu sản phẩm" />
                <Text my="1rem">{product.description}</Text>
            </Grid>
            <Grid w={{ base: '100%', lg: '90%' }} mx='auto' p="2rem">
                <Heading mb={5} textAlign="left">Customer Reviews</Heading>
                {reviews.map((review, index) => (
                    <Review key={index} review={review} />
                ))}
            </Grid>
            <FeaturedProducts title="Related Products" products={featureItems.relatedProducts} />
        </>
    );
};
