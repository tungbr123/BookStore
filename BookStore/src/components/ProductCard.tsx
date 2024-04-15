import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react"
import { Rating } from "./Rating"
import { AddToCartButton } from "./AddToCartButton"
import { BuyNowButton } from "./BuyNowButton"


export const ProductCard = () => {
    return (
        <Card w="xs" pos="relative" m="0.5rem">
            <CardBody >
                <Image
                    src='sherlockholmes.jpg'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    h="200"
                    w="100%"
                />
                <Stack mt='6' spacing='3'>
                    <Flex justify="space-between" text-align="center" >
                        <Heading size="md">Sherlock Holmes</Heading>
                        <Flex color="brand.primaryDark" fontWeight="bold"></Flex>
                        <Text textDecoration="line-through" fontSize="lg">135000đ</Text>
                    </Flex>
                    <Text>
                        One of the greatest detective books in the world
                    </Text>
                    <Text color='blue.600' fontSize='2xl'>
                        125000đ
                    </Text>
                    <Rating />
                    <Flex justify="space-between" text-align="center" >
                        <BuyNowButton />
                        <Flex color="brand.primaryDark" fontWeight="bold"></Flex>
                        <AddToCartButton />
                    </Flex>
                </Stack>
            </CardBody>
            <Divider />
        </Card>
    )
}