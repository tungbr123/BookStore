import React from 'react';
import { Box, VStack, Text, Icon, IconButton, Link, Flex } from '@chakra-ui/react';
import { FiHome, FiBox, FiDollarSign, FiUsers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BiCollection } from "react-icons/bi";
export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      w={isCollapsed ? "80px" : "250px"}
      transition="width 0.2s"
      p="5"
      bg="gray.900"
      color="white"
      h="full"
      boxShadow="lg"
    >
      <IconButton
        aria-label="Toggle Sidebar"
        icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        onClick={toggleSidebar}
        alignSelf="flex-end"
        mb="4"
        colorScheme="whiteAlpha"
      />
      {!isCollapsed && (
        <VStack align="stretch" spacing={6}>
          <Text fontSize="2xl" mb="6" fontWeight="bold" textAlign="center">
            Admin Dashboard
          </Text>
          <Flex align="center" p="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: 'gray.700', color: 'white' }}>
            <Link href="/admin/orders" passHref style={{ textDecoration: 'none' }}>
              <Flex align="center">
                <Icon as={FiHome} fontSize="16" mr="4" />
                <Text>Order Management</Text>
              </Flex>
            </Link>
          </Flex>
          <Flex align="center" p="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: 'gray.700', color: 'white' }}>
            <Link href="/admin/products" passHref style={{ textDecoration: 'none' }}>
              <Flex align="center">
                <Icon as={FiBox} fontSize="16" mr="4" />
                <Text>Product Management</Text>
              </Flex>
            </Link>
          </Flex>
          <Flex align="center" p="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: 'gray.700', color: 'white' }}>
            <Link href="/admin/revenue" passHref style={{ textDecoration: 'none' }}>
              <Flex align="center">
                <Icon as={FiDollarSign} fontSize="16" mr="4" />
                <Text>Revenue Statistics</Text>
              </Flex>
            </Link>
          </Flex>
          <Flex align="center" p="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: 'gray.700', color: 'white' }}>
            <Link href="/admin/users" passHref style={{ textDecoration: 'none' }}>
              <Flex align="center">
                <Icon as={FiUsers} fontSize="16" mr="4" />
                <Text>User Management</Text>
              </Flex>
            </Link>
          </Flex>
          <Flex align="center" p="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: 'gray.700', color: 'white' }}>
            <Link href="/admin/vouchers" passHref style={{ textDecoration: 'none' }}>
              <Flex align="center">
                <Icon as={BiCollection} fontSize="16" mr="4" />
                <Text>Voucher Management</Text>
              </Flex>
            </Link>
          </Flex>
        </VStack>
      )}
    </Box>
  );
};
