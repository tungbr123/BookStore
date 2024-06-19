import api from "@/ApiProcess/api";
import { useCart } from "@/CartContext";
import { useCheckOut } from "@/checkoutContext";
import { DeliveryInfoContext } from "@/context";
import { AppConText } from "@/context/AppContext";
import { calculateItemsTotal } from "@/helpers"
import showToast from "@/hooks/useToast";
import { Box, Button, Card, CardBody, CardHeader, Divider, Flex, FormLabel, Heading, Input, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const PaymentDetails = () => {
    const router= useRouter()
    const [state, setState] = useContext(DeliveryInfoContext)
    const {cart, setCart, updateItemCount} = useCart()
    const [check, setCheck] = useCheckOut()
    const [checkout, setCheckOut] =useState([])
    const loggedUser = useSelector((state) => state.auth)
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    // const {
    //     state: { checkout },
    // } = useContext(AppConText);

    useEffect(() => {             
        const subTotal = calculateItemsTotal(check);
        const tax = 0.1 * subTotal;
        setSubTotal(subTotal-5000+20000);
        setTax(tax);
        setCheckOut(check)
    }, [check], state);
    const handlePayMent= async() =>{
        try {
            // Gọi API đăng nhập bên client
            const responseOrder = await api.post('addOrder', {
                email: state.email,
                userid: loggedUser.userid,
                phone: state.phone,
                address: state.address,
                money_from_user: subTotal,
                name: state.name
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (responseOrder.status === 200) {
                // console.log(data.data?.user);
                // localStorage.setItem('user', JSON.stringify(data.data?.user));
                console.log(check)
                const responseOrderItem = await api.post('addOrderitem', 
                    checkout, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if(responseOrderItem.status ==200)
                {

                    const responseDeleteCartItem = await api.delete(`deleteCartitemByUserID?userid=${loggedUser.userid}`,{},
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        } 
                    );
                    if(responseDeleteCartItem.status==200)
                        {
                            showToast('Đặt hàng thành công');
                            router.push('/')
                        }
    
                    else
                        showToast("Xóa cartitem thất bại")
                }
                else
                    showToast('Gửi dữ liệu đơn hàng thất bại');
            } else {
                const message = 'Đăt hàng thất bại';
                showToast(message, 1);
            }
        } catch (error) {

            const message = 'Có lỗi khi đặt hàng'+error;
            showToast(message, 1);
        }
    }
    return (
        <Card borderWidth="1px" borderColor="gray.200" shadow="none" p="2rem">
            <CardHeader>
                <Heading size="md">Payment Details</Heading>
            </CardHeader>
            <CardBody>
                <Stack spacing="2rem">
                    <Flex justify="space-between">
                        <Input
                            type="text"
                            placeholder="Enter Your Voucher"
                            rounded="full"
                            w="190px"
                        />
                        <Button
                            bgColor="brand.primary"
                            color="white"
                            rounded="full"
                            ml="-40px"
                            px="2rem"
                            _hover={{
                                bgColor: 'brand.primaryDark',
                            }}
                            _active={{
                                bgColor: 'brand.primaryDark',
                            }}
                        >
                            Apply Voucher
                        </Button>
                    </Flex>
                    <Divider mt="1rem" />

                    <Box>
                        <Heading size="xs" my="1rem">
                            Payment Option
                        </Heading>
                        <RadioGroup>
                            <Stack>
                                <Radio value="cashOnDelivery">Trả khi nhận hàng</Radio>
                                <Radio value="momo">Thanh toán trực tuyến</Radio>
                                <Radio value="3">Thẻ tín dụng</Radio>
                            </Stack>
                        </RadioGroup>
                    </Box>
                </Stack>
                <Divider mt="1rem" />

                <Box>
                    <Flex justify="space-between" align="center" my="1rem">
                        <Text fontWeight="bold">Giá tổng sản phẩm</Text>
                        <Text fontWeight="bold">{subTotal}đ</Text>
                    </Flex>
{/* 
                    <Flex justify="space-between" align="center" my="1rem">
                        <Text fontWeight="bold">Thuế(10%)</Text>
                        <Text fontWeight="bold">{tax}đ</Text>
                    </Flex> */}

                    <Flex justify="space-between" align="center" my="1rem">
                        <Text fontWeight="bold">Giảm giá voucher</Text>
                        <Text fontWeight="bold">-5000đ</Text>
                    </Flex>

                    <Flex justify="space-between" align="center" my="1rem">
                        <Text fontWeight="bold">Phí vận chuyển</Text>
                        <Text fontWeight="bold">20000đ</Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between" align="center" my="1rem">
                        <Text fontWeight="bold">Tổng tất cả</Text>
                        <Text fontWeight="bold">{subTotal}đ</Text>
                    </Flex>
                </Box>

                <Button
                    onClick={handlePayMent}
                    bgColor="brand.primary"
                    color="white"
                    w="100%"
                    rounded="full"
                    _hover={{
                        bgColor: 'brand.primaryDark',
                    }}
                    _active={{
                        bgColor: 'brand.primaryDark',
                    }}
                >
                    Pay {subTotal}đ
                </Button>
            </CardBody>
        </Card>
    )
}