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
} from '@chakra-ui/react';
import { getSubstring } from '@/helpers';
import { IProduct } from '@/model';
import Link from 'next/link';
import { AddToWishlistButton } from './AddToWishlistButton';

import { Rating } from './Rating';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';
import { AppConText } from '@/context/AppContext';
import { useContext, useState } from 'react';
import ReactStars from 'react-stars';
import { colors } from '@/theme';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { isAdded, addItem, resetItems } = useContext(AppConText);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const quantity1 = 1
  return (
    <Card w="xs" pos="relative" m="0.5rem">
      <AddToWishlistButton product={product} />
      <CardBody>
        <Link href={`/products/${product.id}`}>
          <Box
            bg={`center / contain no-repeat url(${product.mainImage})`}
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
              <Text fontSize="sm">$ </Text>
              <Text fontSize="lg">{product.price}</Text>
            </Flex>
          </Flex>
          <Text fontSize="sm"> {getSubstring(product.description, 30)} </Text>
          <Flex>
            <ReactStars count={5} value={product.rating} size={18} color2={colors.brand.primary} edit={false}></ReactStars>
          </Flex>
          {/* <Rating rating={product.rating} /> */}
          <Flex justify="space-between" text-align="center" >
            <Link href="/checkout">
              <Button
                variant="outline"
                borderColor="brand.primary"
                color="brand.primary"
                borderRadius="50px"
                size="sm"
                w="130px"
                onClick={() => {
                  resetItems('checkout');
                  addItem('checkout', product, quantity1)
                  onClose()
                }}>
                Buy Now
              </Button>
            </Link>
            <Flex color="brand.primaryDark" fontWeight="bold"></Flex>
            <AddToCartButton product={product} />
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};
