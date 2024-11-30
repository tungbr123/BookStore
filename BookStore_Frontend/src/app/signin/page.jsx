"use client"
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';

import { useRouter } from 'next/navigation'

import { useState, useEffect } from 'react';
import { loginClient } from '@/ApiProcess/ApiFunction/AuthFunction'

import { useDispatch, useSelector } from 'react-redux';
import api from '@/ApiProcess/api';
import showToast from '@/hooks/useToast';
import { BiSolidChevronLeftSquare } from 'react-icons/bi';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const auth = useSelector((state) => state.auth);
  const loggedUser = useSelector((state) => state.auth);
  const toast = useToast()
  const dispatch = useDispatch();
  useEffect(() => {}, [auth]);
  const handleSubmit = async () => {
    const loginAuth = await dispatch(loginClient(email, password));
    if(loginAuth == 1){
      router.push('/admin/orders')
      toast({
        title: 'Đăng nhập thành công',
        description: `Đăng nhập thành công.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    if(loginAuth == 2){
      router.push('/')
      toast({
        title: 'Đăng nhập thành công',
        description: `Đăng nhập thành công.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={handleEmailChange}/>
            </FormControl>
            <FormControl id="password" >
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={handlePasswordChange} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link href='forgot-password' color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button onClick={handleSubmit}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}






  // try {
    //   // Gọi API đăng nhập bên client
    //   const response = await api.post('authenticate', {
    //     email,
    //     password
    //   }, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });


    //   if (response.status === 200) {
    //     const data = await response.data;
    //     // console.log(data.data?.user);
    //     // localStorage.setItem('user', JSON.stringify(data.data?.user));
    //     // dispatch({ type: 'LOGIN_CLIENT_SUCCESS', payload: {
    //     //     token: token,
    //     //     user: data.data.name,
    //     // } });
    //     showToast('Đăng nhập thành công');
    //     console.log(data.data.password)
    //     router.push('/');
    //   } else {
    //     const message = 'Đăng nhập thất bại';
    //     showToast(message, 1);
    //     throw new Error(message);
    //   }
    // } catch (error) {

    //   // dispatch({ type: 'LOGIN_CLIENT_FAILURE', payload: error.message });
    //   const message = 'Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!';
    //   showToast(message, 1);
    //   router.push('/signin');
    // }