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
import { useRecentlyViewedProducts } from '@/RecentlyViewedProductsContext';


// interface IAddToCartButtonProps {
//   product: IProduct;
//   count?: number;
// }
export const AddToCartButton = ({ product, count }) => {
  const { addItem, removeItem, isAdded } = useContext(AppConText);
  const {cart, setCart, updateItemCount} = useCart();
  const loggedUser = useSelector((state) => state.auth)
  const router = useRouter();
  const {recentlyViewed, addToRecentlyViewed } = useRecentlyViewedProducts();

  const fetchCartItems = async () => {
    try {
      const response = await api.get(`getCartItem?userid=${loggedUser.userid}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = response.data.data
        if (Array.isArray(data)) {
          setCart(data); // Assuming you have a setCart function
        }
        else
          console.log(data)

      } else {
        showToast("Lấy thất bại");
        setCart([])
      }
    } catch (error) {
      showToast("Lỗi khi lấy cartitem");
      console.error("Error fetching cart items", error);
      setCart([])
    };
  }
  
  useEffect(() => {
    if (loggedUser.userid) {
      fetchCartItems();
    }
  }, [loggedUser.userid]); // Add setCart to the dependency array

  const handleAddToCart = async () => {
    addToRecentlyViewed(product)
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
          count: count
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (responseCart.status === 200) {
          fetchCartItems();
          showToast('Đã thêm vào giỏ hàng thành công');
        } else {
          const message = 'Thêm giỏ hàng thất bại';
          showToast(message);
          throw new Error(message);
        }
      } catch (error) {

        const message = 'Đã xảy ra lỗi, vui lòng thử lại';
        showToast(message + error);
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
