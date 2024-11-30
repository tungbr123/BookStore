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
    Select, // Import Select component for dropdowns
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import showToast from '@/hooks/useToast';

const AddressManagement = ({ userId }) => {
    const loggedUser = useSelector((state) => state.auth);
    const [addresses, setAddresses] = useState([]);
    const [editingAddress, setEditingAddress] = useState(null);
    const [cities, setCities] = useState([]); // State for cities
    const [districts, setDistricts] = useState([]); // State for districts
    const [wards, setWards] = useState([]); // State for wards
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // Fetch addresses from your custom API when component loads
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
    }, [loggedUser.userid]);

    // Fetch cities when component loads
    useEffect(() => {
        const fetchCities = async () => {
            const response = await axios.get('https://provinces.open-api.vn/api/p/');
            setCities(response.data);
        };
        fetchCities();
    }, []);

    const fetchDistricts = async (cityCode) => {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
        setDistricts(response.data.districts);
    };

    const fetchWards = async (districtCode) => {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        setWards(response.data.wards);
    };


    const handleAddressInputChange = (e) => {
        const { name, value } = e.target;
    
        // Kiểm tra nếu là mã của city, district, ward thì tìm tên tương ứng
        if (name === 'city') {
            const selectedCity = cities.find((city) => city.code == value);
            setEditingAddress((prevAddress) => ({
                ...prevAddress,
                city: selectedCity ? selectedCity.name : '', // Cập nhật tên thành phố
            }));
            fetchDistricts(value);
        } else if (name === 'district') {
            const selectedDistrict = districts.find((district) => district.code == value);
            setEditingAddress((prevAddress) => ({
                ...prevAddress,
                district: selectedDistrict ? selectedDistrict.name : '', // Cập nhật tên quận/huyện
            }));
            fetchWards(value);
        } else if (name === 'ward') {
            const selectedWard = wards.find((ward) => ward.code == value);
            setEditingAddress((prevAddress) => ({
                ...prevAddress,
                ward: selectedWard ? selectedWard.name : '', // Cập nhật tên phường/xã
            }));
        } else {
            // Xử lý cho street và apart_num
            setEditingAddress((prevAddress) => ({
                ...prevAddress,
                [name]: value, // Cập nhật giá trị street và apart_num như bình thường
            }));
        }
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
                                <Select name="city" value={editingAddress?.city || ''} onChange={handleAddressInputChange}>
                                    {/* Nếu editingAddress đã có city thì hiển thị tên thành phố đã chọn, nếu không thì hiển thị "Chọn thành phố" */}
                                    {!editingAddress?.city ? (
                                        <option value="">Chọn thành phố</option> // Khi chưa chọn thành phố
                                    ) : (
                                        <option value={editingAddress.city}>
                                            {editingAddress.city} {/* Hiển thị tên thành phố đã chọn */}
                                        </option>
                                    )}
                                    {cities.map((city) => (
                                        <option key={city.code} value={city.code}>
                                            {city.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Quận</FormLabel>
                                <Select name="district" value={editingAddress?.district || ''} onChange={handleAddressInputChange} disabled={!editingAddress?.city}>
                                {!editingAddress?.district ? (
                                        <option value="">Chọn quận</option> // Khi chưa chọn thành phố
                                    ) : (
                                        <option value={editingAddress.district}>
                                            {editingAddress.district} {/* Hiển thị tên thành phố đã chọn */}
                                        </option>
                                    )}
                                    {districts.map((district) => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Phường</FormLabel>
                                <Select name="ward" value={editingAddress?.ward || ''} onChange={handleAddressInputChange} disabled={!editingAddress?.district}>
                                {!editingAddress?.ward ? (
                                        <option value="">Chọn phường</option> // Khi chưa chọn thành phố
                                    ) : (
                                        <option value={editingAddress.ward}>
                                            {editingAddress.ward} {/* Hiển thị tên thành phố đã chọn */}
                                        </option>
                                    )}
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </Select>
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
