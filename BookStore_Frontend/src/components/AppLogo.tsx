import { Link, Text } from "@chakra-ui/react"


export const AppLogo = () => {
    return (
        <Link href="/">
            <Text color="gray.800" fontWeight="bold">
                Book
                <Text as="span" color="brand.primary">
                    Store
                </Text>
            </Text>
        </Link>
    )
}