"use client"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Select,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RevenueDashboard = () => {
  const [userFilter, setUserFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    revenueByStatus: {},
    topUsers: [],
    topProducts: []
  });

  useEffect(() => {
    // Assume fetching and calculating revenue data here
    // For demonstration purposes, mock data is used
    const mockTopUsers = [
      { name: "User A", orders: 10, topProducts: { name: "Product X", quantity: 25 } },
      { name: "User B", orders: 8, topProducts: { name: "Product Y", quantity: 20 } },
      { name: "User C", orders: 6, topProducts: { name: "Product Z", quantity: 15 } },
      // Add more mock data as needed
    ];
    // Mock data
    const mockRevenueData = {
      totalRevenue: 15000000,
      totalOrders: 25,
      revenueByStatus: {
        completed: 10000000,
        delivering: 4000000,
        pending: 500000,
        canceled: 1000000
      },
      topUsers: [
        { name: "User A", orders: 10, topProducts: [{ name: "Product X", quantity: 25 }] },
        { name: "User B", orders: 8, topProducts: [{ name: "Product Y", quantity: 20 }] },
        { name: "User C", orders: 6, topProducts: [{ name: "Product Z", quantity: 15 }] }
      ],
      topProducts: [
        { name: 'Product X', quantity: 30 },
        { name: 'Product Y', quantity: 25 },
        { name: 'Product Z', quantity: 20 }
      ]
    };
    setRevenueData(mockRevenueData);
  }, []);

  const dataForChart = Object.entries(revenueData.revenueByStatus).map(([status, revenue]) => ({
    status,
    revenue
  }));

  return (
    <Container maxW="container.xl" py={4}>
      <Heading size="lg" mb={4}>Thống kê Doanh thu</Heading>

      <Flex mb={4}>
        <Select
          placeholder="Lọc theo user"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          mr={4}
        >
          {/* Options for filtering by user */}
        </Select>

        <Select
          placeholder="Lọc theo trạng thái đơn hàng"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {/* Options for filtering by order status */}
        </Select>
      </Flex>

      <SimpleGrid columns={[1, 2, 4]} spacing={4}>
        <Stat>
          <StatLabel>Tổng Doanh thu</StatLabel>
          <StatNumber>{revenueData.totalRevenue} ₫</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Tổng Số Đơn Hàng</StatLabel>
          <StatNumber>{revenueData.totalOrders}</StatNumber>
        </Stat>
        {/* Add more stats here */}
      </SimpleGrid>

      <Box mt={8}>
        <Heading size="md" mb={4}>Doanh thu theo trạng thái đơn hàng</Heading>
        <BarChart
          width={800}
          height={400}
          data={dataForChart}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </Box>

      <Box mt={8}>
        <Heading size="md" mb={4}>Người dùng mua hàng nhiều nhất</Heading>
        <SimpleGrid columns={[1, 2, 4]} spacing={4}>
          {revenueData.topUsers.map((user, index) => (
            <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="sm" mb={2}>{user.name}</Heading>
              <Stat>
                <StatLabel>Số Đơn Hàng</StatLabel>
                <StatNumber>{user.orders}</StatNumber>
              </Stat>
              <Heading size="xs" mt={4} mb={2}>Top Mặt Hàng</Heading>
              <ul>
                {user.topProducts.map((product, index) => (
                  <li key={index}>
                    {product.name} - {product.quantity} sản phẩm
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box mt={8}>
        <Heading size="md" mb={4}>Mặt hàng được mua nhiều nhất</Heading>
        <SimpleGrid columns={[1, 2, 4]} spacing={4}>
          {revenueData.topProducts.map((product, index) => (
            <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="sm" mb={2}>{product.name}</Heading>
              <Stat>
                <StatLabel>Số Lượng</StatLabel>
                <StatNumber>{product.quantity}</StatNumber>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

    </Container>
  );
};

export default RevenueDashboard;
