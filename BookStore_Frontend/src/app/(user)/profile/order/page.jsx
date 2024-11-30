"use client"

import React, { useState, useEffect } from "react";
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
  Image,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("pending"); // Default filter is pending
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(5);
  const [currentProduct, setCurrentProduct] = useState(null); // Store current product for review
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loggedUser = useSelector((state) => state.auth);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageSize, setPageSize] = useState(10); // Số đơn hàng trên mỗi trang
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getOrdersWithPagingByStatus`, {
          params: {
            userid: loggedUser.userid,
            page: currentPage,
            size: pageSize,
            status: filter, // Chỉ thêm trạng thái nếu không phải "all"
          },
        });
        console.log(response)
        const ordersPage = response.data.data;
        setPurchases(ordersPage);
        setTotalPages(ordersPage[0].totalPages);

      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      }
    };
    fetchPurchases();
  }, [loggedUser.userid, filter, currentPage, pageSize]); // Refetch khi các state này thay đổi

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleCancel = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/cancel/${id}`);
      if (response.data.statusCode === "200") {
        toast({
          title: "Cancel Order",
          description: `Order has been successfully canceled.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setPurchases((prevPurchases) =>
          prevPurchases.map((purchase) =>
            purchase.id === id ? { ...purchase, status: "canceled" } : purchase
          )
        );
      } else {
        toast({
          title: "Failed to Cancel Order",
          description: response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast({
        title: "Failed to Cancel Order",
        description: "An error occurred while canceling the order.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleOpenReview = (item) => {
    setCurrentProduct(item); // Chọn sản phẩm để đánh giá
    onOpen(); // Mở modal đánh giá
  };

  const handleSubmitReview = async () => {
    try {
      const response = await axios.post("http://localhost:8080/addReview", {
        productid: currentProduct.productid,
        userid: loggedUser.userid,
        stars: rating,
        content: reviewContent,
      });
      if (response.data.statusCode === "200") {
        toast({
          title: "Product Review",
          description: `You have reviewed the product ${currentProduct.name}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setReviewContent("");
        setRating(5);
        setCurrentProduct(null); // Reset current product after review
      } else {
        toast({
          title: "Failed to Review Product",
          description: response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast({
        title: "Failed to Review Product",
        description: "An error occurred while reviewing the product.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredPurchases = (purchases || []).filter((purchase) => {
    if (filter !== "all" && purchase.status !== filter) {
      return false;
    }
    return purchase.id.toString().includes(searchTerm);
  });
  return (
    <Container maxW="container.xl" py={4}>
      <Box mb={4}>
        <Heading size="lg" mb={4}>
          Purchase History
        </Heading>
        <Flex mb={4}>
          <InputGroup mr={4}>
            <Input
              placeholder="Search by Order ID..."
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
              setCurrentPage(0); // Reset trang khi thay đổi filter
            }}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="delivering">Delivering</option>
            <option value="canceled">Canceled</option>
          </Select>
        </Flex>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Order ID</Th>
              <Th>Order Date</Th>
              <Th>Status</Th>
              <Th>Phone</Th>
              <Th>Delivery Address</Th>
              <Th>Total Amount</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map((purchase, index) => (
                <Tr key={purchase.id} border="2px solid #3182ce">
                  <Td>{index + 1 + currentPage * pageSize}</Td>
                  <Td>{purchase.id}</Td>
                  <Td>{purchase.date_order}</Td>
                  <Td>{purchase.status}</Td>
                  <Td>{purchase.phone}</Td>
                  <Td>{purchase.address}</Td>
                  <Td>{purchase.amountFromUser}</Td>
                  <Td>
                    <Flex>
                      <Button size="sm" onClick={() => handleViewDetails(purchase)}>
                        View Details
                      </Button>
                      {purchase.status === "pending" && (
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleCancel(purchase.id)}
                          ml={2}
                        >
                          Cancel
                        </Button>
                      )}
                    </Flex>
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

      {/* Modal for viewing order details */}
      {selectedOrder && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order Details (Order ID: {selectedOrder.id})</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedOrder.orderItems &&
                selectedOrder.orderItems.map((item, index) => (
                  <Flex key={index} mb={4} align="center">
                    <Image boxSize="50px" src={item.image} alt={item.name} />
                    <Box ml={4}>
                      <p>{item.name}</p>
                      <p>Quantity: {item.count}</p>
                      <p style={{ color: "green", fontSize: "0.9rem" }}>
                        Discount On Vouchers:{" "}
                        {selectedOrder.discount_value_vouchers}
                      </p>
                    </Box>
                    {/* Show 'Review' button only if order status is 'completed' */}
                    {selectedOrder.status === "completed" && (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        ml={4}
                        onClick={() => handleOpenReview(item)}
                      >
                        Review
                      </Button>
                    )}
                  </Flex>

                ))}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Review modal */}
      <Modal isOpen={isOpen && currentProduct} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Review Product: {currentProduct?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column">
              <Input
                placeholder="Write your review..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                mb={3}
              />
              <Select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                mb={3}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} Star{star > 1 ? "s" : ""}
                  </option>
                ))}
              </Select>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmitReview}>
              Submit Review
            </Button>
            <Button variant="ghost" onClick={onClose} ml={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default PurchaseHistory;
