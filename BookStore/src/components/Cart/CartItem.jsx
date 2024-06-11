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

// interface CartItemProps {
//   item: IItem;
// }

export const CartItem = ({ item }) => {
  const [count, setCount] = useState(item.count);

  useEffect(() => {
    item.count=count; // Synchronize count with item.count when it changes
  }, [item.count]);

  const increaseCount = () => {
    setCount(count + 1);
    showToast(count)
  };

  const decreaseCount = () => {
    if (count > 1) {
      setCount(prevCount => prevCount - 1);
      showToast(count)
    }
  };
  const handleRemoveItem = async (id) => {
    try {
      const response = await api.delete(`deleteCartItem?cartItemid=${id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        }
      },)
      if (response.status == 200) {
        showToast("Xóa thành công")
      }
    } catch (error) {
      showToast("Có lỗi khi xóa")
    }
  }
  return (
    <Grid
      alignItems="center"
      templateColumns={{ base: 'repeat(6, 1fr)', lg: 'repeat(8, 1fr)' }}
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      my="2"
    >
      <GridItem>
        <Link href={`/products/${item.product_name}`}>
          <Image
            src={item.image}
            boxSize="40px"
            rounded="full"
            borderWidth="1px"
            borderColor="gray.300"
          />
        </Link>
      </GridItem>
      <GridItem colSpan={{ base: 5, lg: 3 }}>
        <Link href={`/products/${item.product_name}`}>
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
        <Text fontWeight="bold">{item.price * item.count}</Text>
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
