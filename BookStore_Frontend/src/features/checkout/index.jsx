'use client'
import { Box, Flex, Stack } from "@chakra-ui/react"
import { DeliveryInformation } from "./DeliveryInformation"
import { PaymentDetails } from "./PaymentDetails"
import { ReviewItems } from "./ReviewItems"

export const CheckOut = () => {
    return (
        <Flex w={{ base: '100%', lg: '90%' }} mx='auto' flexDir={{base:'column', lg:'row'}} gap="2rem">
            <Stack spacing={10} w={{base: '100%',lg:'60%'}}>
                <ReviewItems  />
                <DeliveryInformation />              
            </Stack>
            <Box w= {{base:'100%', lg: '40%'}}>
                <PaymentDetails />
            </Box>
        </Flex>
    )
}   