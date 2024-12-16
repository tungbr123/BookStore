"use client";

import React, { useEffect, useState } from 'react';
import { Box, Flex, Stack, Link, Button, useDisclosure, HStack, Text, Menu, MenuButton, MenuList, MenuItem, useColorModeValue } from "@chakra-ui/react";
import { cartSectionStyles, desktopNavStyles, logoSectionStyles } from "./style";
import { AppLogo } from "../AppLogo";
import { navItems } from "@/helpers";
import { navCategories } from "@/helpers";
import { Search } from "../Search/Search";
import { Wishlist } from "../Wishlist/Wishlist";
import { Cart } from "../Cart/Cart";
import { CategoryMenu } from "../Category/CategoryMenu";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '@/ApiProcess/ApiFunction/AuthFunction';
import showToast from '@/hooks/useToast';

export function DesktopNav() {
    const { isOpen, onToggle } = useDisclosure();
    const isLoggedIn = useSelector((state) => state.auth);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <Flex  {...desktopNavStyles}>
            <Stack {...logoSectionStyles}>
                <Box>
                    <AppLogo></AppLogo>
                </Box>

                {navItems.map((navItem) => (
                    <Box key={navItem.label}>
                        <Link href={navItem.href}>{navItem.label}</Link>
                    </Box>
                ))}
                <Box><CategoryMenu/></Box>
                <Box><Search /></Box>
            </Stack>
            <Stack
                direction="row"
                spacing={5}
                alignItems="center"
                justify={{ base: 'center', md: 'end' }}
            >
                {isClient && (isLoggedIn.token ? <LoggedInSection /> : <SignupSection />)}
                {/* Color Mode Switcher */}
            </Stack>
            <Stack direction="row" spacing={2} >
                <Wishlist />
                <Cart />
            </Stack>
        </Flex>
    )
}

const LoggedInSection = () => {
    const isLoggedIn = useSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logout(auth.token));
        router.push('/')
    };

    const handleProfile = () => {
        router.push('/profile/user');
    };

    const handlePurchaseHistory = () => {
        router.push('/profile/order');
    };
    const handleAddress = () => {
        router.push('/profile/address');
    };
    const handleVoucherStorage = () => {
        router.push('/profile/voucher');
    };
    const handleChangePassword = () => {
        router.push('/forgot-password');
    };
    const handleAdmin = () => {
        router.push('/admin/orders');
    };

    return (
        <Menu>
            <MenuButton as={Button} colorScheme="teal">
                <Flex alignItems="center">
                    <Text margin={'0 0 2px 5px'} color="black">
                        {isLoggedIn.user}
                    </Text>
                </Flex>
            </MenuButton>
            <MenuList>
                {isLoggedIn.role == 1 && (
                    <MenuItem onClick={handleAdmin}>Admin Dashboard</MenuItem>)}
                <MenuItem onClick={handleProfile}>Profile Management</MenuItem>
                <MenuItem onClick={handleAddress}>Address Management</MenuItem>
                <MenuItem onClick={handlePurchaseHistory}>Order History</MenuItem>
                <MenuItem onClick={handleVoucherStorage}>Your Voucher</MenuItem>
                <MenuItem onClick={handleChangePassword}>Change Your Password</MenuItem>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </MenuList>
        </Menu>
    );
}

const SignupSection = () => {
    const router = useRouter();

    return (

        <HStack spacing={3}>
            <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                w="100%"
                colorScheme="teal"
                variant="outline"
                onClick={() => {
                    router.push('/signin')
                }}
            >
                Sign In
            </Button>
            <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                w="100%"
                colorScheme="teal"
                onClick={() => {
                    router.push('/signup')
                }}
            >
                Sign Up
            </Button>
        </HStack>

    )
}
