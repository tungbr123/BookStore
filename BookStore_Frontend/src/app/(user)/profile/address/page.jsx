"use client"

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    FormControl,
    FormLabel,
    Input,
    Button,
    Heading,
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
    Text,
    IconButton,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddressManagement = ({ userId }) => {
    const loggedUser = useSelector((state) => state.auth)
    const [addresses, setAddresses] = useState([]);
    const [editingAddress, setEditingAddress] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/getAddressByUserId/${loggedUser.userid}`);
                setAddresses(response.data);
            } catch (error) {
                console.error('Failed to fetch addresses:', error);
            }
        };

        fetchAddresses();
    }, [userId]);

    const handleAddressInputChange = (e) => {
        const { name, value } = e.target;
        setEditingAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleAddOrEditAddress = async () => {
        if (editingAddress) {
            const { id, city, district, ward, street, apart_num } = editingAddress;
            if (city && district && ward && street && apart_num) {
                try {
                    if (id) {
                        const response = await axios.put(`http://localhost:8080/updateAddress/${id}`, editingAddress);
                        setAddresses((prevAddresses) =>
                            prevAddresses.map((addr) => (addr.id === id ? response.data : addr))
                        );
                    } else {
                        const response = await axios.post('http://localhost:8080/createAddress', {
                            ...editingAddress,
                            userid: loggedUser.userid,
                        });
                        setAddresses((prevAddresses) => [...prevAddresses, response.data]);
                    }
                    toast({
                        title: 'Operation Success',
                        description: 'Success',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    onClose();
                    setEditingAddress(null);
                } catch (error) {
                    toast({
                        title: 'Operation failed',
                        description: 'An error occurred while saving the address.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } else {
                toast({
                    title: 'Invalid address',
                    description: 'Please fill in all fields.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        onOpen();
    };

    const handleRemoveAddress = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/deleteAddress/${id}`);
            setAddresses((prevAddresses) => prevAddresses.filter((addr) => addr.id !== id));
        } catch (error) {
            toast({
                title: 'Delete failed',
                description: 'An error occurred while deleting the address.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.md" py={4}>
            <Heading size="lg" mb={6}>Quản lý Địa chỉ</Heading>
            <VStack spacing={4} align="stretch">
                {addresses.map((address) => (
                    <HStack key={address.id} spacing={4} align="center" w="full" p={4} borderWidth={1} borderRadius="lg">
                        <Box flex="1">
                            <Text>
                                <b>Địa chỉ:</b> {address.apart_num}/ {address.street}/<br />
                                <b>Phường:</b> {address.ward}, <b>Quận:</b> {address.district}, <b>Thành phố:</b> {address.city}
                            </Text>
                        </Box>
                        <IconButton
                            colorScheme="blue"
                            icon={<EditIcon />}
                            onClick={() => handleEditAddress(address)}
                        />
                        <IconButton
                            colorScheme="red"
                            icon={<DeleteIcon />}
                            onClick={() => handleRemoveAddress(address.id)}
                        />
                    </HStack>
                ))}
                <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>Thêm Địa chỉ</Button>
            </VStack>

            <Modal isOpen={isOpen} onClose={() => { onClose(); setEditingAddress(null); }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{editingAddress ? 'Chỉnh sửa Địa chỉ' : 'Thêm Địa chỉ mới'}</ModalHeader>
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
                            {editingAddress ? 'Lưu thay đổi' : 'Thêm Địa chỉ'}
                        </Button>
                        <Button variant="ghost" onClick={() => { onClose(); setEditingAddress(null); }}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default AddressManagement;
