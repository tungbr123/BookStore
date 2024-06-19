// src/ApiProcess/ApiFunction/CartFunction.ts
import api from './../api';
import showToast from '../../hooks/useToast';
// import { IItem } from 'readline';
import { IItem} from "@/model";

export const getCartItemByUserID = async (userid) => {
    try {
        const response = await api.get(`getCartItem?userid=${userid}`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data  = await response.data;
        if (response.status === 200) {
            showToast("Đã lấy cartitem thành công");
    
            return data;
        } else {
            showToast("Lấy thất bại");
            return [];
        }
    } catch (error) {
        showToast("Lỗi khi lấy cartitem");
        console.error("Error fetching cart items", error);
        return [];
    }
};
