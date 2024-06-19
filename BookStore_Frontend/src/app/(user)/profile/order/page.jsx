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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  Image,
  FormControl,
  FormLabel,
  RadioGroup,
  HStack,
  Radio,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import showToast from '@/hooks/useToast';

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loggedUser = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getOrdersByUserId', {
          params: { userid: loggedUser.userid },
        });
        const orders = response.data.data; // Assuming your API response structure
        setPurchases(orders);
      } catch (error) {
        console.error('Failed to fetch purchases:', error);
      }
    };

    fetchPurchases();
  }, []);

  const handleReview = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleCancel = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/cancel/${id}`);
      if (response.data.statusCode === "200") {
        toast({
          title: 'Hủy đơn hàng',
          description: `Hủy đơn hàng thành công.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setPurchases(prevPurchases => 
          prevPurchases.map(purchase =>
            purchase.id === id ? { ...purchase, status: 'canceled' } : purchase
          )
        );
      } else {
        toast({
          title: 'Hủy đơn hàng thất bại',
          description: response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast({
        title: 'Hủy đơn hàng thất bại',
        description: 'Đã xảy ra lỗi trong quá trình hủy đơn hàng.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmitReview = async () => {
    try {

      const response = await axios.post('http://localhost:8080/addReview', {
        productid: selectedProduct.productid,
        userid: loggedUser.userid, 
        stars: rating,
        content: reviewContent,
      });
      if (response.data.statusCode === "200") {
        toast({
          title: 'Đánh giá sản phẩm',
          description: `Bạn đã đánh giá sản phẩm ${selectedProduct.name}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setReviewContent('');
        setRating(5);
        onClose();
      } else {
        toast({
          title: 'Đánh giá sản phẩm thất bại',
          description: response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast({
        title: 'Đánh giá sản phẩm thất bại',
        description: 'Đã xảy ra lỗi trong quá trình đánh giá sản phẩm.',
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
    return purchase.orderItems.some(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  let orderIndex = 1; // Initialize the order index

  return (
    <Container maxW="container.xl" py={4}>
      <Box mb={4}>
        <Heading size="lg" mb={4}>Lịch sử Mua Hàng</Heading>
        <Flex mb={4}>
          <InputGroup mr={4}>
            <Input
              placeholder="Tìm kiếm..."
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
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Hình ảnh</Th>
              <Th>Sản phẩm</Th>
              <Th>Ngày</Th>
              <Th>Trạng thái</Th>
              <Th>Số lượng</Th>
              <Th>Giá</Th>
              <Th>Tổng tiền</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPurchases.map((purchase) => (
              <React.Fragment key={purchase.id}>
                {purchase.orderItems.map((product, index) => (
                  <Tr key={index}>
                    {index === 0 && (
                      <Td rowSpan={purchase.orderItems.length}>{orderIndex++}</Td>
                    )}
                    <Td><Image boxSize="50px" src={product.image} alt={product.name} /></Td>
                    <Td>{product.name}</Td>
                    {index === 0 && (
                      <>
                        <Td rowSpan={purchase.orderItems.length}>{purchase.dateOrder}</Td>
                        <Td rowSpan={purchase.orderItems.length}>{purchase.status}</Td>
                      </>
                    )}
                    <Td>{product.count}</Td>
                    <Td>{product.promotion_price}</Td>
                    {index === 0 && (
                      <Td rowSpan={purchase.orderItems.length}>
                        {purchase.amountFromUser}
                      </Td>
                    )}
                    {index === 0 && (
                      <Td rowSpan={purchase.orderItems.length}>
                        {purchase.status ===  'pending' && (
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleCancel(purchase.id)}
                          >
                            Hủy đơn hàng
                          </Button>
                        )}
                        {purchase.status === 'completed' && (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleReview(product)}
                            mr={2}
                          >
                            Đánh giá
                          </Button>
                        )}
                      </Td>
                    )}
                  </Tr>
                ))}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Đánh giá sản phẩm {selectedProduct?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Số sao</FormLabel>
              <RadioGroup onChange={setRating} value={rating}>
                <HStack spacing="24px">
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Nội dung đánh giá</FormLabel>
              <Textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Viết đánh giá của bạn..."
                rows={6}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmitReview}>
              Gửi đánh giá
            </Button>
            <Button variant="ghost" onClick={onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default PurchaseHistory;
