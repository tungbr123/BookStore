"use client"

import 'swiper/swiper-bundle.css';
import { Box, ChakraProvider, Flex, HStack, IconButton } from "@chakra-ui/react";
import { CacheProvider, Link } from "@chakra-ui/next-js";
import { theme } from "../../theme";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from '@/components/Footer';
import { AppContextProvider } from '@/context/AppContext';
import { AdminNav } from '@/components/Navbar/LayoutAdmin';
import { navbarStyles } from '@/components/Navbar/style';
import { Sidebar } from '@/components/Admin/Sidebar';
import React from 'react';
import { MdMenu } from 'react-icons/md';
import TableDashboard from '@/components/Admin/Table';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapse, setCollapse] = React.useState(false);
  return (

    <html lang="en">
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <AppContextProvider>
              <HStack w="full" h="100vh" bg="gray.100" padding={10}>
              <Flex
                as="aside"
                h="full"
                maxW={collapse ? 350 : 100}
                bg="white"
                alignItems="start"
                padding={6}
                flexDirection="column"
                justifyContent="space-between"
                transition="ease-in-out .2s"
                borderRadius="3xl"
              >
                <Sidebar collapse={collapse} />
              </Flex>
                <Flex
                  as="main"
                  w="full"
                  h="full"
                  bg="white"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  position="relative"
                  borderRadius="3xl"
                >
                  <IconButton
                    aria-label="Menu Colapse"
                    icon={<MdMenu />}
                    position="absolute"
                    top={6}
                    left={6}
                    onClick={() => setCollapse(!collapse)}

                  />
                  {children}
                    <TableDashboard />
                </Flex>
              </HStack>
              <Footer />
            </AppContextProvider>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html >
  )
}
