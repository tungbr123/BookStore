import { Box, Flex, Stack, Link, Button } from "@chakra-ui/react"
import { cartSectionStyles, desktopNavStyles, logoSectionStyles } from "./style"
import { AppLogo } from "../AppLogo"
import { navItems } from "@/helpers"
import { Search } from "../Search/Search"
import { Wishlist } from "../Wishlist/Wishlist"
import { Cart } from "../Cart/Cart"


export const DesktopNav = () => {
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
            <Stack direction="row" spacing={2} >
                <Button as={"a"} fontSize={"sm"} variant={"link"} href="signin">
                    Sign In
                </Button>
                <Button as={"a"}
                display={{base:"none", md: "inline-flex"}} 
                fontSize={"sm"}
                href="signup"
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                _hover={{bg:"pink.300"}}>
                    Sign Up
                </Button>
            </Stack>
            <Stack direction="row" spacing={2} >
                <Wishlist />
                <Cart />
            </Stack>
        </Flex>
    )
}