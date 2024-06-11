import React, { createContext, useContext, useState } from 'react';

// Create a context for the cart
export const CheckOutContext = React.createContext();
// Create a provider component
export const CheckOutProvider = ({ children }) => {
  const [check, setCheck] = useState([]);
  return (
    <CheckOutContext.Provider value={  [check, setCheck]  }>
      {children}
    </CheckOutContext.Provider>
  );
};

// Create a custom hook to use the CartContext
export const useCheckOut = () => {
  return useContext(CheckOutContext);
};
