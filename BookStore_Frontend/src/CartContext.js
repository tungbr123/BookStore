import React, { createContext, useContext, useState } from 'react';
import showToast from './hooks/useToast';
import api from './ApiProcess/api';
import { useSelector } from 'react-redux';

// Create a context for the cart
export const CartContext = React.createContext();
// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const loggedUser = useSelector((state) => state.auth);

  const fetchCartItems = async () => {
    try {
      const response = await api.get(`getCartItem?userid=${loggedUser.userid}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = response.data.data
        if (Array.isArray(data)) {
          setCart(data); // Assuming you have a setCart function
        }
        else
          console.log(data)

      } else {
        showToast("Lấy thất bại");
        setCart([])
      }
    } catch (error) {
      showToast("Lỗi khi lấy cartitem");
      console.error("Error fetching cart items", error);
      setCart([])
    };
  }
  const updateItemCount = async (cartItemId, newCount) => {
    try {
      const response = await api.put(`updateCartItemCount`, {
        cartItemId: cartItemId,
        count: newCount
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      fetchCartItems()
    } catch (error) {
      console.log(error)
      showToast('An error occurred while updating count');
    }
  };
  return (
    <CartContext.Provider value={ { cart, setCart, updateItemCount }   }>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};
