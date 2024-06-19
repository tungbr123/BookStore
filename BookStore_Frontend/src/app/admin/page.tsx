"use client"

import React, { useEffect, useState } from 'react';
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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    // <Container >
    <>
    </>
    /* <TableDashboard /> */
    // </Container>
  )
}