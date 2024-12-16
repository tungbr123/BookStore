import { Button, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { BsCart, BsCartX, BsTrash } from 'react-icons/bs';
import { useContext } from 'react';
import { AppConText } from '@/context/AppContext';

import api from '@/ApiProcess/api';
import showToast from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { getSubstring } from '@/helpers';
import { useWishList } from '@/WishlistContext';
import { useCart } from '@/CartContext';

export const WishlistItem = ({ item }) => {
  const { addItem, removeItem, isAdded } = useContext(AppConText);
  const router = useRouter();
  const loggedUser = useSelector((state) => state.auth);
  const {wishlist, setWishlist, fetchWishlistitem} = useWishList();
  const {cart, setCart, updateItemCount } = useCart();

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
          const data = await responseCart.data;
          var cartid = data.data;
        }

        const responseAddToCart = await api.post('cartItem', {
          cartid: cartid,
          productid: item.id,
          count: 1
        }, {  
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (responseCart.status === 200) {
          fetchCartItems()
          showToast('Đã thêm vào giỏ hàng thành công');
        } else {
          const message = 'Thêm giỏ hàng thất bại';
          showToast(message);
          throw new Error(message);
        }
      } catch (error) {
        const message = 'Đã xảy ra lỗi, vui lòng thử lại';
        showToast(message);
      }
    } else {
      router.push('signin');
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const response = await api.delete(`removeWishlist?userId=${loggedUser.userid}&productId=${item.id}`);
      fetchWishlistitem()
    } catch (error) {
      showToast('An error occurred while removing from wishlist');
      console.error('Error removing from wishlist', error);
    }
  };

  return (
    <Grid
      alignItems="center"
      templateColumns="repeat(8, 1fr)"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      my="2"
      py="1"
    >
      <GridItem>
        <Link href={`/${item.id}`}>
          <Image
            src={item.image}
            boxSize="20px"
            rounded="full"
            borderWidth="1px"
            borderColor="gray.300"
          />
        </Link>
      </GridItem>
      <GridItem colSpan={4}>
        <Link href={`/${item.id}`}>
          <Text fontSize="sm" title={item.name}>
            {getSubstring(item.name, 17)}
          </Text>
        </Link>
      </GridItem>

      <GridItem>
        <Text fontWeight="bold" fontSize="xs">
          $ {item.price}
        </Text>
      </GridItem>

      <GridItem textAlign="right">
        {isAdded('cart', item.id) ? (
          <Button
            size="xs"
            bgColor="white"
            borderWidth="1px"
            borderColor="gray.300"
            color="gray.500"
            title="Remove from Cart"
            onClick={() => removeItem('cart', item.id)}
          >
            <BsCartX />
          </Button>
        ) : (
          <Button
            size="xs"
            bgColor="white"
            borderWidth="1px"
            borderColor="brand.primary"
            color="brand.primary"
            title="Add to Cart"
            onClick={handleAddToCart}
          >
            <BsCart />
          </Button>
        )}
      </GridItem>

      <GridItem textAlign="right">
        <Button
          variant="ghost"
          colorScheme="red"
          size="xs"
          onClick={handleRemoveFromWishlist}
        >
          <BsTrash />
        </Button>
      </GridItem>
    </Grid>
  );
};
