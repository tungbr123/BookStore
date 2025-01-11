'use client';

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
  Checkbox,
} from '@chakra-ui/react';

import { calculateItemsTotal } from '@/helpers';
import { useEffect, useRef, useState } from 'react';
import { BsCart4 } from 'react-icons/bs';
import { CartItem } from './CartItem';
import { useCart } from '@/CartContext';
import { useCheckOut } from '@/checkoutContext';
import { useSelector } from 'react-redux';
import api from '@/ApiProcess/api';
import showToast from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import useCustomToast from "@/hooks/toast";

export const Cart = () => {
  const router = useRouter();
  const loggedUser = useSelector((state) => state.auth);
  const { cart, setCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]); // State để lưu sản phẩm được tick
  const [check, setCheck] = useCheckOut();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const toast = useCustomToast();
  const fetchCartItems = async () => {
    try {
      const response = await api.get(`getCartItem?userid=${loggedUser.userid}`);
      if (response.status === 200) {
        setCart(response.data.data || []);
      } else {
        showToast("Failed to get Cartitem");
      }
    } catch (error) {
      showToast("error while getting cart item");
      console.error("Error fetching cart items", error);
    }
  };
  useEffect(() => {
    setSelectedItems((prevSelected) =>
      prevSelected.map((selectedItem) => {
        const updatedItem = cart.find(
          (cartItem) => cartItem.cart_itemid === selectedItem.cart_itemid
        );
        return updatedItem ? updatedItem : null; // Cập nhật hoặc loại bỏ item không tồn tại
      }).filter(Boolean) // Loại bỏ các giá trị null
    );
  }, [cart]);
  const handleClearCart = async () => {
    try {
      const response = await api.delete(`deleteCartitemByUserID?userid=${loggedUser.userid}`);
      if (response.status === 200) {
        fetchCartItems();
        showToast('Cleared cart successfully');
      } else {
        showToast('Failed to clear cart');
      }
    } catch (error) {
      showToast('An error occurred while clearing cart');
      console.error('Error clearing cart', error);
    }
  };

  const handleCheckout = () => {
    setCheck(selectedItems); // Gán các sản phẩm đã chọn vào check
    onClose();
    router.push("/checkout");
  };

  const toggleSelectedItem = (item) => {
    console.log(item)
    setSelectedItems((prev) =>
      prev.some((selected) => selected.cart_itemid === item.cart_itemid)
        ? prev.filter((selected) => selected.cart_itemid !== item.cart_itemid)
        : [...prev, item]
    );
  };

  const isAllChecked = selectedItems.length === cart.length && cart.length > 0; // Kiểm tra nếu tất cả sản phẩm được chọn

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems([...cart]); // Chọn tất cả sản phẩm
    } else {
      setSelectedItems([]); // Bỏ chọn tất cả
    }
  };

  return (
    <>
      <Button
        ref={btnRef}
        onClick={onOpen}
        variant="ghost"
        color="brand.primary"
        _hover={{ bgColor: 'transparent' }}
        pos="relative"
      >
        <BsCart4 /> <Text mx="1">Cart</Text>
        {cart.length !== 0 && (
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
            {cart.length}
          </Flex>
        )}
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color="brand.primary">Cart ({cart.length} Items)</DrawerHeader>
          <DrawerBody>
            {cart.length === 0 ? (
              <>Your Cart is Empty</>
            ) : (
              <>
                {/* Checkbox Chọn tất cả */}
                <Checkbox
                  isChecked={isAllChecked}
                  onChange={handleSelectAll}
                  mb="4"
                  colorScheme="blue"
                >
                  Select All
                </Checkbox>
                {cart.map((item) => (
                  <Flex key={item.cart_itemid} align="center">
                    <Checkbox
                      isChecked={selectedItems.some(
                        (selected) => selected.cart_itemid === item.cart_itemid
                      )}
                      onChange={() => toggleSelectedItem(item)}
                    />
                    <CartItem item={item} userid={loggedUser.userid} />
                  </Flex>
                ))}
              </>
            )}
          </DrawerBody>
          {cart.length !== 0 && (
            <DrawerFooter justifyContent="space-between">
              <Box>
                <Button variant="outline" mr={3} onClick={handleClearCart}>
                  Clear Cart
                </Button>
                <Button
                  bgColor="brand.primary"
                  color="white"
                  _hover={{ bgColor: 'brand.primaryLight' }}
                  _active={{ bgColor: 'brand.primaryLight' }}
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </Box>
              <Box fontWeight="bold">Total: {calculateItemsTotal(selectedItems)}đ</Box>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
