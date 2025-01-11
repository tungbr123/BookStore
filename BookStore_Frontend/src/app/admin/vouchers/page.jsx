"use client";
import api from "@/ApiProcess/api";
import { useState, useEffect } from "react";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Tag,
    Flex,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    FormControl,
    FormLabel,
    useToast,
    CheckboxGroup,
    VStack,
    Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import useCustomToast from "@/hooks/toast";

const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentVoucher, setCurrentVoucher] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [currentVoucherId, setCurrentVoucherId] = useState(null);
    const [productVoucherList, setProductVoucherList] = useState([]); // Danh sách sản phẩm đã có voucher

    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [pageSize, setPageSize] = useState(3);
    const toast = useToast();
    const loggedUser = useSelector((state) => state.auth);
    const router = useRouter();
    const toast1 = useCustomToast();
    useEffect(() => {
      if (!loggedUser.token || loggedUser.role != 1) {
        router.push('/signin');
      }
    }, [loggedUser.token, loggedUser.role, router]);
    // Fetch vouchers from backend
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/getAllVouchersWithPaging`, {
                    params: {
                        page: currentPage,
                        size: pageSize,
                    },
                });
                const data = response.data.data;
                console.log(data)
                setVouchers(data.content);
                setTotalPages(data.totalPages);
                setFilteredVouchers(data.content);
            } catch (error) {
                toast({
                    title: "Error fetching vouchers",
                    description: error.response?.data?.message || error.message,
                    status: "error",
                    duration: 5000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, [vouchers, currentPage, pageSize]);
    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("api/product/getAllProduct");
                setProducts(response.data.data);
                // Lấy danh sách ProductVoucher
                const voucherResponse = await api.get("getAllProductVoucher");
                const data = voucherResponse.data.data
                const filteredProducts = data.filter(
                    (pv) => pv.voucher_id == currentVoucherId
                );
                setProductVoucherList(filteredProducts.map((pv) => pv.product_id));
            } catch (error) {
                toast({
                    title: "Error fetching products",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                });
            }
        };

        fetchProducts();
    }, [selectedProducts, currentVoucherId]);
    // Filter Logic
    useEffect(() => {
        if (statusFilter === "all") {
            setFilteredVouchers(vouchers);
        } else {
            const today = new Date();
            if(statusFilter ==="active"){ 
                setFilteredVouchers(vouchers.filter((voucher) => {
                    const endDate = new Date(voucher.end_date);
                    return endDate >= today
                }))
            }
            else{              
                setFilteredVouchers(vouchers.filter((voucher) => {
                    const endDate = new Date(voucher.end_date);
                    return endDate < today
                }))
            }
        }
    }, [statusFilter, filteredVouchers]);
    // Handle Add Voucher to Products


    const handleAddVoucherToProducts = async () => {
        if (!currentVoucherId || selectedProducts.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one product.",
                status: "error",
                duration: 5000,
            });
            return;
        }

        try {
            const response = await api.post("addProductVoucher", {
                voucherId: currentVoucherId,
                productIds: selectedProducts,
            });

            if (response.status === 200) {
                toast({
                    title: "Voucher added successfully",
                    status: "success",
                    duration: 5000,
                });
                setIsProductModalOpen(false);
                setSelectedProducts([]);
            } else {
                throw new Error("Failed to add voucher to products");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
            });
        }
    };
    // Handle Add/Edit
    const handleSubmit = async () => {
        try {
            console.log(currentVoucher)
            if (
                !currentVoucher.code ||
                !currentVoucher.type ||
                !currentVoucher.discount_value ||
                !currentVoucher.min_order_value ||
                !currentVoucher.start_date ||
                !currentVoucher.end_date ||
                !currentVoucher.usage_limit
            ) {
                toast({
                    title: "Validation Error",
                    description: "All fields are required.",
                    status: "error",
                    duration: 5000,
                });
                return;
            }

            if (isEditing) {
                await api.put(`updateVoucher/${currentVoucher.id}`, currentVoucher);
                setVouchers((prev) =>
                    prev.map((v) =>
                        v.id === currentVoucher.id ? { ...v, ...currentVoucher } : v
                    )
                );
                toast({
                    title: "Updated successfully",
                    status: "success",
                    duration: 5000,
                });
            } else {
                const response = await api.post("addVoucher", currentVoucher);
                setVouchers((prev) => [...prev, response.data]);
                toast({
                    title: "Added successfully",
                    status: "success",
                    duration: 5000,
                });
            }
            setIsModalOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
            });
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete?");
            if (!confirmDelete) return;

            await api.delete(`deleteVoucher/${id}`);
            setVouchers((prev) => prev.filter((v) => v.id !== id));
            toast({
                title: "Deleted successfully",
                status: "success",
                duration: 5000,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
            });
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
 <Box p={6}>
            <Flex justifyContent="space-between" mb={4}>
                <Select
                    width="200px"
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                </Select>
                <Button
                    colorScheme="teal"
                    onClick={() => {
                        setIsEditing(false);
                        setCurrentVoucher(null);
                        setIsModalOpen(true);
                    }}
                >
                    Add New Voucher
                </Button>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Code</Th>
                        <Th>Type</Th>
                        <Th>Discount</Th>
                        <Th>Min Order</Th>
                        <Th>Usage Limit</Th>
                        <Th>Start Date</Th>
                        <Th>End Date</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredVouchers.length > 0 ? (

                        filteredVouchers.map((voucher) => (
                            <Tr key={voucher.id}>
                                <Td>{voucher.code}</Td>
                                <Td>
                                    <Tag colorScheme={voucher.type === "product" ? "blue" : "green"}>
                                        {voucher.type}
                                    </Tag>
                                </Td>
                                <Td>{voucher.discount_value}đ</Td>
                                <Td>{voucher.min_order_value}đ</Td>
                                <Td>{voucher.usage_limit}</Td>
                                <Td>{voucher.start_date}</Td>
                                <Td>{voucher.end_date}</Td>
                                <Td>
                                    <Flex gap={2}>
                                        {voucher.type === "product" && (
                                            <Button
                                                size="sm"
                                                colorScheme="blue"
                                                onClick={() => {
                                                    setCurrentVoucherId(voucher.id);
                                                    setIsProductModalOpen(true);
                                                }}
                                            >
                                                Add
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            colorScheme="blue"
                                            onClick={() => {
                                                setIsEditing(true);
                                                setCurrentVoucher(voucher);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            onClick={() => handleDelete(voucher.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan="8" textAlign="center" color="gray.500">
                                No vouchers found
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                <Button
                    isDisabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                >
                    Previous
                </Button>
                <Box>
                    Page {currentPage + 1} of {totalPages}
                </Box>
                <Button
                    isDisabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                >
                    Next
                </Button>
            </Box>
            {/* Modal for selecting products */}
            <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select Products</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <CheckboxGroup
                            value={selectedProducts}
                            onChange={(values) => setSelectedProducts(values)}

                        >
                            <VStack align="start">
                                {products.map((product) => (
                                    <Checkbox
                                        key={product.id}
                                        value={product.id.toString()}
                                        isDisabled={productVoucherList.includes(product.id)} // Disable checkbox nếu sản phẩm đã có voucher
                                    >
                                        {product.name}
                                        {productVoucherList.includes(product.id) && " (Already has this voucher)"} {/* Thông báo sản phẩm đã có voucher */}
                                    </Checkbox>
                                ))}
                            </VStack>
                        </CheckboxGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddVoucherToProducts}>
                            Add
                        </Button>
                        <Button variant="ghost" onClick={() => setIsProductModalOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isEditing ? "Edit Voucher" : "Add Voucher"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Code</FormLabel>
                            <Input
                                value={currentVoucher?.code || ""}
                                onChange={(e) =>
                                    setCurrentVoucher((prev) => ({
                                        ...prev,
                                        code: e.target.value,
                                    }))
                                }
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Type</FormLabel>
                            <Select
                                value={currentVoucher?.type || "product"}
                                onChange={(e) =>
                                    setCurrentVoucher((prev) => ({
                                        ...prev,
                                        type: e.target.value,
                                    }))
                                }
                            >
                                <option value="product">Product</option>
                                <option value="platform">Platform</option>
                            </Select>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Discount Value</FormLabel>
                            <Input
                                type="number"
                                value={currentVoucher?.discount_value || ""}
                                onChange={(e) =>
                                    setCurrentVoucher((prev) => ({
                                        ...prev,
                                        discount_value: Number(e.target.value),
                                    }))
                                }
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Min Order Value</FormLabel>
                            <Input
                                type="number"
                                value={currentVoucher?.min_order_value || ""}
                                onChange={(e) =>
                                    setCurrentVoucher((prev) => ({
                                        ...prev,
                                        min_order_value: Number(e.target.value),
                                    }))
                                }
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Usage Limit</FormLabel>
                            <Input
                                type="number"
                                value={currentVoucher?.usage_limit || ""}
                                onChange={(e) =>
                                    setCurrentVoucher((prev) => ({
                                        ...prev,
                                        usage_limit: e.target.value,
                                    }))
                                }
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Start Date</FormLabel>
                            <Input
                                type="date"
                                value={currentVoucher?.start_date || ""}
                                onChange={(e) =>
                                    setCurrentVoucher((prev) => ({
                                        ...prev,
                                        start_date: e.target.value,
                                    }))
                                }
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>End Date</FormLabel>
                            <Input
                                type="date"
                                value={currentVoucher?.end_date || ""}
                                onChange={(e) =>
                                    setCurrentVoucher((prev) => ({
                                        ...prev,
                                        end_date: e.target.value,
                                    }))
                                }
                            />
                        </FormControl>

                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => handleSubmit(currentVoucher)}
                        >
                            Save
                        </Button>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
        </Box>
    );
};

export default VoucherManagement;
