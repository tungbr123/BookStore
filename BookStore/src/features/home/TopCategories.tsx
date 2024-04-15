"use client"
import { SectionHeading } from "@/components/SectionHeading"
import { Box, Card, CardBody, Grid, GridItem, Heading, Image, Text } from "@chakra-ui/react"


export const TopCategories = () => {
    return (
        <Box w={{ base: '100%', lg: '90%' }} mx="auto" py="3rem" px="2rem">
            <SectionHeading title="This is some of our categories" />
            <Grid templateColumns={{base:"repeat(1,1fr)", 
                                    md:"repeat(2, 1fr)", 
                                    lg:"repeat(4, 1fr)" }}>
                <GridItem>
                    <TopCategoriesCard />
                </GridItem>
                <GridItem>
                    <TopCategoriesCard />
                </GridItem>
                <GridItem>
                    <TopCategoriesCard />
                </GridItem>
                <GridItem>
                    <TopCategoriesCard />
                </GridItem>
            </Grid>
        </Box>
    )
}

const TopCategoriesCard = () => {
    return (
        <Card direction="row" 
            align="center" 
            overflow="hidden" 
            variant="outline" 
            w="100%"
            _hover={{cursor:"pointer", bgColor:"gray.100"}}>
            <Image src="sachgiaokhoa.jpg" alt="" w={100} h={100} />
            <CardBody>
                <Heading size={{base:'sm', lg:'md'}}>Sách giáo khoa</Heading>
            </CardBody>
        </Card>
    )
}