import { Box, Button, Input, InputGroup, InputLeftElement, InputRightAddon } from "@chakra-ui/react"
import { Search2Icon, SearchIcon } from "@chakra-ui/icons"
import { searchInputStyles } from "./style"
import { useState } from "react"
import { useRouter } from "next/navigation"

export const Search = () => {
    const [name, setName] = useState('')

    const handleNameChange = (Event: React.ChangeEvent<HTMLInputElement>) => {
        setName(Event.target.value)
    }
    const router = useRouter()

    const handleSubmit =() =>{
        
        router.push(`/search?name=${name}`); 
    }

    return (
        <Box>
            <InputGroup borderRadius={5} size="sm">
                <InputLeftElement
                    pointerEvents="none"
                    children={<Search2Icon color="gray.600" />}
                />
                <Input value={name} onChange={handleNameChange} type='text'
                    placeholder='Search...'
                    focusBorderColor="brand-primary"
                    borderWidth="1px" 
                    borderColor="gray.400" />
                <InputRightAddon
                    p={0}
                    border="none"
                >
                    <Button onClick={handleSubmit} size="sm" borderLeftRadius={0} borderRightRadius={3.3} border="1px solid #949494">
                    Search
                </Button>
            </InputRightAddon>
        </InputGroup>
        </Box >
    )
}