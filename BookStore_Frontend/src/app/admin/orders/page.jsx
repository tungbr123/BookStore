"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  Flex,
  Heading,
  Button,
  useToast,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useFilter } from '@/filterContext';

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useFilter();
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getAllOrders');
        const orders = response.data.data; // Assuming your API response structure
        setPurchases(orders);
      } catch (error) {
        console.error('Failed to fetch purchases:', error);
      }
    };

    fetchPurchases();
  }, [],purchases);

  const handleConfirm = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/confirm/${id}`);
      if (response.data.statusCode === "200") {
        toast({
          title: 'Xác nhận đơn hàng',
          description: `Xác nhận đơn hàng thành công.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.id === id ? { ...purchase, status: 'delivering' } : purchase
          )
        );
        onClose();
      } else {
        toast({
          title: 'Xác nhận đơn hàng thất bại',
          description: response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to confirm order:', error);
      toast({
        title: 'Xác nhận đơn hàng thất bại',
        description: 'Đã xảy ra lỗi trong quá trình xác nhận đơn hàng.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/complete/${id}`);
      if (response.data.statusCode === "200") {
        toast({
          title: 'Hoàn thành đơn hàng',
          description: `Hoàn thành đơn hàng thành công.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.id === id ? { ...purchase, status: 'completed' } : purchase
          )
        );
        onClose();
      } else {
        toast({
          title: 'Hoàn thành đơn hàng thất bại',
          description: response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to complete order:', error);
      toast({
        title: 'Hoàn thành đơn hàng thất bại',
        description: 'Đã xảy ra lỗi trong quá trình hoàn thành đơn hàng.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    onOpen();
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (filter !== 'all' && purchase.status !== filter) {
      return false;
    }
    const searchTermLower = searchTerm.toLowerCase();
    return (
      purchase.userid.toString().toLowerCase().includes(searchTermLower) ||
      purchase.orderItems.some(product =>
        product.name.toLowerCase().includes(searchTermLower)
      )
    );
  });

  let orderIndex = 1; // Initialize the order index

  return (
    <Container maxW="container.xl" py={4}>
      <Box mb={4}>
        <Heading size="lg" mb={4}>Quản lý Đơn Hàng</Heading>
        <Flex mb={4}>
          <InputGroup mr={4}>
            <Input
              placeholder="Tìm kiếm user hoặc sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label="Tìm kiếm"
                icon={<SearchIcon />}
                onClick={() => {}}
              />
            </InputRightElement>
          </InputGroup>
          <Select
            placeholder="Lọc theo trạng thái"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Đang chờ</option>
            <option value="delivering">Đang giao</option>
            <option value="canceled">Đã hủy</option>
          </Select>
        </Flex>
        <Box border="1px" borderColor="gray.300" borderRadius="md" overflow="hidden">
          <Table variant="simple" size="sm" borderCollapse="collapse" wordBreak="break-word">
            <Thead>
              <Tr>
                <Th border="1px" borderColor="gray.300">ID</Th>
                <Th border="1px" borderColor="gray.300">UserID</Th>
                <Th border="1px" borderColor="gray.300">Hình ảnh</Th>
                <Th border="1px" borderColor="gray.300">Sản phẩm</Th>
                <Th border="1px" borderColor="gray.300">Ngày</Th>
                <Th border="1px" borderColor="gray.300">Trạng thái</Th>
                <Th border="1px" borderColor="gray.300">Số lượng</Th>
                <Th border="1px" borderColor="gray.300">Giá</Th>
                <Th border="1px" borderColor="gray.300">Tổng tiền</Th>
                <Th border="1px" borderColor="gray.300">Hành động</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredPurchases.map((purchase) => (
                <React.Fragment key={purchase.id}>
                  {purchase.orderItems.map((product, index) => (
                    <Tr key={index}>
                      {index === 0 && (
                        <>
                          <Td rowSpan={purchase.orderItems.length} border="1px" borderColor="gray.300">{orderIndex++}</Td>
                          <Td rowSpan={purchase.orderItems.length} border="1px" borderColor="gray.300">{purchase.userid}</Td>
                        </>
                      )}
                      <Td border="1px" borderColor="gray.300"><Image boxSize="50px" src={product.image} alt={product.name} /></Td>
                      <Td border="1px" borderColor="gray.300">{product.name}</Td>
                      {index === 0 && (
                        <>
                          <Td rowSpan={purchase.orderItems.length} border="1px" borderColor="gray.300">{purchase.dateOrder}</Td>
                          <Td rowSpan={purchase.orderItems.length} border="1px" borderColor="gray.300">{purchase.status}</Td>
                        </>
                      )}
                      <Td border="1px" borderColor="gray.300">{product.count}</Td>
                      <Td border="1px" borderColor="gray.300">{product.promotion_price}</Td>
                      {index === 0 && (
                        <>
                          <Td rowSpan={purchase.orderItems.length} border="1px" borderColor="gray.300">
                            {purchase.amountFromUser}
                          </Td>
                          <Td rowSpan={purchase.orderItems.length} border="1px" borderColor="gray.300">
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleViewDetails(purchase)}
                            >
                              Xem chi tiết
                            </Button>
                          </Td>
                        </>
                      )}
                    </Tr>
                  ))}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {selectedPurchase && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chi tiết đơn hàng</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text><strong>Họ:</strong> {selectedPurchase.firstname}</Text>
              <Text><strong>Tên:</strong> {selectedPurchase.lastname}</Text>
              <Text><strong>Email:</strong> {selectedPurchase.email}</Text>
              <Text><strong>Tên đơn vị vận chuyển:</strong> {selectedPurchase.delivery_name}</Text>
              <Text><strong>Giá giao hàng:</strong> {selectedPurchase.delivery_price}</Text>
              <Text><strong>Địa chỉ:</strong> {selectedPurchase.address}</Text>
              <Text><strong>Số điện thoại:</strong> {selectedPurchase.phone}</Text>
              <Text><strong>Trạng thái:</strong> {selectedPurchase.status}</Text>
              <Text><strong>Ngày đặt hàng:</strong> {new Date(selectedPurchase.dateOrder).toLocaleDateString()}</Text>
              <Text><strong>Tổng tiền:</strong> {selectedPurchase.amountFromUser}</Text>
              <Heading size="md" mt={4}>Sản phẩm:</Heading>
              {selectedPurchase.orderItems.map((item, index) => (
                <Box key={index} border="1px" borderColor="gray.300" p={2} mt={2}>
                  <Text><strong>Tên sản phẩm:</strong> {item.name}</Text>
                  <Text><strong>Số lượng:</strong> {item.count}</Text>
                  <Text><strong>Giá khuyến mãi:</strong> {item.promotion_price}</Text>
                  <Image boxSize="50px" src={item.image} alt={item.name} />
                </Box>
              ))}
            </ModalBody>

            <ModalFooter>
              {selectedPurchase.status === 'pending' && (
                <Button colorScheme="green" mr={3} onClick={() => handleConfirm(selectedPurchase.id)}>
                  Xác nhận đơn hàng
                </Button>
              )}
              {selectedPurchase.status === 'delivering' && (
                <Button colorScheme="blue" mr={3} onClick={() => handleComplete(selectedPurchase.id)}>
                  Hoàn thành đơn hàng
                </Button>
              )}
              <Button variant="ghost" onClick={onClose}>Đóng</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default PurchaseManagement;
