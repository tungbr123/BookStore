"use client"

import React, { useEffect } from 'react';
import { Container, Text, SimpleGrid, Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import TableDashboard from '@/components/Admin/Table';

const statData = [
  {
    id: 1,
    label: 'Khóa học',
    score: '10'
  },
  {
    id: 2,
    label: 'Giảng viên',
    score: '2'
  },
  {
    id: 3,
    label: 'Học viên',
    score: '1000'
  },
  {
    id: 3,
    label: 'Tổng doanh thu',
    score: '100.000.000'
  },
];


  export default function Home() {
    return (
      // <Container >
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={5} mb={14}>
          {statData.map((data) => (
            <Box textAlign="center" key={data.id} p={5} boxShadow="md" rounded="md" borderWidth={1} background="#a1a1ff">
              <Text color="#fff">
                {data.score}
              </Text>
              <Text color="#fff" fontSize="19px">{data.label}</Text>
            </Box>
          ))}
        </SimpleGrid> 
        /* <TableDashboard /> */
      // </Container>
    )
  }