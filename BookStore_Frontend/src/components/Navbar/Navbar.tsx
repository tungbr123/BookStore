import { Box } from "@chakra-ui/react"
import { navbarStyles } from "./style"
import { DesktopNav } from "./DesktopNav.jsx"
import { MobileNav } from "./MobileNav"
import { AdminNav } from "./LayoutAdmin"



export const Navbar = () => {
    return (
        <Box className="navbar-wrapper" h="120px">
            <Box {...navbarStyles}>
                <DesktopNav />
                <MobileNav />
            </Box>
        </Box>
    )
}
