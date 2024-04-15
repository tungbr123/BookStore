"use client"

import 'swiper/swiper-bundle.css';
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider, Link } from "@chakra-ui/next-js";
import { theme } from "./theme";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from '@/components/Footer';




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <Navbar />
            {children}
            <Footer />
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
