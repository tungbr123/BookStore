"use client"
import {
  Box,
  Container,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  FormControl,
  FormLabel,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { Line, Bar, getElementsAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useFilter } from '@/filterContext';
import { useRouter } from 'next/navigation';
import showToast from '@/hooks/useToast';
import { useSelector } from 'react-redux';

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const RevenueDashboard = () => {
  const [revenueData, setRevenueData] = useState({
    getTotalRevenue: 0,
    getAllOrderQuantity: 0,
    getRevenueByDelivering: 0,
    getRevenueByPending: 0,
    getRevenueByCanceled: 0,
    getRevenueByCompleted: 0,
  });
  const [top3Users, setTop3Users] = useState([]);
  const [top3Products, setTop3Products] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(new Date());
  const [filter, setFilter] = useFilter(); // Get setFilter from the context
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const loggedUser = useSelector((state) => state.auth);
  const chartRef = useRef();

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getRevenue');
      const dataRevenue = {
        getTotalRevenue: response.data.data.getTotalRevenue,
        getAllOrderQuantity: response.data.data.getAllOrderQuantity,
        getRevenueByDelivering: response.data.data.getRevenueByDelivering,
        getRevenueByPending: response.data.data.getRevenueByPending,
        getRevenueByCanceled: response.data.data.getRevenueByCanceled,
        getRevenueByCompleted: response.data.data.getRevenueByCompleted,
      };
      setRevenueData(dataRevenue);

      const response1 = await axios.get('http://localhost:8080/getTop3Users');
      setTop3Users(response1.data.data);

      const response2 = await axios.get('http://localhost:8080/getTop3Product');
      setTop3Products(response2.data.data);

      fetchMonthlyRevenue(startDate, endDate);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const fetchMonthlyRevenue = async (start, end) => {
    try {
      const startFormatted = moment(start).format('YYYY-MM-DD');
      const endFormatted = moment(end).format('YYYY-MM-DD');
      const response = await axios.get(`http://localhost:8080/getMonthlyRevenue?startDate=${startFormatted}&endDate=${endFormatted}`);

      // Check the structure of response.data.data
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        setMonthlyRevenue(response.data.data);
      } else {
        console.error('Invalid data structure:', response.data.data);
        setMonthlyRevenue([]);
      }
    } catch (error) {
      console.error('Error fetching monthly revenue data:', error);
    }
  };

  const fetchUserOrders = async (userid) => {
    try {
      const response = await axios.get(`http://localhost:8080/getOrdersByUserId?userid=${userid}`);
      if (response.data.statusCode === "200") {
        setSelectedUserOrders(response.data.data);
        onOpen();
      } else {
        showToast("Failed to fetch orders", "error");
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  useEffect(() => {
    fetchMonthlyRevenue(startDate, endDate);
  }, [startDate, endDate]);

  // Handle bar click event
  const handleBarClick = (event) => {
    if (getElementsAtEvent(chartRef.current, event).length > 0) {
      const datasetIndex = getElementsAtEvent(chartRef.current, event)[0].datasetIndex
      const index = getElementsAtEvent(chartRef.current, event)[0].index
      const status = ['delivering', 'pending', 'canceled', 'completed'][index];
      setFilter(status); // Set the filter to the clicked status
      router.push('/admin/orders')
    }
  };

  // Data for Line Chart (Monthly Revenue)
  const lineChartData = {
    labels: monthlyRevenue.map(item => item.month),
    datasets: [
      {
        label: 'Doanh thu',
        data: monthlyRevenue.map(item => item.revenue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };
  const options = {};

  // Data for Bar Chart (Revenue by Order Status)
  const barChartData = {
    labels: ['Đang Giao', 'Đang Chờ', 'Đã Hủy', 'Hoàn Thành'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [
          revenueData.getRevenueByDelivering,
          revenueData.getRevenueByPending,
          revenueData.getRevenueByCanceled,
          revenueData.getRevenueByCompleted,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
        link: "http://localhost:3000/admin/orders"
      },
    ],
  };

  return (
    <Container maxW="container.xl" py={4}>
      <Heading size="lg" mb={4}>Thống kê Doanh thu</Heading>

      <SimpleGrid columns={[1, 2, 4]} spacing={4}>
        <Stat>
          <StatLabel>Tổng Doanh thu</StatLabel>
          <StatNumber>{revenueData.getTotalRevenue}₫</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Tổng Số Đơn Hàng</StatLabel>
          <StatNumber>{revenueData.getAllOrderQuantity}</StatNumber>
        </Stat>
      </SimpleGrid>

      <Box mt={8}>
        <Heading size="md" mb={4}>Biểu đồ doanh thu</Heading>
        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel htmlFor="start-date" mb="0">
            Từ ngày:
          </FormLabel>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd/MM/yyyy"
          />
          <FormLabel htmlFor="end-date" mb="0" ml={4}>
            Đến ngày:
          </FormLabel>
          <DatePicker
            id="end-date"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="dd/MM/yyyy"
          />
        </FormControl>
        <SimpleGrid columns={1} spacing={4}>
          <Line data={lineChartData} />
        </SimpleGrid>
      </Box>

      <Box mt={8}>
        <Heading size="md" mb={4}>Doanh thu theo trạng thái đơn hàng</Heading>
        <SimpleGrid columns={1} spacing={4}>
          <Bar data={barChartData} options={options}
            ref={chartRef}
            onClick={handleBarClick} />
        </SimpleGrid>
      </Box>

      <Box mt={8}>
        <Heading size="md" mb={4}>Người dùng mua hàng nhiều nhất</Heading>
        <SimpleGrid columns={[1, 2, 4]} spacing={4}>
          {top3Users.map((user) => (
            <Box key={loggedUser.userid} p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="sm" mb={2}>{user.username}</Heading>
              <Stat>
                <StatLabel>Số Đơn Hàng</StatLabel>
                <StatNumber>{user.getTotalOrderByUser}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Tổng Doanh Thu</StatLabel>
                <StatNumber>{user.getTotalRevenueByUser} ₫</StatNumber>
              </Stat>
              <Button onClick={() => fetchUserOrders(user.userid)}>View Orders</Button>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box mt={8}>
        <Heading size="md" mb={4}>Mặt hàng được mua nhiều nhất</Heading>
        <SimpleGrid columns={[1, 2, 4]} spacing={4}>
          {top3Products.map((product, index) => (
            <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="sm" mb={2}>{product.productname}</Heading>
              <Stat>
                <StatLabel>Số Lượng Bán</StatLabel>
                <StatNumber>{product.getTotalCount}</StatNumber>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Modal for displaying user orders */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="100vw">
          <ModalHeader>User Orders</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box border="1px" borderColor="gray.300" borderRadius="md" overflow="hidden">
              <Table variant="simple" size="sm" borderCollapse="collapse" wordBreak="break-word">
                <Thead>
                  <Tr>
                    <Th border="1px" borderColor="gray.300">ID</Th>
                    {/* <Th border="1px" borderColor="gray.300">UserID</Th> */}
                    <Th border="1px" borderColor="gray.300">Hình ảnh</Th>
                    <Th border="1px" borderColor="gray.300">Sản phẩm</Th>
                    <Th border="1px" borderColor="gray.300">Ngày</Th>
                    <Th border="1px" borderColor="gray.300">Trạng thái</Th>
                    <Th border="1px" borderColor="gray.300">Số lượng</Th>
                    <Th border="1px" borderColor="gray.300">Giá</Th>
                    <Th border="1px" borderColor="gray.300">Tổng tiền</Th>
                    {/* <Th border="1px" borderColor="gray.300">Hành động</Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedUserOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      {order.orderItems.map((product, index) => (
                        <Tr key={index}>
                          {index === 0 && (
                            <>
                              <Td rowSpan={order.orderItems.length} border="1px" borderColor="gray.300">{order.id}</Td>
                              {/* <Td rowSpan={order.orderItems.length} border="1px" borderColor="gray.300">{order.userid}</Td> */}
                            </>
                          )}
                          <Td border="1px" borderColor="gray.300">
                            <Image boxSize="50px" src={product.image} alt={product.name} />
                          </Td>
                          <Td border="1px" borderColor="gray.300">{product.name}</Td>
                          {index === 0 && (
                            <>
                              <Td rowSpan={order.orderItems.length} border="1px" borderColor="gray.300">{order.dateOrder}</Td>
                              <Td rowSpan={order.orderItems.length} border="1px" borderColor="gray.300">{order.status}</Td>
                            </>
                          )}
                          <Td border="1px" borderColor="gray.300">{product.count}</Td>
                          <Td border="1px" borderColor="gray.300">{product.promotion_price}</Td>
                          {index === 0 && (
                            <>
                              <Td rowSpan={order.orderItems.length} border="1px" borderColor="gray.300">
                                {order.amountFromUser}₫
                              </Td>
                              {/* <Td rowSpan={order.orderItems.length} border="1px" borderColor="gray.300">
                                <Button size="sm" colorScheme="blue">
                                  Xem chi tiết
                                </Button>
                              </Td> */}
                            </>
                          )}
                        </Tr>
                      ))}
                    </React.Fragment>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default RevenueDashboard;
