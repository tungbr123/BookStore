import React from 'react'
import { Heading, TableContainer, Grid, Table, Thead, Tr, Tbody, Td, Th, Select, Flex, Text, Box, Button, Input } from '@chakra-ui/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    BarElement,
  } from 'chart.js'
import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    BarElement,
    LinearScale,
    Tooltip,
    Legend
  )
const revenueData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [50000, 60000, 75000, 80000, 90000, 100000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const studentData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Học viên',
        data: [100, 200, 300, 400, 500, 600],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Options for chart scales
  const chartOptions = {
    scales: {
      x: {
        type: 'category', // Specify 'category' scale for X-axis
        position: 'bottom', // or 'top', depending on your preference
      },
      y: {
        type: 'linear', // Use 'linear' scale for Y-axis
        position: 'left', // or 'right', depending on your preference
      },
    },
  };
const TableDashboard = () => {
  return (
    <Grid templateColumns="1fr 1fr" gap={4}>
        <Box mt={10}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Biểu đồ doanh thu
            </Text>
            <Bar data={revenueData}  />
        </Box>

        <Box mt={10}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Biểu đồ học viên
            </Text>
            <Bar data={studentData}  />
        </Box>
        <Box>
            <Heading mb={4} size="md">Top khóa học</Heading>
            <TableContainer>
                <Table variant='striped' colorScheme='gray' userSelect='none'>
                    <Thead>
                    <Tr>
                        <Th textAlign="center">STT</Th>
                        <Th textAlign="center">Khóa học</Th>
                        <Th textAlign="center">Số học viên</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {
                        data.map((item, index) => {
                            return (
                                <Tr key={index}>
                                    <Td>
                                        <Flex flexDirection='column'>
                                            <Text fontSize='md' textAlign="center">{index}</Text>
                                        </Flex>
                                    </Td>
                                    <Td>
                                        <Flex flexDirection='column'>
                                            <Text fontSize='md' textAlign="center">{item.name}</Text>
                                        </Flex>
                                    </Td>
                                    <Td>
                                        <Flex flexDirection='column'>
                                            <Text fontSize='md' textAlign="center">10</Text>
                                        </Flex>
                                    </Td>
                                </Tr>
                            )
                        })
                    }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
        <Box>
            <Heading mb={4} size="md">Top học viên</Heading>
            <TableContainer>
                <Table variant='striped' colorScheme='gray' userSelect='none'>
                    <Thead>
                    <Tr>
                        <Th textAlign="center">STT</Th>
                        <Th textAlign="center">Họ tên</Th>
                        <Th textAlign="center">Hoàn thành</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {
                        data.map((item, index) => {
                            return (
                                <Tr key={index}>
                                    <Td>
                                        <Flex flexDirection='column'>
                                            <Text fontSize='md' textAlign="center">{index}</Text>
                                        </Flex>
                                    </Td>
                                    <Td>
                                        <Flex flexDirection='column'>
                                            <Text fontSize='md' textAlign="center">{item.name}</Text>
                                        </Flex>
                                    </Td>
                                    <Td>
                                        <Flex flexDirection='column'>
                                            <Text fontSize='md' textAlign="center">164 bài</Text>
                                        </Flex>
                                    </Td>
                                </Tr>
                            )
                        })
                    }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    </Grid>
  )
}

export default TableDashboard

const data = [
    {
        id: 'CN12312',
        image: 'https://www.huongnghiepaau.com/wp-content/uploads/2020/11/image-seo-featured-image.jpg',
        name: 'Tiếng Trung cao cấp 2 (HSK 6)',
        teacherName: 'Thầy Trung',
        studyPath: '#',
        coursePath: '#',
        retailPrice: '800.000đ',
        price: '499.000đ',
        status: true,
    },
    {
        id: 'CN12312',
        image: 'https://www.huongnghiepaau.com/wp-content/uploads/2020/11/image-seo-featured-image.jpg',
        name: 'Tiếng Trung cao cấp 2 (HSK 6)',
        teacherName: 'Thầy Trung',
        studyPath: '#',
        coursePath: '#',
        retailPrice: '800.000đ',
        price: '499.000đ',
        status: false,
    },
    {
        id: 'CN12312',
        image: 'https://www.huongnghiepaau.com/wp-content/uploads/2020/11/image-seo-featured-image.jpg',
        name: 'Tiếng Trung cao cấp 2 (HSK 6)',
        teacherName: 'Thầy Trung',
        studyPath: '#',
        coursePath: '#',
        retailPrice: '800.000đ',
        price: '499.000đ',
        status: true,
    },
    {
        id: 'CN12312',
        image: 'https://www.huongnghiepaau.com/wp-content/uploads/2020/11/image-seo-featured-image.jpg',
        name: 'Tiếng Trung cao cấp 2 (HSK 6)',
        teacherName: 'Thầy Trung',
        studyPath: '#',
        coursePath: '#',
        retailPrice: '800.000đ',
        price: '499.000đ',
        status: true,
    },
    {
        id: 'CN12312',
        image: 'https://www.huongnghiepaau.com/wp-content/uploads/2020/11/image-seo-featured-image.jpg',
        name: 'Tiếng Trung cao cấp 2 (HSK 6)',
        teacherName: 'Thầy Trung',
        studyPath: '#',
        coursePath: '#',
        retailPrice: '800.000đ',
        price: '499.000đ',
        status: true,
    }
]
