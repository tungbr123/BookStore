"use client"
import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react"
import { bannerHeadingStyles, bannerStyles, bannerTextStyles } from "./style"


export const Banner=() =>{
    return(
        <Flex {...bannerStyles}>
            <Box w={{base:'100%', lg:'50%'}}>
                <Heading {...bannerHeadingStyles} py="1rem" maxW="600px">
                    Online Shopping <br /> Made easy
                </Heading>
                <Text {...bannerTextStyles}>This is the bookstore where you can buy anything that you love. 
                We always provide a wide range of products to meet the a wide variety of customer's demands </Text>
                <Link href="/products">
                    <Button rounded="full"
                            minW="10rem"
                            bgColor="brand.primary"
                            color="white"
                            _hover={{bgColor: "brand.primaryDark"}}>
                            Shop now
                    </Button>
                </Link>
            </Box>
            <Box w={{base:'100%', lg:'50%'}}>
                <Box mx="2rem" 
                     w={{base:'300px', lg:'600px'}}
                     h={{base:'300px', lg:'500px'}}
                     bg="center/ cover no-repeat url(bookstore3.svg)"
                ></Box>
            </Box>
        </Flex>
    )
}