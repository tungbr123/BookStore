"use client"
import { CartProvider } from "@/CartContext"
import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar/Navbar"
import { AppContextProvider } from "@/context/AppContext"
import store from "@/store"
import { theme } from "@/theme"
import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider } from "@chakra-ui/react"
import { Provider } from "react-redux"
import {CheckOutProvider} from "@/checkoutContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <Provider store={store}>
              <AppContextProvider>
                <CartProvider>
                  <CheckOutProvider>
                  <Navbar />
                  {children}
                  <Footer />
                  </CheckOutProvider>
                </CartProvider>
              </AppContextProvider>
            </Provider >
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
