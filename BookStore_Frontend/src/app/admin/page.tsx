"use client"

import React, { useEffect, useState } from 'react';
import { Container, Text, SimpleGrid, Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import TableDashboard from '@/components/Admin/Table';



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