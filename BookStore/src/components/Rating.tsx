import { colors } from "@/app/theme"
import { IRating } from "@/model";
import { Flex, Text } from "@chakra-ui/react"
import ReactStars from "react-stars"

interface IRatingProps {
    rating: IRating; 
}


export const Rating=({rating} : IRatingProps) =>{
    return(
        <Flex>
            <ReactStars count={5} value={rating.rate} size={18} color2={colors.brand.primary} edit={false}></ReactStars>
        </Flex>
    )
}