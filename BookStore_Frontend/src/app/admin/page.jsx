"use client"

import React, { useEffect, useState } from 'react';
import { Container, Text, SimpleGrid, Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import AdminGuard from '@/components/Admin/AdminGuard';
import TableDashboard from '@/components/Admin/Table';
import { useRouter } from 'next/navigation';



export default function Home() {
  const [isClient, setIsClient] = useState(false)
  // const loggedUser = useSelector((state) => state.auth);
  // const router = useRouter();

  // useEffect(() => {
  //   if (!loggedUser.token || loggedUser.role !== 'admin') {
  //     router.push('/signin');
  //   }
  // }, [loggedUser.token, loggedUser.role, router]);

  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <>
    </>
  )
}