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
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import showToast from '@/hooks/useToast';

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useFilter();
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageSize, setPageSize] = useState(10);

  const loggedUser = useSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (!loggedUser.token || loggedUser.role != 1) {
      router.push('/signin');
    }
  }, [loggedUser.token, loggedUser.role]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getAllOrdersWithPagingByStatus`, {
          params: {
            page: currentPage,
            size: pageSize,
            status: filter, // Chỉ thêm trạng thái nếu không phải "all"
          },
        });
        const ordersPage = response.data.data;
        setPurchases(ordersPage);
        setTotalPages(ordersPage[0].totalPages);

      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      }
    };

    fetchPurchases();
  }, [filter, currentPage, pageSize]);

  const handleConfirm = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/confirm/${id}`);
      if (response.data.statusCode === "200") {
        toast({
          title: 'Confirm Order',
          description: `Order confirmed successfully.`,
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
          title: 'Order Confirmation Failed',
          description: response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to confirm order:', error);
      toast({
        title: 'Order Confirmation Failed',
        description: 'An error occurred while confirming the order.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleCancelOrder = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/cancel/${id}`);
      if (response.data.statusCode === "200") {
        toast({
          title: 'Cancel Order',
          description: `Order canceled successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.id === id ? { ...purchase, status: 'canceled' } : purchase
          )
        );
        onClose();
      } else {
        toast({
          title: 'Order Cancellation Failed',
          description: response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast({
        title: 'Order Cancellation Failed',
        description: 'An error occurred while canceling the order.',
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
          title: 'Complete Order',
          description: `Order completed successfully.`,
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
          title: 'Order Completion Failed',
          description: response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to complete order:', error);
      toast({
        title: 'Order Completion Failed',
        description: 'An error occurred while completing the order.',
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
    if (filter == "need-confirmation")
      return true;
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
  return (
    <Container maxW="container.xl" py={4}>
      <Box mb={4}>
        <Heading size="lg" mb={4}>Order Management</Heading>
        <Flex mb={4}>
          <InputGroup mr={4}>
            <Input
              placeholder="Search user or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label="Search"
                icon={<SearchIcon />}
                onClick={() => { }}
              />
            </InputRightElement>
          </InputGroup>
          <Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(0);
            }
            }
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="delivering">Delivering</option>
            <option value="canceled">Canceled</option>
            <option value="need-confirmation">Orders need to be confirmed</option>
          </Select>
        </Flex>
        <Box border="1px" borderColor="gray.300" borderRadius="md" overflow="hidden">
          <Table variant="simple" size="sm" borderCollapse="collapse" wordBreak="break-word">
            <Thead>
              <Tr>
                <Th border="1px" borderColor="gray.300">No.</Th>
                <Th border="1px" borderColor="gray.300">User ID</Th>
                <Th border="1px" borderColor="gray.300">Order ID</Th>
                <Th border="1px" borderColor="gray.300">Phone Number</Th>
                <Th border="1px" borderColor="gray.300">Address</Th>
                <Th border="1px" borderColor="gray.300">Date Order</Th>
                <Th border="1px" borderColor="gray.300">Status</Th>
                <Th border="1px" borderColor="gray.300">Total Amount</Th>
                <Th border="1px" borderColor="gray.300">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase, index) => (
                  <Tr key={purchase.id}>
                    <Td border="1px" borderColor="gray.300">{index + 1}</Td>
                    <Td border="1px" borderColor="gray.300">{purchase.userid}</Td>
                    <Td border="1px" borderColor="gray.300">{purchase.id}</Td>
                    <Td border="1px" borderColor="gray.300">{purchase.phone}</Td>
                    <Td border="1px" borderColor="gray.300" maxW="150px" isTruncated>
                      {purchase.address}
                    </Td>
                    <Td border="1px" borderColor="gray.300">{new Date(purchase.date_order).toLocaleDateString()}</Td>
                    <Td border="1px" borderColor="gray.300">{purchase.status}</Td>
                    <Td border="1px" borderColor="gray.300">{purchase.amountFromUser}</Td>
                    <Td border="1px" borderColor="gray.300">
                      <Button size="sm" colorScheme="blue" onClick={() => handleViewDetails(purchase)}>
                        View Details
                      </Button>
                    </Td>
                  </Tr>
                )) 
              ) : (
                <Tr>
                  <Td colSpan="8" textAlign="center" color="gray.500">
                    No orders found for the status: <strong>{filter}</strong>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
            <Button
              isDisabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            >
              Previous
            </Button>
            <Box>
              Page {currentPage + 1} of {totalPages}
            </Box>
            <Button
              isDisabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>

      {selectedPurchase && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text><strong>First Name:</strong> {selectedPurchase.firstname}</Text>
              <Text><strong>Last Name:</strong> {selectedPurchase.lastname}</Text>
              <Text><strong>Email:</strong> {selectedPurchase.email}</Text>
              <Text><strong>Delivery Service Name:</strong> {selectedPurchase.delivery_name}</Text>
              <Text><strong>Delivery Price:</strong> {selectedPurchase.delivery_price}</Text>
              <Text><strong>Address:</strong> {selectedPurchase.address}</Text>
              <Text><strong>Phone Number:</strong> {selectedPurchase.phone}</Text>
              <Text><strong>Status:</strong> {selectedPurchase.status}</Text>
              <Text><strong>Order Date:</strong> {new Date(selectedPurchase.date_order).toLocaleDateString()}</Text>
              <Text><strong>Total Amount:</strong> {selectedPurchase.amountFromUser}</Text>
              <Text><strong>Discount On Voucher: </strong> {selectedPurchase.discount_value_vouchers}</Text>
              {filter === 'need-confirmation' && selectedPurchase.messageStatusPending && (
                <Text color="red.500" mt={2}>
                  {selectedPurchase.messageStatusPending}
                </Text>
              )}
              <Heading size="md" mt={4}>Products:</Heading>
              {selectedPurchase.orderItems.map((item, index) => (
                <Box key={index} border="1px" borderColor="gray.300" p={2} mt={2}>
                  <Text><strong>Product Name:</strong> {item.name}</Text>
                  <Text><strong>Quantity:</strong> {item.count}</Text>
                  <Text><strong>Promotional Price:</strong> {item.promotion_price}</Text>
                  <Image src={item.image} alt={item.name} boxSize="100px" objectFit="cover" />
                </Box>
              ))}
            </ModalBody>
            <ModalFooter>
              {selectedPurchase.status === 'pending' && (
                <>
                  <Button colorScheme="green" mr={3} onClick={() => handleConfirm(selectedPurchase.id)}>
                    Confirm Order
                  </Button>
                  <Button colorScheme="red" onClick={() => handleCancelOrder(selectedPurchase.id)}>
                    Cancel Order
                  </Button>
                </>
              )}
              {selectedPurchase.status === 'delivering' && (
                <>
                  <Button colorScheme="teal" mr={3} onClick={() => handleComplete(selectedPurchase.id)}>
                    Complete Order
                  </Button>
                  <Button colorScheme="red" onClick={() => handleCancelOrder(selectedPurchase.id)}>
                    Cancel Order
                  </Button>
                </>
              )}
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>

          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default PurchaseManagement;
