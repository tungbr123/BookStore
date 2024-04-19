import { Box, Flex, Stack, Link } from "@chakra-ui/react"
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
                <Wishlist />
                <Cart />
            </Stack>
        </Flex>
    )
}