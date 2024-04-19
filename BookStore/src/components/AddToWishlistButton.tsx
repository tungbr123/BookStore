import { Button } from '@chakra-ui/react';

import { IProduct } from '@/model';
import React, { useContext } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { AppConText } from '@/context/AppContext';

interface IAddToWishlistButtonProps {
  product: IProduct;
}

export const AddToWishlistButton = ({ product }: IAddToWishlistButtonProps) => {
  const { addItem, removeItem, isAdded } = useContext(AppConText);

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
          onClick={() => addItem('wishlist', product)}
        >
          <BsHeart />
        </Button>
      )}
    </>
  );
};
