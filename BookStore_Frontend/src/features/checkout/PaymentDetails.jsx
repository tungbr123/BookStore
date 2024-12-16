import api from "@/ApiProcess/api";
import { useCart } from "@/CartContext";
import { useCheckOut } from "@/checkoutContext";
import { DeliveryInfoContext } from "@/context";
import { calculateItemsTotal } from "@/helpers";
import showToast from "@/hooks/useToast";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Select,
  Checkbox,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export const PaymentDetails = () => {
  const router = useRouter();
  const [state, setState] = useContext(DeliveryInfoContext);
  const { cart, setCart, updateItemCount } = useCart();
  const [check, setCheck] = useCheckOut();
  const [checkout, setCheckout] = useState([]);
  const loggedUser = useSelector((state) => state.auth);
  const [subTotal, setSubTotal] = useState(0);
  const [subTotalProducts, setSubTotalProducts] = useState(0);
  const [tax, setTax] = useState(0);
  const [confirmVNPayMethod, setConfirmVNPayMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [selectedBankCode, setSelectedBankCode] = useState("NCB");
  const [isVNPayRedirected, setIsVNPayRedirected] = useState(false);
  const [isPaid, setIsPaid] = useState(0)
  const [filterStatus, setFilterStatus] = useState("active");
  const [vouchers, setVouchers] = useState([]);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [discountAmountOnVouchers, setDiscountAmountOnVouchers] = useState(0)
  const [code, setCode] = useState(""); // State để lưu giá trị từ input
  const [allVouchers, setAllVouchers] = useState(null)
  // Cập nhật subtotal và checkout khi check thay đổi
  useEffect(() => {
    if (check && check.length > 0) {
      const subTotal = calculateItemsTotal(check);
      const tax = 0.1 * subTotal;
      setSubTotalProducts(subTotal);
      setSubTotal(subTotal - discountAmountOnVouchers + 20000);
      setTax(tax);
      setCheckout(check);
    } else {
      console.log("Dữ liệu check rỗng hoặc không hợp lệ.");
    }
  }, [check, discountAmountOnVouchers]);
  // Hàm lấy danh sách voucher
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await api.get(`voucher/${loggedUser.userid}`);
        setVouchers(response.data.data);
      } catch (error) {
        showToast("Failed to fetch vouchers", 1);
      }
    };
    const fetchAllVouchers = async () => {
      try {
        const response = await api.get(`getAllVouchers`);
        setAllVouchers(response.data.data);
      } catch (error) {
        showToast("Failed to fetch vouchers", 1);
      }
    };

    fetchAllVouchers();

    fetchVouchers();
  }, [loggedUser.userid]);
  // Tạo đơn hàng khi confirmVNPayMethod được set thành công
  useEffect(() => {
    if (state.phone && subTotal != 0 && isVNPayRedirected && confirmVNPayMethod === "success" && checkout.length > 0 ) {
      createOrder();
    }
  }, [confirmVNPayMethod, checkout, subTotal, state.phone]);
  // Hàm để tick voucher khi chọn
  const handleVoucherSelect = (voucher) => {
    setSelectedVouchers((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (selectedVoucher) => selectedVoucher.user_voucher_id === voucher.user_voucher_id
      );
  
      if (isAlreadySelected) {
        // Loại bỏ voucher khỏi danh sách
        return prevSelected.filter(
          (selectedVoucher) => selectedVoucher.user_voucher_id !== voucher.user_voucher_id
        );
      } else {
        // Thêm voucher vào danh sách
        return [...prevSelected, voucher];
      }
    });
  };
  

  const filteredVouchers = vouchers.filter((voucher) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return voucher.status === "active";
    if (filterStatus === "expired") return voucher.status === "expired";
    if (filterStatus === "used") return voucher.status === "used";
    return false;
  });
    const handleApplyVoucherWithCode = () => {
    if (!code) {
      showToast("Please enter a voucher code");
      return;
    }
    try {
      // Tìm voucher khớp với code đã nhập
      const matchingVoucher = allVouchers.find(
        (voucher) => voucher.code.toLowerCase() == code.toLowerCase()
      );
      if (!matchingVoucher) {
        showToast("Invalid voucher code");
        return;
      }
  
      // Kiểm tra điều kiện áp dụng
      if (subTotalProducts < matchingVoucher.min_order_value) {
        showToast("Order value does not meet voucher conditions", 1);
        return;
      }
  
      // Tính giảm giá và cập nhật
      let discount = 0;
      if (matchingVoucher.discount_value < 1) {
        discount = subTotalProducts * matchingVoucher.discount_value;
      } else {
        discount = matchingVoucher.discount_value;
      }
      console.log(matchingVoucher);
      setDiscountAmountOnVouchers((prev) => prev + discount);
      setSelectedVouchers((prev) => [...prev, matchingVoucher]);
      showToast("Voucher applied successfully");
  
      // Xóa input sau khi áp dụng
      setCode("");
  
    } catch (error) {
      showToast("Error applying voucher: " + error.message, 1);
    }
  };
  // Hàm tạo đơn hàng
  const createOrder = async () => {
    try {
      if(subTotal != 0)
      {
      const responseOrder = await api.post(
        "addOrder",
        {
          email: state.email,
          userid: loggedUser.userid,
          phone: state.phone,
          address: state.address,
          money_from_user: subTotal,
          name: state.name,
          is_paid_before: isPaid,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (responseOrder.status === 200) {
        const responseOrderItem = await api.post(
          "addOrderitem",
          checkout,
          { headers: { "Content-Type": "application/json" } }
        );

        if (responseOrderItem.status === 200) {
          // await api.delete(`deleteCartitemByUserID?userid=${loggedUser.userid}`, {}, { headers: { "Content-Type": "application/json" } });
          if (discountAmountOnVouchers != 0) {
            const ordersResponse = await api.get(`getOrdersByUserId?userid=${loggedUser.userid}`);
            if (ordersResponse.status === 200) {
              const orders = ordersResponse.data.data;
              // Bước 2: Lấy order_id của đơn hàng cuối cùng
              const lastOrder = orders[orders.length - 1];
              const lastOrderId = lastOrder.id;
              for (const voucher  of selectedVouchers) {
                const orderVoucher = {
                  orderid: lastOrderId,
                  voucher_id: voucher.id,
                  discount_value: voucher.discount_value,
                  userid: loggedUser.userid // hoặc discount_value cụ thể cho từng voucher
                };
                // Gọi API addOrderVoucher cho mỗi voucher_id
                const response = await api.post('addOrderVoucher', orderVoucher);
              }
            }
          }
          showToast("Order placed successfully");
          router.push("/profile/order")
        } else {
          showToast("Failed to add order items");
        }
      } else {
        showToast("Failed to create order");
      }
    }else
    {
      showToast("There are not any order items to pay")
    }
    } catch (error) {
      showToast("Error during order creation: " + error.message, 1);
    }
  };
  // Hàm xử lý khi nhấn OK
  const handleApplyVouchers = () => {
    let totalDiscount = 0;
  
    selectedVouchers.forEach((voucher) => {
      if (subTotalProducts >= voucher.min_order_value) {
        // Nếu discount_value nhỏ hơn 1, tính theo phần trăm
        if (voucher.discount_value < 1) {
          totalDiscount += subTotalProducts * voucher.discount_value;
        } else {
          // Ngược lại, giảm trực tiếp theo giá trị
          totalDiscount += voucher.discount_value;
        }
      }
    });
  
    // Cập nhật tổng giảm giá và tổng số tiền sau khi áp dụng voucher
    setDiscountAmountOnVouchers(totalDiscount);
    setShowVoucherModal(false);
  };
  
  

  // Xử lý thanh toán
  const handlePayMent = async () => {
    try {
      if (paymentMethod === "cashOnDelivery") {
        createOrder();
      } else if (paymentMethod === "vnPay") {
        console.log(subTotal)
        const amount = subTotal;
        const bankCode = selectedBankCode;
        const vnpayUrl = `http://localhost:8080/api/v1/payment/vn-pay?amount=${amount}&bankCode=${bankCode}`;
        if (checkout && checkout.length > 0) {
          sessionStorage.setItem("checkout", JSON.stringify(checkout));
          localStorage.setItem("selectedVouchers", JSON.stringify(selectedVouchers));         
          localStorage.setItem("discountAmountOnVouchers", JSON.stringify(discountAmountOnVouchers));
        } else {
          console.log("Checkout data is empty or invalid.");
          return;
        }
        const vnpayResponse = await axios.get(vnpayUrl, { headers: { "Content-Type": "application/json" } });
        if (vnpayResponse.status === 200 && vnpayResponse.data.data.paymentUrl) {
          window.open(vnpayResponse.data.data.paymentUrl, "_blank");
        } else {
          showToast("Failed to create VNPay payment", 1);
        }
      }
    } catch (error) {
      showToast("Error during payment process: " + error.message, 1);
    }
  };

  // Kiểm tra thanh toán khi redirect về trang
  useEffect(() => {
    const handlePaymentCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get("status");
      const paymentSuccess = status === "success";

      if (paymentSuccess) {
        const savedCheckout = sessionStorage.getItem("checkout");
        const savedSelectedVouchers = localStorage.getItem("selectedVouchers");
        const savedDiscountAmountOnVouchers = localStorage.getItem("discountAmountOnVouchers");
        if (savedCheckout) {
          setCheck(JSON.parse(savedCheckout));
          setCheckout(JSON.parse(savedCheckout));
          setDiscountAmountOnVouchers(JSON.parse(savedDiscountAmountOnVouchers));
          setSelectedVouchers(JSON.parse(savedSelectedVouchers));
          setIsPaid(1);
          setIsVNPayRedirected(true); // Đánh dấu đã redirect
          if (!confirmVNPayMethod) {
            setConfirmVNPayMethod("success");
          }
        } else {
          console.log("checkout in sessionStorage is invalid");
        }
      } else {
        showToast("Payment failed or was cancelled", 1);
      }
    };

    if (window.location.search) {
      handlePaymentCallback();
    }
  }, [confirmVNPayMethod]);

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
              value={code}
              onChange={(e) => setCode(e.target.value)}
              w="190px"
            />
            <Button
              bgColor="brand.primary"
              color="white"
              rounded="full"
              ml="-40px"
              px="2rem"
              onClick={handleApplyVoucherWithCode}
              _hover={{
                bgColor: "brand.primaryDark",
              }}
              _active={{
                bgColor: "brand.primaryDark",
              }}
            >
              Apply Voucher
            </Button>
          </Flex>
          <Divider mt="1rem" />
          {/* Nút chọn voucher */}
          <Button
            onClick={() => setShowVoucherModal(true)}
            bgColor="gray"
            color="black"
            rounded="full"
            _hover={{ bgColor: "brand.secondaryDark" }}
            _active={{ bgColor: "brand.secondaryDark" }}
          >
            Select Voucher
          </Button>

          {/* Modal hiện danh sách voucher */}
          {showVoucherModal && (
            <Box
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex="10"
              bg="white"
              p="1.5rem"
              shadow="2xl"
              rounded="lg"
              width="90%"
              maxWidth="450px"
              borderColor="gray.200"
              borderWidth="1px"
            >
              <Heading size="md" mb="1rem" color="gray.700" textAlign="center">
                Choose Your Voucher
              </Heading>

              {/* Bộ chọn trạng thái */}
              <Select
                mb="1rem"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                bg="gray.100"
                borderColor="gray.300"
                fontSize="sm"
                _hover={{ bg: "gray.200" }}
                _focus={{ borderColor: "blue.400", boxShadow: "outline" }}
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="used">Used</option>
                <option value="all">All</option>
              </Select>

              <Stack spacing="1rem">
                {filteredVouchers.length > 0 ? (
                  filteredVouchers.map((voucher) => (
                    <Flex
                      key={voucher.user_voucher_id}
                      align="center"
                      p="0.75rem"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.200"
                      _hover={{ bg: "gray.50", borderColor: "blue.400" }}
                      transition="all 0.2s"
                    >
                      <Checkbox
                        isChecked={selectedVouchers.some((selected) => selected.user_voucher_id === voucher.user_voucher_id)}
                        onChange={() => handleVoucherSelect(voucher)}
                        size="lg"
                        colorScheme="teal"
                        isDisabled={
                          (filterStatus === "all" || filterStatus === "expired" || filterStatus === "used") &&
                          (voucher.status === "expired" || voucher.status === "used") // Disable for expired or used
                        }
                      >
                        <Box ml="0.5rem">
                          <Text fontSize="sm" fontWeight="bold" color="gray.700">
                            Discount: <Text as="span" color="teal.500">{voucher.discount_value}đ</Text>
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Min Order Value: {voucher.min_order_value}đ
                          </Text>
                          <Badge
                            ml="1rem"
                            colorScheme={
                              voucher.status === "used"
                                ? "purple"
                                : voucher.status === "expired"
                                  ? "red"
                                  : "green"
                            }
                          >
                            {voucher.status === "used" ? "Used" : voucher.status}
                          </Badge>
                        </Box>
                      </Checkbox>
                    </Flex>

                  ))
                ) : (
                  <Text textAlign="center" color="gray.500" fontSize="sm">
                    No vouchers available in this category.
                  </Text>
                )}
              </Stack>

              <Divider my="1rem" />

              <Flex mt="1rem" justify="space-between">
                <Button
                  onClick={() => setShowVoucherModal(false)}
                  variant="outline"
                  borderColor="gray.300"
                  color="gray.600"
                  _hover={{ bg: "gray.100" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyVouchers}
                  bg="teal.400"
                  color="white"
                  _hover={{ bg: "teal.500" }}
                >
                  Apply
                </Button>
              </Flex>
            </Box>

          )}
          <Box>
            <Heading size="xs" my="1rem">
              Payment Options
            </Heading>
            <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
              <Stack>
                <Radio value="cashOnDelivery">COD</Radio>
                <Radio value="vnPay">VNPay</Radio>
                <Radio value="creditCard">Credit Card</Radio>
              </Stack>
            </RadioGroup>

            {paymentMethod === "vnPay" && (
              <Box mt="1rem">
                <FormLabel>Select Bank</FormLabel>
                <Select
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  value={selectedBankCode}
                >
                  <option value="NCB">NCB</option>
                  <option value="BIDV">BIDV</option>
                  <option value="Vietcombank">Vietcombank</option>
                </Select>
              </Box>
            )}
          </Box>
        </Stack>
        <Divider mt="1rem" />

        <Box>
          <Flex justify="space-between" align="center" my="1rem">
            <Text fontWeight="bold">Total Expenditure on Product:</Text>
            <Text fontWeight="bold">{subTotalProducts}đ</Text>
          </Flex>

          <Flex justify="space-between" align="center" my="1rem">
            <Text fontWeight="bold">Voucher</Text>
            <Text fontWeight="bold">-{discountAmountOnVouchers}đ</Text>
          </Flex>

          <Flex justify="space-between" align="center" my="1rem">
            <Text fontWeight="bold">Delivery</Text>
            <Text fontWeight="bold">20000đ</Text>
          </Flex>
          <Divider />
          <Flex justify="space-between" align="center" my="1rem">
            <Text fontWeight="bold">Total</Text>
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
            bgColor: "brand.primaryDark",
          }}
          _active={{
            bgColor: "brand.primaryDark",
          }}
        >
          Pay {subTotal}đ
        </Button>
      </CardBody>
    </Card>
  );
};
