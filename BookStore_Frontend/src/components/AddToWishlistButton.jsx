import { Button } from '@chakra-ui/react';

import { IProduct } from '@/model';
import React, { useContext, useEffect } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { AppConText } from '@/context/AppContext';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import showToast from '@/hooks/useToast';
import api from '@/ApiProcess/api';
import { useWishList } from '@/WishlistContext';
import { useRecentlyViewedProducts } from '@/RecentlyViewedProductsContext';
import useCustomToast from '@/hooks/toast';


export const AddToWishlistButton = ({ product }) => {
  const { addItem, removeItem, isAdded } = useContext(AppConText);
  const loggedUser = useSelector((state) => state.auth)
  const router = useRouter()
  const {wishlist, setWishlist, fetchWishlistitem} = useWishList();
  const {recentlyViewed, addToRecentlyViewed } = useRecentlyViewedProducts();
  const toast = useCustomToast(); 
  useEffect(() => {
    if (loggedUser.userid) {      
      fetchWishlistitem();
    }
  }, [loggedUser.userid]);

  const handleAddToWishlist = async () => {

  
    if (!loggedUser.token) {
      router.push('signin');
      return;
    }
    addToRecentlyViewed(product);  
    // Kiểm tra sản phẩm có trong wishlist hay chưa
    const isProductInWishlist = wishlist.some(
      (item) => item.id === product.id
    );
  
    if (isProductInWishlist) {
      toast('This product is already in your wishlist', 1); // type 1 = error
      return;
    }
  
    // Nếu chưa có, thêm sản phẩm vào wishlist
    try {
      const response = await api.post(
        'addToWishlist',
        {
          userid: loggedUser.userid,
          productid: product.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        fetchWishlistitem(); // Cập nhật lại danh sách wishlist
        toast('Added to your wishlist', 0); // type 0 = success
      } else {
        const message = 'Failed to add your wishlist';
        toast(message, 1);
        throw new Error(message);
      }
    } catch (error) {
      toast('An error occurred while adding to wishlist', 1);
    }
  };
  return (
    <>
      {isAdded('wishlist', product.id) ? (
        <Button
          pos="absolute"
          variant="ghost"
          bgColor="transparent"
          color="red.400"
          _hover={{ bgColor: 'transparent' }}
          rounded="full"
          title="Remove from Wishlist"
          onClick={() => removeItem('wishlist', product.id)}
        >
          <BsHeartFill />
        </Button>
      ) : (
        <Button
          pos="absolute"
          variant="ghost"
          bgColor="transparent"
          color="red.400"
          _hover={{ bgColor: 'transparent' }}
          rounded="full"
          title="Add to Wishlist"
          onClick={handleAddToWishlist}
        >
          <BsHeart />
        </Button>
      )}
    </>
  );
};
