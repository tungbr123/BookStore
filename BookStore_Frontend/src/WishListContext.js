import React, { createContext, useContext, useState } from 'react';
import showToast from './hooks/useToast';
import api from './ApiProcess/api';
import { useSelector } from 'react-redux';

// Create a context for the cart
export const WishListConText = React.createContext();
// Create a provider component
export const WishListProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const loggedUser = useSelector((state) => state.auth);

  const fetchWishlistitem = async () => {
    try {
      const response = await api.get(`getWishlist?userid=${loggedUser.userid}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = response.data.data
        if (Array.isArray(data) ) {
          setWishlist(data); // Assuming you have a setCart function
        }
        else
          console.log(data)

      } else {
        showToast("Lấy thất bại");
      }
    } catch (error) {
      showToast("Lỗi khi lấy Wishlistitem");
      console.error("Error fetching cart items", error);
    };
  }

  return (
    <WishListConText.Provider value={ { wishlist, setWishlist, fetchWishlistitem }   }>
      {children}
    </WishListConText.Provider>
  );
};

// Create a custom hook to use the CartContext
export const useWishList = () => {
  return useContext(WishListConText);
};
