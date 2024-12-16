import { AppConText } from "@/context/AppContext"

import { Box, Card, CardBody, CardHeader, Flex, Heading, Image, Text } from "@chakra-ui/react"
import { useContext } from "react"
import {useCart} from  "@/CartContext"
import {getSubstring} from "@/helpers"
import { useCheckOut } from "@/checkoutContext"

export const ReviewItems = () => {
    // const {
    //     state: { checkout },
    // } = useContext(AppConText)
    const [checkout,setCheckout]  = useCheckOut();
    return (
        <Card borderWidth="1px" borderColor="gray.200" shadow="none">
            <CardHeader>
                <Heading size="md">Review Items</Heading>
            </CardHeader>
            <CardBody>
                {
                    checkout.map((item) => (
                        <Flex key={item.id} align="center" justify="space-between">
                            <Flex align="center">
                                <Image src={item.image} alt={item.product_name} boxSize="100px" bgSize="contain" />
                                <Box mx="1rem">
                                    <Text
                                        fontWeight="bold"
                                        fontSize={{ base: 'sm', lg: 'lg' }}
                                        maxW="500px"
                                    >
                                        {item.name}
                                    </Text>
                                    <Text color="gray.500">
                                        {getSubstring(item.descripttion,50)}
                                    </Text>
                                </Box>
                            </Flex>
                            <Box textAlign="right">
                                <Text fontWeight="bold" fontSize={{ base: 'md', lg: 'lg' }}>
                                    {item.promotional_price}
                                </Text>
                                <Text fontSize={{ base: 'sm', lg: 'md' }}>
                                    Quantity: {item.count}
                                </Text>
                            </Box>
                        </Flex>
                    ))
                }
            </CardBody>
        </Card>
    )
}