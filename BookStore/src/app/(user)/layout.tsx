"use client"

import 'swiper/swiper-bundle.css';
import { ChakraProvider, Flex, HStack, IconButton } from "@chakra-ui/react";
import { CacheProvider, Link } from "@chakra-ui/next-js";
import { theme } from "../../theme";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from '@/components/Footer';
import { AppContextProvider } from '@/context/AppContext';
import React from 'react';
import { Sidebar } from '@/components/Admin/Sidebar';
import { MdMenu } from 'react-icons/md';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapse, setCollapse] = React.useState(false);
  return (
    <html lang="en">
      <head>
        <title>BookStore</title>
        <meta title="description" content="Buy anything you love "></meta>
        {/* <Link rel="icon" type="image/jpg" href="public/bookstore.jpg"></Link> */}
      </head>
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <AppContextProvider>
              <Navbar/>
              {children}
              <Footer />
            </AppContextProvider>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
