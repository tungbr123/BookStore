"use client"
import api from "@/ApiProcess/api";
import showToast from "@/hooks/useToast";
import { IContext, IItem, IProduct, IState, ItemKey } from "@/model";
import { ReactNode, createContext, useState } from "react";
import { useSelector } from "react-redux";


export const AppConText = createContext<IContext>(null as any)

interface IAppContextProviderProps {
    children: ReactNode;
}


export const AppContextProvider = ({ children }: IAppContextProviderProps) => {
    // const loggedUser = useSelector((state) => state.auth)
    // const response = await api.get(`getCartID?userid=${loggedUser.userid}`, {
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // if (response.status == 200) {
    //   const data:IItem = await response.data
    //   showToast("Lấy giỏ hàng thành công")
    // }
    const initialState: IState = {
        cart: [],
        wishlist: [],
        checkout: []
    }
    const [state, setState] = useState<IState>(initialState);

    const addItem = (key: ItemKey, product: IProduct, count?: number) => {
        setState((prevState) => ({
            ...prevState,
            [key]: [...prevState[key], { ...product, count: count || 1 }]
        }))
    };
    const removeItem = (key: ItemKey, productId: number) => {
        setState((prevState) => ({
            ...prevState,
            [key]: prevState[key].filter((item) => item.id !== productId),
        }))
    }
    const increaseCount = (key: ItemKey, productId: number) => {
        const items = [...state[key]];
        const index = items.findIndex((item) => item.id === productId);
        items[index].count += 1;
        setState((prevState) => ({ ...prevState, [key]: items }));
    };

    const decreaseCount = (key: ItemKey, productId: number) => {
        const items = [...state[key]];
        const index = items.findIndex((item) => item.id === productId);
        if (items[index].count > 1) {
            items[index].count -= 1;
        }
        setState((prevState) => ({ ...prevState, [key]: items }));
    };
    
    const resetItems = (key: ItemKey) => {
        setState((prevState) => ({ ...prevState, [key]: [] }))
    }
    const isAdded = (key: ItemKey, productId: number): boolean => {
        return state[key].some(item => item.id === productId)
    }
    return <AppConText.Provider value={{ state, addItem, removeItem, increaseCount, decreaseCount, resetItems, isAdded }}>
        {children}
    </AppConText.Provider>
}