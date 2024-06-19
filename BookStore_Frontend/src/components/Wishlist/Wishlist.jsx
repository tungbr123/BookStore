import {
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';

import { useContext, useEffect, useState } from 'react';
import { BsHeart } from 'react-icons/bs';
import { WishlistItem } from './WishlistItem';
import { AppConText } from '@/context/AppContext';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '@/ApiProcess/api';
import showToast from '@/hooks/useToast';

export const Wishlist = () => {
  const router = useRouter()
  const loggedUser = useSelector((state) => state.auth);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (loggedUser.userid) {
      const fetchWishlistitem = async () => {
        try {
          const response = await api.get(`getWishlist?userid=${loggedUser.userid}`, {}, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 200) {
            const data = response.data.data
            if (Array.isArray(data)) {
              setWishlist(data); // Assuming you have a setCart function
            }
            else
              console.log(data)

          } else {
            showToast("Lấy thất bại");
            setWishlist([])
          }
        } catch (error) {
          showToast("Lỗi khi lấy Wishlistitem");
          console.error("Error fetching cart items", error);
          setWishlist([])
        };
      }
      fetchWishlistitem();
    }
  }, [loggedUser.userid, wishlist, setWishlist]);

  const handleClearWishlist = async () => {
    try {
      const response = await api.delete(`clearAllWishlist?userId=${loggedUser.userid}`);
      if (response.status === 200) {
        setWishlist([]); // Clear local state
      } 
    } catch (error) {
      showToast('An error occurred while clearing wishlist');
      console.error('Error clearing wishlist', error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          color="brand.primary"
          variant="ghost"
          _hover={{
            bgColor: 'transparent',
          }}
          pos="relative"
        >
          <BsHeart size="0.9rem" /> <Text mx="1">Wishlist</Text>
          {wishlist.length !== 0 && (
            <Flex
              pos="absolute"
              top="0px"
              right="5px"
              bgColor="brand.primaryLight"
              boxSize="15px"
              rounded="full"
              color="white"
              fontSize="0.6rem"
              align="center"
              justify="center"
            >
              {wishlist.length}
            </Flex>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader color="brand.primary" fontWeight="bold">
          Wishlist
        </PopoverHeader>
        <PopoverBody p="1rem">
          {wishlist.length === 0 ? (
            <>Your Wishlist is Empty</>
          ) : (
            wishlist.map((item) => <WishlistItem key={item.id} item={item} />)
          )}
        </PopoverBody>
        <PopoverFooter>
          {wishlist.length !== 0 && (
            <Button
              variant="outline"
              mr={3}
              onClick={handleClearWishlist}
            >
              Clear Wishlist
            </Button>
          )}
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
