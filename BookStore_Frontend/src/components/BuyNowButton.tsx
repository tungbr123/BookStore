import { Box, Button, Link } from "@chakra-ui/react"


export const BuyNowButton = () => {
    return (
        <Link href="/checkout">
            <Button
                variant="outline"
                borderColor="brand.primary"
                color="brand.primary"
                rounded="full"
                size="sm"
                w="130px" >
                Buy Now
            </Button>
        </Link>

    )
}