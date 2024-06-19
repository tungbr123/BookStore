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


// interface IAddToCartButtonProps {
//   product: IProduct;
//   count?: number;
// }
export const AddToCartButton = ({ product, count }) => {
  const { addItem, removeItem, isAdded } = useContext(AppConText);
  const loggedUser = useSelector((state) => state.auth)
  const router = useRouter()
  const handleAddToCart = async () => {
    if (loggedUser.token) {
      // showToast(loggedUser.userid)
      // addItem('cart', product, count)
      try {
        // Gọi API đăng nhập bên client
        const responseCart = await api.get(`getCartID?userid=${loggedUser.userid}`, {
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (responseCart.status == 200) {
          const data = await responseCart.data
          var cartid = data.data
          // showToast("Lấy ID cart thành công")
        }
        // showToast(product.id)
        // showToast(count)
        const responseAddToCart = await api.post('cartItem', {
          cartid: cartid,
          productid: product.id,
          count: count
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });


        if (responseCart.status === 200) {
          // console.log(data.data?.user);
          // localStorage.setItem('user', JSON.stringify(data.data?.user));
          showToast('Đã thêm vào giỏ hàng thành công');
          // return true;
        } else {
          const message = 'Thêm giỏ hàng thất bại';
          showToast(message, 1);
          throw new Error(message);
        }
      } catch (error) {

        const message = 'Đã xảy ra lỗi, vui lòng thử lại';
        showToast(message, 1);
        // return false;
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
