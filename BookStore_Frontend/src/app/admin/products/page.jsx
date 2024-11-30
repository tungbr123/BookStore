"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
  Heading,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Flex,
  Select,
} from '@chakra-ui/react';
import axios from 'axios';

const ProductForm = ({ products, setProducts, selectedProduct, setSelectedProduct, onClose, handleSubmitProduct }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [promotional_price, setPromotional_price] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [sold, setSold] = useState(0);
  const [image, setImage] = useState('');
  const [category_id, setCategory_id] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setDescription(selectedProduct.description);
      setPrice(selectedProduct.price);
      setPromotional_price(selectedProduct.promotional_price);
      setQuantity(selectedProduct.quantity);
      setSold(selectedProduct.sold);
      setImage(selectedProduct.image);
      setCategory_id(selectedProduct.category_id);
    }
  }, [selectedProduct]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ysfhyepr'); // Thay thế bằng upload preset của bạn trên Cloudinary

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/dqyfftfrb/image/upload`, formData);
      return response.data.secure_url; // URL của hình ảnh sau khi upload
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = image;
    if (image instanceof File) {
      imageUrl = await handleImageUpload(image);
    }

    const product = {
      id: selectedProduct ? selectedProduct.id : products.length + 1,
      name,
      description,
      price,
      promotional_price: promotional_price,
      quantity,
      sold,
      image: imageUrl,
      category_id: category_id,
    };

    handleSubmitProduct(product);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice(0);
    setPromotional_price(0);
    setQuantity(0);
    setSold(0);
    setImage('');
    setCategory_id('');
    setSelectedProduct(null);
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mt={4} p={4} borderWidth="1px" borderRadius="lg">
      <FormControl id="name" isRequired>
        <FormLabel>Tên sản phẩm</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl id="description" mt={4} isRequired>
        <FormLabel>Mô tả</FormLabel>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>

      <FormControl id="price" mt={4} isRequired>
        <FormLabel>Giá</FormLabel>
        <Input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="promotional_price" mt={4}>
        <FormLabel>Giá khuyến mãi</FormLabel>
        <Input type="number" value={promotional_price} onChange={(e) => setPromotional_price(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="quantity" mt={4} isRequired>
        <FormLabel>Số lượng</FormLabel>
        <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="sold" mt={4}>
        <FormLabel>Đã bán</FormLabel>
        <Input type="number" value={sold} onChange={(e) => setSold(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="image" mt={4}>
        <FormLabel>Ảnh</FormLabel>
        <Input type="file" onChange={handleImageChange} />
        {image && typeof image === 'string' ? <Image src={image} alt="Product Image" boxSize="50px" mt={2} /> : null}
      </FormControl>

      <FormControl id="category_id" mt={4} isRequired>
        <FormLabel>Danh mục</FormLabel>
        <Input type="Text" value={category_id} onChange={(e) => setCategory_id(parseInt(e.target.value))} />
      </FormControl>

      <Button mt={4} colorScheme="teal" type="submit">
        {selectedProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
      </Button>
      <Button mt={4} ml={4} onClick={resetForm}>
        Đặt lại
      </Button>
    </Box>
  );
};

const ProductTable = ({ products, onEdit, onDelete, onViewDetails }) => {
  return (
    <Table mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <Thead>
        <Tr>
          <Th>Tên sản phẩm</Th>
          <Th>Giá</Th>
          <Th>Giá khuyến mãi</Th>
          <Th>Số lượng</Th>
          <Th>Đã bán</Th>
          <Th>Ảnh</Th>
          <Th>Danh mục</Th>
          <Th>Hành động</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map(product => (
          <Tr key={product.id}>
            <Td>{product.name}</Td>
            <Td>{product.price}</Td>
            <Td>{product.promotional_price}</Td>
            <Td>{product.quantity}</Td>
            <Td>{product.sold}</Td>
            <Td>
              <Image src={product.image} alt={product.name} boxSize="50px" />
            </Td>
            <Td>{product.category_name}</Td>
            <Td>
              <HStack spacing={2}>
                <Button colorScheme="teal" size="sm" onClick={() => onEdit(product)}>
                  Sửa
                </Button>
                {/* <Button colorScheme="red" size="sm" onClick={() => onDelete(product.id)}>
                  Xóa
                </Button> */}
                <Button colorScheme="blue" size="sm" onClick={() => onViewDetails(product)}>
                  Xem chi tiết
                </Button>
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [detailedProduct, setDetailedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Fetch products from backend API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/getAllProductWithPaging`, {
          params: {
            page: currentPage,
            size: pageSize,
            filter: filter, // Chỉ thêm trạng thái nếu không phải "all"
          },
        });
        const productsPage = response.data.data;
        setProducts(productsPage); // Set products from API response
        setTotalPages(productsPage[0].totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize, filter]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/delete/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
    onOpen();
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
    onOpen();
  };

  const handleSubmitProduct = async (product) => {
    try {
      if (selectedProduct) {
        await axios.put(`http://localhost:8080/api/product/update/${selectedProduct.id}`, product);
        setProducts(products.map((p) => (p.id === selectedProduct.id ? product : p)));
      } else {
        const response = await axios.post('http://localhost:8080/api/product/create', product);
        setProducts([...products, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setIsFormOpen(false);
    onClose();
  };

  const handleViewDetails = (product) => {
    setDetailedProduct(product);
    onDetailOpen();
  };

  const filteredProducts = products.filter(product => {
    return (
      (product.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (product.category_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    );
  });
  return (
    <Container maxW="container.xl" py={4}>
      <Heading as="h1" size="xl" mb={4} textAlign="center" color="teal.600">Quản lý sản phẩm</Heading>
      <Flex  justifyContent="space-between"  gap={4} flexWrap="wrap">
        <HStack mb={4}>
          <Input
            placeholder="Tìm kiếm theo tên hoặc danh mục"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mr={4} /* Thêm margin phải để tạo khoảng cách với Select */
          />
          <Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(0);
            }}
            w="400px" /* Điều chỉnh độ rộng Select */
            borderColor="teal.400"
          >
            <option value="all">All</option>
            <option value="leastQuantityProducts">Products with Least Quantity</option>
            <option value="mostSellingProducts">Most Selling Products</option>
            <option value="leastSellingProducts">Least Selling Products</option>
            <option value="mostRatingProducts">Most Rating Products</option>
            <option value="leastRatingProducts">Least Selling Products</option>
          </Select>
        </HStack>
      </Flex>


      <Button colorScheme="teal" onClick={handleAddProduct}>
        Thêm sản phẩm
      </Button>
      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductForm
              products={products}
              setProducts={setProducts}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              onClose={onClose}
              handleSubmitProduct={handleSubmitProduct}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDetailOpen} onClose={onDetailClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{detailedProduct?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailedProduct && (
              <Box>
                <Image src={detailedProduct.image} alt={detailedProduct.name} boxSize="200px" bgSize="contain" />
                <Text mt="1rem"><strong>Mô tả:</strong> {detailedProduct.description}</Text>
                <Text mt="1rem"><strong>Giá:</strong> {detailedProduct.price}</Text>
                <Text mt="1rem"><strong>Giá khuyến mãi:</strong> {detailedProduct.promotional_price}</Text>
                <Text mt="1rem"><strong>Số lượng:</strong> {detailedProduct.quantity}</Text>
                <Text mt="1rem"><strong>Đã bán:</strong> {detailedProduct.sold}</Text>
                <Text mt="1rem"><strong>Danh mục:</strong> {detailedProduct.category_name}</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onDetailClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProductManagement;
