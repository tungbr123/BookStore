"use client"
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { send_forgot_password } from '@/ApiProcess/ApiFunction/AuthFunction'

export default function ForgotPasswordForm() {

  const [email, setEmail] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCheckEmail = async () => {
    const forgotPassword = await dispatch(send_forgot_password(email));
    if(forgotPassword){
      router.push('/reset-password')
    }
  }
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Quên mật khẩu?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}>
          Bạn sẽ nhận được một email với đường dẫn để đặt lại mật khẩu của bạn.
        </Text>
        <FormControl id="email">
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            colorScheme='teal'
            onChange={handleEmailChange}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            colorScheme='teal'
            onClick={handleCheckEmail}
            >
            Đặt lại mật khẩu
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}