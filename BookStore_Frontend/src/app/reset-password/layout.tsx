"use client"
import { CartProvider } from "@/CartContext"
import { CategoryProvider } from "@/CategoryContext"
import { CheckOutProvider } from "@/checkoutContext"
import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar/Navbar"
import { AppContextProvider } from "@/context/AppContext"
import { RecentlyViewedProductsProvider } from "@/RecentlyViewedProductsContext"
import store from "@/store"
import { theme } from "@/theme"
import { WishListProvider } from "@/WishlistContext"
import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider } from "@chakra-ui/react"
import { Provider } from "react-redux"

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
                <RecentlyViewedProductsProvider>
                  <WishListProvider>
                    <CartProvider>
                      <CheckOutProvider>
                      <CategoryProvider>
                        <Navbar />
                        {children}
                        <Footer />
                        </CategoryProvider>
                      </CheckOutProvider>
                    </CartProvider>
                  </WishListProvider>
                </RecentlyViewedProductsProvider>
              </AppContextProvider>
            </Provider>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
