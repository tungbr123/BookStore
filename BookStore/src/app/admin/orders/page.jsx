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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const toast = useToast();

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
                            {purchase.status === 'pending' && (
                              <Button
                                size="sm"
                                colorScheme="green"
                                onClick={() => handleConfirm(purchase.id)}
                              >
                                Xác nhận đơn hàng
                              </Button>
                            )}
                            {purchase.status === 'delivering' && (
                              <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={() => handleComplete(purchase.id)}
                              >
                                Hoàn thành đơn hàng
                              </Button>
                            )}
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
    </Container>
  );
};

export default PurchaseManagement;
