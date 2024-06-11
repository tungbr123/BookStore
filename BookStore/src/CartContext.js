import React, { createContext, useContext, useState } from 'react';

// Create a context for the cart
export const CartContext = React.createContext();
// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  return (
    <CartContext.Provider value={ [cart, setCart]   }>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};
