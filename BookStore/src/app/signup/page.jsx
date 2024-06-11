"use client"
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation'
import api from '@/ApiProcess/api';
import showToast from '@/hooks/useToast';
import { useDispatch } from 'react-redux';
import { register } from '@/ApiProcess/ApiFunction/AuthFunction';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('')
  const [CMND, setCMND] = useState('')
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const dispatch = useDispatch()
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleCMNDChange = (e) => {
    setCMND(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerAuth = await dispatch(register(firstName, lastName, email, password, CMND, phone));
      if(registerAuth){
        router.push('/signin')
      }
  };
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input value={firstName} onChange={handleFirstNameChange} type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input value={lastName} onChange={handleLastNameChange} type="text" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input value={email} onChange={handleEmailChange} type="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input value={password} onChange={handlePasswordChange} type={showPassword ? 'text' : 'password'} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="CMND" isRequired>
              <FormLabel>CMND</FormLabel>
              <Input value={CMND} onChange={handleCMNDChange} type="text" />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>Phone</FormLabel>
              <Input value={phone} onChange={handlePhoneChange} type="phone" />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button onClick={handleSubmit}
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link href='signin' color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}



// try {
//   // Gọi API đăng nhập bên client
//   const response = await api.post('register', {
//     firstname: firstName,
//     lastname: lastName,
//     email: email,
//     password: password,
//     phone: phone,
//     cmnd: CMND
//   }, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
  
//   if (response.status === 200) {
//     const data = await response.data;
//     const token = data.data.accessToken;
//     dispatch({ type: 'REGISTER_SUCCESS', payload: token });
//     showToast('Đăng kí thành công');
//     router.push('/');
//   } else {
//     const message = 'Đăng kí thất bại';
//     showToast(message, 1);
//     throw new Error(message);
//   }
// } catch (error) {
//   dispatch({ type: 'LOGIN_CLIENT_FAILURE', payload: error });
//   const message = 'Vui lòng kiểm tra thông tin đăng kí!';
//   showToast(message, 1);
//   router.push('/signup');
// }