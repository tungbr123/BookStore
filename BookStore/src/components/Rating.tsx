import { colors } from "@/app/theme"
import { Flex, Text } from "@chakra-ui/react"
import ReactStars from "react-stars"

export const Rating=() =>{
    return(
        <Flex>
            <ReactStars count={5} value={3.5} size={18} color2={colors.brand.primary} edit={false}></ReactStars>
            <Text>200</Text>
        </Flex>
    )
}