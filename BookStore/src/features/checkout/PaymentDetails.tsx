import { AppConText } from "@/context/AppContext";
import { calculateItemsTotal } from "@/helpers"
import { Box, Button, Card, CardBody, CardHeader, Divider, Flex, FormLabel, Heading, Input, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";

export const PaymentDetails = () => {
    const [subTotal, setSubTotal] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);
    const {
        state: { checkout },
    } = useContext(AppConText);

    useEffect(() => {
        const subTotal = calculateItemsTotal(checkout);
        const tax = 0.1 * subTotal;
        setSubTotal(subTotal);
        setTax(tax);
    }, [checkout]);
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

                    <Flex justify="space-between" align="center" my="1rem">
                        <Text fontWeight="bold">Thuế(10%)</Text>
                        <Text fontWeight="bold">-{tax}đ</Text>
                    </Flex>

                    <Flex justify="space-between" align="center" my="1rem">
                        <Text fontWeight="bold">Giảm giá voucher</Text>
                        <Text fontWeight="bold">-{tax}đ</Text>
                    </Flex>

                    <Flex justify="space-between" align="center" my="1rem">
                        <Text fontWeight="bold">Phí vận chuyển</Text>
                        <Text fontWeight="bold">-20000đ</Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between" align="center" my="1rem">
                        <Text fontWeight="bold">Tổng tất cả</Text>
                        <Text fontWeight="bold">{subTotal}đ</Text>
                    </Flex>
                </Box>

                <Button
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