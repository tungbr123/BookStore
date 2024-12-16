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
import { BiPhoneCall } from 'react-icons/bi';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('')
  const [CMND, setCMND] = useState('')
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

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
    if (validateForm()) {
      const registerAuth = await dispatch(register(firstName, lastName, email, password, phone, CMND));
      if(registerAuth){
        router.push('/signin')
      }
    }

  
  };
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra trường hợp để trống
    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!password.trim()) newErrors.password = 'Password is required.';
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    }
    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
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
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" />
              {errors.firstName && (
                <Text color="red.500" fontSize="sm">{errors.firstName}</Text>
              )}
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input value={lastName} onChange={handleLastNameChange} type="text" />
                  {errors.lastName && (
                <Text color="red.500" fontSize="sm">{errors.lastName}</Text>
              )}
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
              {errors.email && (
                <Text color="red.500" fontSize="sm">{errors.email}</Text>
              )}
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
              {errors.password && (
                <Text color="red.500" fontSize="sm">{errors.password}</Text>
              )}
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
              <Input value={CMND} onChange={(e) => setCMND(e.target.value)} type="text" />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>Phone</FormLabel>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" />
              {errors.phone && (
                <Text color="red.500" fontSize="sm">{errors.phone}</Text>
              )}
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