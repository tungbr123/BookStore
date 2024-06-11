"use client";

import React, { useEffect, useState } from 'react';
import { Box, Flex, Stack, Link, Button, useDisclosure, HStack, Text, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { cartSectionStyles, desktopNavStyles, logoSectionStyles } from "./style";
import { AppLogo } from "../AppLogo";
import { navItems } from "@/helpers";
import { Search } from "../Search/Search";
import { Wishlist } from "../Wishlist/Wishlist";
import { Cart } from "../Cart/Cart";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '@/ApiProcess/ApiFunction/AuthFunction';

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
                {isLoggedIn.user.role === 1 && (
                <MenuItem onClick={handleAdmin}>Trang chủ Admin</MenuItem>)}
                <MenuItem onClick={handleProfile}>Quản lí hồ sơ</MenuItem>
                <MenuItem onClick={handlePurchaseHistory}>Lịch sử mua hàng</MenuItem>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </MenuList>
        </Menu>
    );
}

const SignupSection = () => {
    const router = useRouter();

    return (
        <>
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
                    Đăng nhập
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
                    Đăng ký
                </Button>
            </HStack>
        </>
    )
}
