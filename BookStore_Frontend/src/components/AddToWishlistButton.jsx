import { Button } from '@chakra-ui/react';

import { IProduct } from '@/model';
import React, { useContext } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { AppConText } from '@/context/AppContext';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import showToast from '@/hooks/useToast';
import api from '@/ApiProcess/api';


export const AddToWishlistButton = ({ product }) => {
  const { addItem, removeItem, isAdded } = useContext(AppConText);
  const loggedUser = useSelector((state) => state.auth)
  const router = useRouter()
  const handleAddToWishlist = async () => {
    if (loggedUser.token) {
      try {
        const response = await api.post('addToWishlist', {
          userid: loggedUser.userid,
          productid: product.id,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });


        if (response.status === 200) {
          showToast('Đã thêm vào yêu thích thành công');
        } else {
          const message = 'Thêm thất bại';
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
