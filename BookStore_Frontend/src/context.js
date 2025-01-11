// context.js
import { createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import showToast from "@/hooks/useToast";
import api from "@/ApiProcess/api";
const DeliveryInfoContext = createContext();

function DeliveryInfoProvider({ children }) {
  const loggedUser = useSelector((state) => state.auth);
  const [state, setState] = useState({
    email: "",
    phone: "",
    address: "",
    name: "",
  });
  const LoadUserInformation = async () => {
    try {
      const responseUser = await api.get(
        `getUserById?userid=${loggedUser.userid}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseUserAddress = await api.get(
        `getAddressByUserId/${loggedUser.userid}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (
        responseUser.status === 200 &&
        responseUserAddress.status === 200
      ) {
        const data1 = responseUser.data;
        const data2 = responseUserAddress.data;

        // Xử lý hiển thị địa chỉ
        // Kiểm tra nếu `data2` là null hoặc rỗng
        if (!data2 || data2.length === 0) {
          setState({
            name: data1.lastname + " " + data1.firstname,
            phone: data1.phone,
            address: "", // Giá trị mặc định khi không có địa chỉ
            email: data1.email,
          });
          return;
        }
        const formattedAddresses = data2.map((addr) => ({
          id: addr.id,
          fullAddress: `${addr.apart_num}, ${addr.street}, ${addr.ward}, ${addr.district}, ${addr.city}`,
        }));
        setState({
          name: data1.lastname + " " + data1.firstname,
          phone: data1.phone,
          address: formattedAddresses[0].fullAddress,
          email: data1.email,
        });
      } else {
        showToast("Lấy thất bại");
      }
    } catch (error) {
      showToast("User hiện tại tại chưa có địa chỉ");
      console.error("Error fetching user information", error);
    }
  };
  useEffect(() => {
    if (loggedUser.userid) {
      LoadUserInformation();
    }
  }, [loggedUser.userid]);

  return (
    <DeliveryInfoContext.Provider value={[state, setState, LoadUserInformation]}>
      {children}
    </DeliveryInfoContext.Provider>
  );
}

export { DeliveryInfoProvider, DeliveryInfoContext };
