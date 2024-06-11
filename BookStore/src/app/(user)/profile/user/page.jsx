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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const loggedUser = useSelector((state) => state.auth.user); // Assuming the user object is under auth
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserById`, {
          params: { userid: loggedUser.userid },
        });

        if (response.data.statusCode === "200") {
          setUser(response.data.data);
          setAddresses(response.data.data.addresses || []);
        } else {
          toast({
            title: 'Lấy thông tin người dùng thất bại',
            description: response.data.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
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

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleAddOrEditAddress = () => {
    if (
      editingAddress.city.trim() &&
      editingAddress.district.trim() &&
      editingAddress.ward.trim() &&
      editingAddress.street.trim() &&
      editingAddress.apart_num.trim()
    ) {
      if (editingAddress.index !== undefined) {
        setAddresses((prevAddresses) =>
          prevAddresses.map((addr, idx) =>
            idx === editingAddress.index ? editingAddress : addr
          )
        );
      } else {
        setAddresses((prevAddresses) => [...prevAddresses, editingAddress]);
      }
      setEditingAddress(null);
      onClose();
    } else {
      toast({
        title: 'Thông tin địa chỉ không hợp lệ',
        description: 'Vui lòng nhập đầy đủ thông tin địa chỉ.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveAddress = (index) => {
    setAddresses((prevAddresses) => prevAddresses.filter((_, i) => i !== index));
  };

  const handleEditAddress = (index) => {
    setEditingAddress({ ...addresses[index], index });
    onOpen();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/uploadAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.statusCode === "200") {
        setUser((prevUser) => ({
          ...prevUser,
          avatar: response.data.data, // Assuming the URL of the uploaded avatar is returned
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
          description: response.data.message,
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
      const response = await axios.put(`http://localhost:8080/updateUser/${user.id}`, {
        ...user,
        addresses,
      });

      if (response.data.statusCode === "200") {
        toast({
          title: 'Cập nhật hồ sơ',
          description: 'Thông tin hồ sơ của bạn đã được cập nhật thành công.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Cập nhật hồ sơ thất bại',
          description: response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
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
          <FormLabel>CMND</FormLabel>
          <Input
            name="cmnd"
            value={user.cmnd || ''}
            placeholder="CMND"
            onChange={handleInputChange}
          />
        </FormControl>
        <Box>
          <Heading size="md" mb={2}>Địa chỉ</Heading>
          <VStack spacing={2} align="stretch">
            {addresses.map((address, index) => (
              <HStack key={index} spacing={4} align="center">
                <Box flex="1">
                  <Text><b>City:</b> {address.city}</Text>
                  <Text><b>District:</b> {address.district}</Text>
                  <Text><b>Ward:</b> {address.ward}</Text>
                  <Text><b>Street:</b> {address.street}</Text>
                  <Text><b>Apt Num:</b> {address.apart_num}</Text>
                </Box>
                <IconButton
                  colorScheme="blue"
                  icon={<EditIcon />}
                  onClick={() => handleEditAddress(index)}
                />
                <IconButton
                  colorScheme="red"
                  icon={<DeleteIcon />}
                  onClick={() => handleRemoveAddress(index)}
                />
              </HStack>
            ))}
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>Thêm Địa chỉ</Button>
          </VStack>
        </Box>
      </VStack>
      <Button mt={6} colorScheme="teal" onClick={handleSubmit}>Cập nhật Hồ sơ</Button>

      <Modal isOpen={isOpen} onClose={() => { onClose(); setEditingAddress(null); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingAddress?.index !== undefined ? 'Chỉnh sửa Địa chỉ' : 'Thêm Địa chỉ mới'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Thành phố</FormLabel>
                <Input
                  name="city"
                  value={editingAddress?.city || ''}
                  placeholder="Thành phố"
                  onChange={handleAddressInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Quận</FormLabel>
                <Input
                  name="district"
                  value={editingAddress?.district || ''}
                  placeholder="Quận"
                  onChange={handleAddressInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phường</FormLabel>
                <Input
                  name="ward"
                  value={editingAddress?.ward || ''}
                  placeholder="Phường"
                  onChange={handleAddressInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Đường</FormLabel>
                <Input
                  name="street"
                  value={editingAddress?.street || ''}
                  placeholder="Đường"
                  onChange={handleAddressInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Số nhà</FormLabel>
                <Input
                  name="apart_num"
                  value={editingAddress?.apart_num || ''}
                  placeholder="Số nhà"
                  onChange={handleAddressInputChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddOrEditAddress}>
              {editingAddress?.index !== undefined ? 'Lưu thay đổi' : 'Thêm Địa chỉ'}
            </Button>
            <Button variant="ghost" onClick={() => { onClose(); setEditingAddress(null); }}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default UserProfile;
