"use client"
import { CheckOut } from "@/features/checkout";
import { NextPage } from "next"
import { DeliveryInfoProvider } from '@/context';
import { CheckOutProvider } from "@/checkoutContext";

const CheckOutPage: NextPage = () => {
    return (
        <DeliveryInfoProvider>
                <div>
                    <CheckOut />
                </div>
        </DeliveryInfoProvider>
    )
}
export default CheckOutPage;