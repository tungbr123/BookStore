"use client";

import { useEffect, useState } from "react";
import { Box, Button, Grid, Heading, Image, Text, Stack, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import api from "@/ApiProcess/api";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const loggedUser = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await api.get(`getVoucherByUserIdAndStatus?userid=${loggedUser.userid}&status=${filter}`);
        const data = await response.data.data;
        if(data)
          setVouchers(data);
        else
          setVouchers([])
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [loggedUser.userid, filter]);

  console.log(vouchers)

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Box>
    );

  return (
    <Box maxW="1200px" mx="auto" p={4}>
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Your Vouchers
      </Heading>

      {/* Filter Options */}
      <Stack direction="row" spacing={4} justify="center" mb={6}>
        {["all", "active", "expired", "used"].map((status) => (
          <Button
            key={status}
            colorScheme={filter == status ? "teal" : "gray"}
            variant={filter == status ? "solid" : "outline"}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </Stack>

      {/* Voucher Cards */}
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {vouchers.map((voucher) => (
          <Box
            key={voucher.user_voucher_id}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            overflow="hidden"
            _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
          >
            <Image
              src={voucher.image_voucher}
              alt="Voucher"
              objectFit="cover"
              height="200px"
            />

            <Box p={4} textAlign="center">
              <Text fontSize="xl" fontWeight="bold" color="teal.600">
                {voucher.discount_value > 1
                  ? `${voucher.discount_value}đ`
                  : `${voucher.discount_value * 100}%`}
              </Text>
              <Text fontSize="md" color="gray.600">
                Min Order: {voucher.min_order_value}đ
              </Text>
              <Text fontSize="sm" color="gray.500">
                End Date: {new Date(voucher.end_date).toLocaleDateString()}
              </Text>
              <Text
                mt={2}
                fontWeight="bold"
                color={
                  voucher.status === "active"
                    ? "green.500"
                    : voucher.status === "expired"
                      ? "red.500"
                      : "gray.500"
                }
              >
                Status: {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default VoucherPage;
