'use client';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { getSubstring } from '@/helpers';
import { ICategory, IProduct } from '@/model';
import Link from 'next/link';

import axios from 'axios';
import { Rating } from './Rating';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';
import { AppConText } from '@/context/AppContext';
import { useContext, useState } from 'react';
import ReactStars from 'react-stars';
import { colors } from '@/theme';
import { useCheckOut } from '@/checkoutContext';
import { useRouter } from 'next/navigation';
import { AddToWishlistButton } from './AddToWishlistButton';
import { useRecentlyViewedProducts } from '@/RecentlyViewedProductsContext';

interface ProductCardProps {
  product: IProduct;
}
interface ProductBuyNow {
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

export const ProductCard = ({ product }: ProductCardProps) => {
  const { isAdded, addItem, resetItems } = useContext(AppConText);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const quantity1 = 1;
  const [check, setCheck] = useCheckOut()
  const router = useRouter();
  const toast = useToast();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewedProducts();
  const product1: ProductBuyNow =
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
  const handleBuyNowButton = () => {
    addToRecentlyViewed(product)
    setCheck([])
    setCheck([product1])
    router.push('checkout')
  }
  // Handler function for Claim Voucher button

  return (
    <Card w="xs" pos="relative" m="0.5rem">
      <AddToWishlistButton product={product} />
      <CardBody>
        <Link href={`/products/${product.id}`}>
          <Box
            bg={`center / contain no-repeat url(${product.image})`}
            borderRadius="lg"
            boxSize="200px"
            mx="auto"
          />
        </Link>
        <Stack mt="6" spacing="3">
          <Flex justify="space-between" align="center">
            <Link href={`/products/${product.id}`}>
              <Heading size="sm">{getSubstring(product.name, 20)}</Heading>
            </Link>
            <Flex color="brand.primaryDark" fontWeight="bold">
              <Text fontSize="lg">{product.promotional_price}</Text>
              <Text fontSize="sm">đ</Text>
            </Flex>
          </Flex>
          
          <Flex justify="space-between" align="center">
          <ReactStars count={5} value={product.rating} size={18} color2={colors.brand.primary} edit={false}></ReactStars>
            <Flex color="brand.primaryDark" fontWeight="bold">
              <Text fontSize="lg" textDecoration="line-through">{product.price} </Text>
              <Text fontSize="sm">đ</Text>
            </Flex>
          </Flex>

          <Text fontSize="sm"> {getSubstring(product.description, 30)} </Text>
          {/* <Rating rating={product.rating} /> */}
          <Flex justify="space-between" text-align="center" >
            {/* <Link href="/checkout"> */}
            <Button
              variant="outline"
              borderColor="brand.primary"
              color="brand.primary"
              borderRadius="50px"
              size="sm"
              w="130px"
              onClick={handleBuyNowButton}>
              Buy Now
            </Button>
            {/* </Link> */}
            <Flex color="brand.primaryDark" fontWeight="bold"></Flex>
            <AddToCartButton product={product} count={1} />
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};
