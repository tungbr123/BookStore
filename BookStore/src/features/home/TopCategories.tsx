"use client"
import { SectionHeading } from "@/components/SectionHeading"
import { ICategory } from "@/model"
import { Box, Card, CardBody, Grid, GridItem, Heading, Image, Text } from "@chakra-ui/react"

interface ICategoriesProps {
    categories: ICategory[]
}

export const TopCategories = ({ categories }: ICategoriesProps) => {
    return (
        <Box w={{ base: '100%', lg: '90%' }} mx="auto" py="3rem" px="2rem">
            <SectionHeading title="This is some of our categories" />
            <Grid templateColumns={{
                base: "repeat(1,1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)"
            }}>
                {
                    categories.map((category) => (
                        <GridItem key={category.id}>
                            <TopCategoriesCard category={category} />
                        </GridItem>
                    ))
                }
            </Grid>
        </Box>
    )
}

interface ITopCategoryCardProps {
    category: ICategory
}

export const TopCategoriesCard = ({category}: ITopCategoryCardProps) => {
    return (
        <Card direction="row"
            align="center"
            overflow="hidden"
            variant="outline"
            w="100%"
            _hover={{ cursor: "pointer", bgColor: "gray.100" }}>
            <Image src={category.image} alt={category.name} w={100} h={100} />
            <CardBody>
                <Heading size={{ base: 'sm', lg: 'md' }}>{category.name}</Heading>
            </CardBody>
        </Card>
    )
}