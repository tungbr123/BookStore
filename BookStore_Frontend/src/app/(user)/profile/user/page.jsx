"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Image,
  useToast,
  VStack,
  HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const loggedUser = useSelector((state) => state.auth); // Assuming the user object is under auth
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    avatar: "",
    cmnd: "",
    email: "",
    phone: "",
  });
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(loggedUser.userid)
        const response = await axios.get(`http://localhost:8080/getUserById`, {
          params: { userid: loggedUser.userid },
        });
        console.log(response.data.data)
        const data = {
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          cmnd: response.data.cmnd,
          phone: response.data.phone,
          email: response.data.email,
          avatar: response.data.avatar
        }
        setUser(data);
        console.log(user)
        toast({
          title: 'Lấy thông tin người dùng thành công',
          description: response.data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      catch (error) {
        console.error('Failed to fetch user:', error);
        toast({
          title: 'Lấy thông tin người dùng thất bại',
          description: 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchUser();
  }, [loggedUser.userid, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ysfhyepr'); // Your upload preset

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dqyfftfrb/image/upload', formData);

      if (response.status === 200) {
        setUser((prevUser) => ({
          ...prevUser,
          avatar: response.data.secure_url, // URL of the uploaded avatar
        }));
        toast({
          title: 'Upload avatar',
          description: 'Avatar đã được tải lên thành công.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Upload avatar thất bại',
          description: 'Đã xảy ra lỗi trong quá trình tải lên avatar.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast({
        title: 'Upload avatar thất bại',
        description: 'Đã xảy ra lỗi trong quá trình tải lên avatar.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/updateUser/${loggedUser.userid}`, user);
      toast({
        title: 'Cập nhật hồ sơ',
        description: 'Thông tin hồ sơ của bạn đã được cập nhật thành công.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to update user profile:', error);
      toast({
        title: 'Cập nhật hồ sơ thất bại',
        description: 'Đã xảy ra lỗi trong quá trình cập nhật hồ sơ.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={4}>
      <Heading size="lg" mb={6}>Chỉnh sửa Hồ sơ</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Họ</FormLabel>
          <Input
            name="firstname"
            value={user.firstname || ''}
            placeholder="Họ"
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Tên</FormLabel>
          <Input
            name="lastname"
            value={user.lastname || ''}
            placeholder="Tên"
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Avatar</FormLabel>
          <HStack spacing={4}>
            <Image
              src={user.avatar || 'https://via.placeholder.com/100'}
              alt="Avatar"
              boxSize="100px"
              borderRadius="full"
              objectFit="cover"
            />
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </HStack>
        </FormControl>
        <FormControl>
          <FormLabel>Số điện thoại</FormLabel>
          <Input
            name="phone"
            value={user.phone || ''}
            placeholder="Số điện thoại"
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>cmnd</FormLabel>
          <Input
            name="cmnd"
            value={user.cmnd || ''}
            placeholder="cmnd"
            onChange={handleInputChange}
          />
        </FormControl>
      </VStack>
      <Button mt={6} colorScheme="teal" onClick={handleSubmit}>Cập nhật Hồ sơ</Button>
    </Container>
  );
};

export default UserProfile;
