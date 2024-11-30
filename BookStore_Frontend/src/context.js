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
  useEffect(() => {
    if (loggedUser.userid) {
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
          if (responseUser.status === 200 && responseUserAddress.status === 200) {
            const data1 = responseUser.data;
            const data2 = responseUserAddress.data;
            // Xử lý hiển thị địa chỉ
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
          showToast("Lỗi khi lấy thông tin user");
          console.error("Error fetching cart items", error);
        }
      
      };
      LoadUserInformation();
    }
  }, [loggedUser.userid]);

  return (
    <DeliveryInfoContext.Provider value={[state, setState]}>
      {children}
    </DeliveryInfoContext.Provider>
  );
}

export { DeliveryInfoProvider, DeliveryInfoContext };
