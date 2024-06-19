import React, { createContext, useContext, useState } from 'react';
import showToast from './hooks/useToast';
import api from './ApiProcess/api';

// Create a context for the cart
export const CartContext = React.createContext();
// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
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
