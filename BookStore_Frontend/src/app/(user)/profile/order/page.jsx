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
import { useCheckOut } from "@/checkoutContext";
import { useRouter } from "next/navigation";
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
  const [reviewOnProduct, setReviewOnProduct] = useState([])
  const [isReviewd, setIsReviewd] = useState(false)
  const [check, setCheck] = useCheckOut();
  const router = useRouter();

  
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
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',  // Đảm bảo mã hóa UTF-8 cho yêu cầu
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
  }, [loggedUser.userid, filter, currentPage, pageSize]); // Refetch khi các state này thay đổi

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };
  const formatOrderDates = (orders) => {
    return orders.map(order => ({
      ...order,
      date_order: formatDate(order.date_order), // Định dạng date_order
    }));
  };

  const fetchReviewsByProductId = async () => {
    try {
      // Lấy thông tin các sản phẩm đã review
      const reviewedResponse = await axios.get(`http://localhost:8080/getAllReviewsByUsers?userid=${loggedUser.userid}`);
      const reviewedProducts = reviewedResponse.data.data;
      setReviewOnProduct(reviewedProducts);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    }
  };
  useEffect(() => {
    fetchReviewsByProductId();
  }, [loggedUser.userid, isReviewd]);

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

  const handleReorder = () => {
    setCheck(selectedOrder.orderItems)
    router.push("/checkout")
  }
  const handleSubmitReview = async () => {
    try {
      setIsReviewd(true)
      const response = await axios.post("http://localhost:8080/addReview", {
        productid: currentProduct.productid,
        userid: loggedUser.userid,
        stars: rating,
        orderid: selectedOrder.id,
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
        fetchReviewsByProductId();
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
  const formattedOrders = formatOrderDates(filteredPurchases);
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
            {formattedOrders.length > 0 ? (
              formattedOrders.map((purchase, index) => (
                <Tr key={purchase.id} border="2px solid #3182ce">
                  <Td>{index + 1 + currentPage * pageSize}</Td>
                  <Td>{purchase.id}</Td>
                  <Td>{purchase.date_order}</Td>
                  <Td>{purchase.status}</Td>
                  <Td>{purchase.phone}</Td>
                  <Td style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{purchase.address}</Td>
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
              {selectedOrder.orderItems.map((item, index) => (
                <Flex key={index} mb={4} align="center">
                  <Image boxSize="50px" src={item.image} alt={item.name} />
                  <Box ml={4}>
                    <p>{item.name}</p>
                    <p>Quantity: {item.count}</p>
                  </Box>
                  {selectedOrder.status === "completed" && (
                    reviewOnProduct.some((review) => review.productid === item.productid && review.orderid === selectedOrder.id) ? (
                      // Hiển thị "Reviewed" nếu đã đánh giá sản phẩm
                      <Text color="green.500" fontWeight="bold" ml={4}>
                        Reviewed
                      </Text>
                    ) : (
                      // Hiển thị nút "Review" nếu chưa đánh giá
                      <Button
                        size="sm"
                        colorScheme="blue"
                        ml={4}
                        onClick={() => handleOpenReview(item)}
                      >
                        Review
                      </Button>
                    )
                  )}
                </Flex>
              ))}

              {selectedOrder.status === "completed" && (

                <Flex mt={4} justify="center">
                  {selectedOrder.is_confirmed_user === 0 ? (
                    <Button
                      colorScheme="green"
                      onClick={async () => {
                        try {
                          const response = await axios.put(`http://localhost:8080/confirmOrderFromUser?orderid=${selectedOrder.id}`);
                          if (response.data.statusCode === "200") {
                            toast({
                              title: "Order Confirmed",
                              description: "You have confirmed receipt of the order.",
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                            });
                            setSelectedOrder({ ...selectedOrder, is_confirmed_user: 1 });
                          } else {
                            toast({
                              title: "Failed to Confirm",
                              description: response.data.message,
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                        } catch (error) {
                          console.error("Failed to confirm receipt:", error);
                          toast({
                            title: "Error",
                            description: "An error occurred while confirming receipt.",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                          });
                        }
                      }}
                    >
                      Received Order
                    </Button>
                  ) : (
                    <Button colorScheme="blue" onClick={handleReorder}>
                      Buy Again
                    </Button>
                  )}
                </Flex>
              )}
            </ModalBody>

            <Box ml={4}>
              <p style={{ color: "green", fontSize: "0.9rem" }}>
                Discount On Vouchers:{" "}
                {selectedOrder.discount_value_vouchers}
              </p>
            </Box>
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
