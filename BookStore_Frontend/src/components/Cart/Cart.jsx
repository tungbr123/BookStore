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
} from '@chakra-ui/react';

import { calculateItemsTotal } from '@/helpers';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { BsCart4 } from 'react-icons/bs';
import { CartItem } from './CartItem';
import { AppConText } from '@/context/AppContext';
import { IContext, IItem, IProduct, IState, ItemKey } from "@/model";
import api from '@/ApiProcess/api';
import { useSelector } from 'react-redux';
import showToast from '@/hooks/useToast';
import { getCartItemByUserID } from "@/ApiProcess/ApiFunction/CartFunction"
import { CartProvider, useCart } from '@/CartContext';
import {CartContext} from '@/CartContext'
import { CheckOutContext, CheckOutProvider, useCheckOut } from '@/checkoutContext';
import { useRouter } from 'next/navigation';
export const Cart = () => {
  // const {
  //   state: { cart },
  //   resetItems,
  //   addItem,
  // } = useContext(AppConText);
  const router = useRouter()
  const loggedUser = useSelector((state) => state.auth);
  const {cart, setCart, updateItemCount} = useCart();
  const [check, setCheck] = useCheckOut();
  const [address, setAddress] = useState([])
  // useEffect(()=>{
  //   setCheck(1)
  //   showToast(check)
  // }, [setCheck])
  // const [check, setCheck] = useCheckOut()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  useEffect(() => {
    if (loggedUser.userid) {
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
              // showToast("Đã lấy cartitem thành công");
              setCart(data); // Assuming you have a setCart function
              // setCheck(data)
              // setCheck(data)
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
      fetchCartItems();
    }
  }, [loggedUser.userid, cart, setCart]); // Add setCart to the dependency array

  const handleCheckout = async() => {
    setCheck(cart)
    router.push("/checkout")
  };
  const handleClearCart = async () => {
    try {
      const response = await api.delete(`deleteCartitemByUserID?userid=${loggedUser.userid}`);
      if (response.status === 200) {
        showToast('Cleared cart successfully');
        // Thực hiện các thao tác cập nhật giao diện sau khi clear cart thành công
      } else {
        showToast('Failed to clear cart');
      }
    } catch (error) {
      showToast('An error occurred while clearing cart');
      console.error('Error clearing cart', error);
    }
  };
  return (
    <>
      <Button
        ref={btnRef}
        onClick={onOpen}
        variant="ghost"
        color="brand.primary"
        _hover={{
          bgColor: 'transparent',
        }}
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
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color="brand.primary">
            Cart ( {cart.length} Items )
          </DrawerHeader>
          <DrawerBody>
            {cart.length === 0 ? (
              <>Your Cart is Empty</>
            ) : (
              cart.map((item) => <CartItem key={item.cart_itemid} item={item} />)
            )}
          </DrawerBody>
          {cart.length !== 0 && (
            <DrawerFooter justifyContent="space-between">
              <Box>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
                {/* <Link href={{
                  pathname: "/checkout",
                }}> */}
                    <Button
                      bgColor="brand.primary"
                      color="white"
                      _hover={{
                        bgColor: 'brand.primaryLight',
                      }}
                      _active={{
                        bgColor: 'brand.primaryLight',
                      }}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </Button>
                {/* </Link> */}
              </Box>
              <Box fontWeight="bold">Total: $ {calculateItemsTotal(cart)}</Box>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
