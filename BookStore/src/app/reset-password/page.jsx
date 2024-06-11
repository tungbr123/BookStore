'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reset_password } from '@/ApiProcess/ApiFunction/AuthFunction';

export default function ResetPasswordForm() {

  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  }
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  }

  const handleResetPassword = async () => {
    const resetPassword = await dispatch(reset_password(code, newPassword));
    if(resetPassword){
      router.push('/signin')
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
          Nhập mật khẩu mới
        </Heading>
        <FormControl id="password" isRequired>
          <FormLabel>Mật khẩu</FormLabel>
          <Input type="password" value={newPassword} onChange={handleNewPasswordChange}/>
        </FormControl>
        <FormControl id="code" isRequired>
          <FormLabel>Code</FormLabel>
          <Input type="text" value={code} onChange={handleCodeChange}/>
        </FormControl>
        <Stack spacing={6}>
          <Button
            colorScheme='teal'
            onClick={handleResetPassword}
          >
            Xác nhận đặt lại
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}