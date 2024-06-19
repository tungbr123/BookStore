import { DeliveryInfoContext } from "@/context"
import showToast from "@/hooks/useToast"
import { Box, Card, CardBody, CardHeader, FormLabel, Heading, Input, Stack } from "@chakra-ui/react"
import {  useContext, useState } from "react"

export const DeliveryInformation = () => {
    const [state, setState] = useContext(DeliveryInfoContext)
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] =useState('')
    const [name, setName] = useState('')
    const handleAddressChange=(e) =>{
        setAddress(e.target.value) 
        setState(prevState => ({ ...prevState, address: e.target.value }));
    }
    const handleNameChange=(e) =>{
        setName(e.target.value) 
        setState(prevState => ({ ...prevState, name: e.target.value }));
    }
    const handlePhoneChange=(e) =>{
        setPhone(e.target.value) 
        setState(prevState => ({ ...prevState, phone: e.target.value }));
    }
    const handleEmailChange=(e) =>{
        setEmail(e.target.value) 
        setState(prevState => ({ ...prevState, email: e.target.value }));
    }
    return (
        <Card borderWidth="1px" borderColor="gray.200" shadow="none">
            <CardHeader>
                <Heading size="md">Delivery Information</Heading>
            </CardHeader>
            <CardBody>
                <Stack spacing="2rem">
                    <Box>
                        <FormLabel>Full Name</FormLabel>
                        <Input onChange={handleNameChange} value={name} type="text" placeholder="Full name" />
                    </Box>

                    <Box>
                        <FormLabel>Address</FormLabel>
                        <Input value={address} onChange={handleAddressChange} type="text" placeholder="address" />
                    </Box>

                    <Box>
                        <FormLabel>Phone</FormLabel>
                        <Input value={phone} onChange={handlePhoneChange} type="text" placeholder="phone number" />
                    </Box>

                    <Box>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" onChange={handleEmailChange} placeholder="email" />
                    </Box>
                </Stack>
            </CardBody>
        </Card>
    )
}