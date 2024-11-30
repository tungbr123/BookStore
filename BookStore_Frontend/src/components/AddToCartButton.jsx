'use client';
import { Button } from '@chakra-ui/react';
import { IProduct } from '@/model';
import React, { useContext, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { StateLink } from 'sanity/router';
import { useRouter } from 'next/navigation';
import showToast from '@/hooks/useToast';
import { AppConText } from '@/context/AppContext';
import api from '@/ApiProcess/api';
import { useCart } from '@/CartContext';


// interface IAddToCartButtonProps {
//   product: IProduct;
//   count?: number;
// }
export const AddToCartButton = ({ product, count }) => {
  const { addItem, removeItem, isAdded } = useContext(AppConText);
  const {cart, setCart, updateItemCount} = useCart();
  const loggedUser = useSelector((state) => state.auth)
  const router = useRouter();

  const handleAddToCart = async () => {
    if (loggedUser.token) {
      try {
        const responseCart = await api.get(`getCartID?userid=${loggedUser.userid}`, {
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (responseCart.status == 200) {
          const data = await responseCart.data
          var cartid= data.data;
        }
        const responseAddToCart = await api.post('cartItem', {
          cartid: cartid,
          productid: product.id,
          count: countn
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (responseCart.status === 200) {
          showToast('Đã thêm vào giỏ hàng thành công');
        } else {
          const message = 'Thêm giỏ hàng thất bại';
          showToast(message, 1);
          throw new Error(message);
        }
      } catch (error) {

        const message = 'Đã xảy ra lỗi, vui lòng thử lại';
        showToast(message, 1);
      }
    }
    else
      router.push('signin')

  }
  return (
    <>
      {isAdded('cart', product.id) ? (
        <Button
          variant="outline"
          borderColor="gray.200"
          color="gray.500"
          borderRadius="50px"
          size="sm"
          w="150px"
          onClick={() => removeItem('cart', product.id)}
        >
          Remove from cart
        </Button>
      ) : (
        <Button
          variant="outline"
          borderColor="brand.primary"
          color="brand.primary"
          borderRadius="50px"
          size="sm"
          w="150px"
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
      )}
    </>
  );
};
