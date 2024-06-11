"use client"
import React from 'react';
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { theme } from "../../theme";
import { Footer } from '@/components/Footer';
import { AppContextProvider } from '@/context/AppContext';
import { Sidebar } from '@/components/Sidebar';
import store from '@/store';
import { Provider } from 'react-redux';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <AppContextProvider>
              <Provider store={store}>
                <Flex direction="column" minH="100vh">
                  <Flex flex="1" w="full">
                    <Sidebar />
                    <Box flex="1" p="5">
                      {children}
                    </Box>
                  </Flex>
                  <Footer />
                </Flex>
              </Provider>
            </AppContextProvider>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
