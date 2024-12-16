'use client';
import { AppConText } from '@/context/AppContext';
import {
  Button,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';

import { IItem } from '@/model';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import api from '@/ApiProcess/api';
import showToast from '@/hooks/useToast';
import { useCart } from '@/CartContext';

// interface CartItemProps {
//   item: IItem;
// }

export const CartItem = ({ item , userid}) => {
  const [count, setCount] = useState(item.count);
  const { cart, setCart, updateItemCount } = useCart();

const fetchCartItems = async () => {
    try {
      const response = await api.get(`getCartItem?userid=${userid}`, {}, {
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
  

  const increaseCount = () => {
    setCount(count + 1);
    updateItemCount(item.cart_itemid, count + 1);
  };

  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1);
      updateItemCount(item.cart_itemid, count - 1);
    }
  };
  const handleRemoveItem = async (id) => {
    try {
      const response = await api.delete(`deleteCartItem?cartItemid=${id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        }
      },)
      fetchCartItems();
    } catch (error) {
      showToast("Có lỗi khi xóa")
    }
  }
  const handleCheckboxChange = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
    if (e.target.checked) {
      setCheck((prev) => [...prev, item]); // Thêm sản phẩm vào danh sách
    } else {
      setCheck((prev) => prev.filter((checkedItem) => checkedItem.cart_itemid !== item.cart_itemid)); // Xóa sản phẩm khỏi danh sách
    }
  };
  return (
    <Grid
      alignItems="center"
      templateColumns={{ base: 'repeat(6, 1fr)', lg: 'repeat(8, 1fr)' }}
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      my="2"
    >
      <GridItem>
          <Image
            src={item.image}
            boxSize="40px"
            rounded="full"
            borderWidth="1px"
            borderColor="gray.300"
          />
      </GridItem>
      <GridItem colSpan={{ base: 5, lg: 3 }}>
        <Link href={`/products/${item.productid}`}>
          <Text>{item.product_name}</Text>
        </Link>
      </GridItem>
      <GridItem colSpan={{ base: 3, lg: 2 }} justifyContent="flex-end">
        <HStack my="0.5rem" justifyContent="flex-end">
          <Button onClick={decreaseCount}>-</Button>
          <Input
            type="number"
            value={item.count}
            readOnly={true}
            minW="52px"
            maxW="55px"
            min="1"
            max="20"
          />
          <Button onClick={increaseCount}>+</Button>
        </HStack>
      </GridItem>
      <GridItem textAlign="right" colSpan={{ base: 2, lg: 1 }}>
        <Text fontWeight="bold">{item.promotional_price * item.count}</Text>
      </GridItem>
      <GridItem textAlign="right">
        <Button
          variant="ghost"
          colorScheme="red"
          onClick={() => handleRemoveItem(item.cart_itemid)}
        >
          <BsTrash />
        </Button>
      </GridItem>
    </Grid>
  );
};
