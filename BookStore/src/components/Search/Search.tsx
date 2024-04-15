import { Box, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import {SearchIcon} from "@chakra-ui/icons"
import { searchInputStyles } from "./style"

export const Search = () => {
    return (
        <Box>
            <InputGroup size="sm" w={{base:"100%", lg: "32em"}}>
                <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.400' />
                </InputLeftElement>
                <Input {... searchInputStyles} />
            </InputGroup>
        </Box>
    )
}