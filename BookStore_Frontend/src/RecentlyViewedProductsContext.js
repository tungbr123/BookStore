import React, { createContext, useContext, useEffect, useState } from "react";
import showToast from "./hooks/useToast";
import api from "./ApiProcess/api";
import { useSelector } from "react-redux";

// Create a context for the cart
export const RecentlyViewedProductsContext = React.createContext();
// Create a provider component
export const RecentlyViewedProductsProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const loggedUser = useSelector((state) => state.auth);

  useEffect(() => {
    // Khi component mount, lấy danh sách từ LocalStorage
    if (loggedUser.userid) {
      const storedViewed =
        JSON.parse(window.localStorage.getItem(`recentlyViewed_${loggedUser.userid}`)) || [];
    
        if (!storedViewed) {
          showToast(1)
          window.localStorage.setItem(`recentlyViewed_${loggedUser.userid}`, JSON.stringify([]));
          setRecentlyViewed([]);
      } else {
          setRecentlyViewed(storedViewed);
      }
    }
  }, [loggedUser.userid]);
  const addToRecentlyViewed = (product) => {
    if (!loggedUser.userid) return;

    const maxItems = 5;
    let updatedViewed = recentlyViewed.filter((item) => item.id !== product.id);

    // Thêm sản phẩm mới lên đầu danh sách
    updatedViewed.unshift(product);

    // Giữ danh sách ở giới hạn maxItems
    if (updatedViewed.length > maxItems) {
        updatedViewed.pop();
    }

    // Cập nhật trạng thái và lưu vào LocalStorage
    setRecentlyViewed(updatedViewed);
    window.localStorage.setItem(`recentlyViewed_${loggedUser.userid}`, JSON.stringify(updatedViewed));
};

  return (
    <RecentlyViewedProductsContext.Provider
      value={{ recentlyViewed, setRecentlyViewed, addToRecentlyViewed, }}
    >
      {children}
    </RecentlyViewedProductsContext.Provider>
  );
};

// Create a custom hook to use the CartContext
export const useRecentlyViewedProducts = () => {
  return useContext(RecentlyViewedProductsContext);
};
