import React, { createContext, useContext, useState } from 'react';

// Create a context for the cart
export const FilterContext = React.createContext();
// Create a provider component
export const FilterProvider = ({ children }) => {
    const [filter, setFilter] = useState('pending');
    return (
        <FilterContext.Provider value={[filter, setFilter]}>
            {children}
        </FilterContext.Provider>
    );
};

// Create a custom hook to use the CartContext
export const useFilter = () => {
    return useContext(FilterContext);
};