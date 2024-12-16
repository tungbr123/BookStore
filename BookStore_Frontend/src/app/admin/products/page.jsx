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
import showToast from '@/hooks/useToast';

const ProductForm = ({ products, setProducts, selectedProduct, setSelectedProduct, onClose, handleSubmitProduct }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [promotional_price, setPromotional_price] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [sold, setSold] = useState(0);
  const [image, setImage] = useState('');
  const [translator, setTranslator] = useState('');
  const [supplier, setSupplier] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publishedDate, setPublishedDate] = useState(0);
  const [pages, setPages] = useState(0);
  const [weight, setWeight] = useState(0);
  const [list_category, setListCategory] = useState([])
  const [author, setAuthor] = useState([])

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setDescription(selectedProduct.description);
      setPrice(selectedProduct.price);
      setPromotional_price(selectedProduct.promotional_price);
      setQuantity(selectedProduct.quantity);
      setSold(selectedProduct.sold);
      setImage(selectedProduct.image);
      setTranslator(selectedProduct.translator || '');
      setSupplier(selectedProduct.supplier || '');
      setPublisher(selectedProduct.publisher || '');
      setPublishedDate(selectedProduct.published_date || 0);
      setPages(selectedProduct.pages || 0);
      setWeight(selectedProduct.weight || 0);
      setListCategory(selectedProduct.list_category)
      setAuthor(selectedProduct.author_name)
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
      translator,
      supplier,
      publisher,
      published_date: publishedDate,
      pages,
      weight,
      image: imageUrl,

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
    setTranslator('');
    setSupplier('');
    setPublisher('');
    setPublishedDate('');
    setPages(0);
    setWeight(0);
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
        <FormLabel>Product Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl id="description" mt={4} isRequired>
        <FormLabel>Description</FormLabel>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>

      <FormControl id="price" mt={4} isRequired>
        <FormLabel>Price</FormLabel>
        <Input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="promotional_price" mt={4}>
        <FormLabel>Promotional Price</FormLabel>
        <Input type="number" value={promotional_price} onChange={(e) => setPromotional_price(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="quantity" mt={4} isRequired>
        <FormLabel>Quantity</FormLabel>
        <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="sold" mt={4}>
        <FormLabel>Sold</FormLabel>
        <Input type="number" value={sold} onChange={(e) => setSold(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="translator" mt={4}>
        <FormLabel>Translator</FormLabel>
        <Input value={translator} onChange={(e) => setTranslator(e.target.value)} />
      </FormControl>

      <FormControl id="supplier" mt={4}>
        <FormLabel>Supplier</FormLabel>
        <Input value={supplier} onChange={(e) => setSupplier(e.target.value)} />
      </FormControl>

      <FormControl id="publisher" mt={4}>
        <FormLabel>Publisher</FormLabel>
        <Input value={publisher} onChange={(e) => setPublisher(e.target.value)} />
      </FormControl>

      <FormControl id="published_date" mt={4}>
        <FormLabel>Publish Year</FormLabel>
        <Input type="number" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} />
      </FormControl>

      <FormControl id="pages" mt={4}>
        <FormLabel>Pages</FormLabel>
        <Input type="number" value={pages} onChange={(e) => setPages(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="weight" mt={4}>
        <FormLabel>Weight (g)</FormLabel>
        <Input type="number" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} />
      </FormControl>

      <FormControl id="image" mt={4}>
        <FormLabel>Image</FormLabel>
        <Input type="file" onChange={handleImageChange} />
        {image && typeof image === 'string' ? <Image src={image} alt="Product Image" boxSize="50px" mt={2} /> : null}
      </FormControl>

      {/* <FormControl id="category_id" mt={4} isRequired>
    <FormLabel>Category</FormLabel>
    <Input type="Text" value={category_id} onChange={(e) => setCategory_id(parseInt(e.target.value))} />
  </FormControl> */}

      <Button mt={4} colorScheme="teal" type="submit">
        {selectedProduct ? 'Update Product' : 'Add Product'}
      </Button>
      <Button mt={4} ml={4} onClick={resetForm}>
        Reset
      </Button>
    </Box>

  );
};

const ProductTable = ({ products, onEdit, onDelete, onViewDetails }) => {
  return (
    <Table mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <Thead>
        <Tr>
          <Th>Product Name</Th>
          <Th>Price</Th>
          <Th>Promotional Price</Th>
          <Th>Quantity</Th>
          <Th>Sold</Th>
          <Th>Image</Th>
          <Th>Category</Th>
          <Th>Actions</Th>
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
            <Td>
              {Array.isArray(product.list_category)
                ? product.list_category.map(category => category.name).join(', ')
                : 'No categories'}
            </Td>
            <Td>
              <HStack spacing={2}>
                <Button colorScheme="teal" size="sm" onClick={() => onEdit(product)}>
                  Edit
                </Button>
                {/* <Button colorScheme="red" size="sm" onClick={() => onDelete(product.id)}>
              Delete
            </Button> */}
                <Button colorScheme="blue" size="sm" onClick={() => onViewDetails(product)}>
                  View Details
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
  const [reset, setReset] = useState(0)
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
        if(!productsPage)
        {
          setProducts([])
          return;
        }
        setProducts(productsPage); // Set products from API response
        setTotalPages(productsPage[0].totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize, filter, reset]);

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
    const apiProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      promotional_price: product.promotional_price,
      quantity: product.quantity,
      sold: product.sold,
      image: product.image,
      rating: product.rating,
      translator: product.translator,
      supplier: product.supplier,
      publisher: product.publisher,
      published_date: product.published_date,
      pages: product.pages,
      weight: product.weight
    }
    if (reset == 0)
      setReset(1)
    else
      setReset(0)
    try {
      if (selectedProduct) {
        await axios.put(`http://localhost:8080/api/product/update/${selectedProduct.id}`, apiProduct);

      } else {
        await axios.post('http://localhost:8080/api/product/create', product);
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
      (product.list_category?.some(category =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ?? false)
    );
  });

  return (
    <Container maxW="container.xl" py={4}>
      <Heading as="h1" size="xl" mb={4} textAlign="center" color="teal.600">Product Management</Heading>
      <Flex justifyContent="space-between" gap={4} flexWrap="wrap">
        <HStack mb={4}>
          <Input
            placeholder="Search by name or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mr={4} /* Add margin-right to create space with Select */
          />
          <Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(0);
            }}
            w="400px" /* Adjust Select width */
            borderColor="teal.400"
          >
            <option value="all">All</option>
            <option value="leastQuantityProducts">Products with Least Quantity</option>
            <option value="mostSellingProducts">Most Selling Products</option>
            <option value="leastSellingProducts">Least Selling Products</option>
            <option value="mostRatingProducts">Most Rating Products</option>
            <option value="leastRatingProducts">Least Rating Products</option>
          </Select>
        </HStack>
      </Flex>

      <Button colorScheme="teal" onClick={handleAddProduct}>
        Add Product
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
          <ModalHeader>{selectedProduct ? 'Update Product' : 'Add Product'}</ModalHeader>
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
                <Text mt="1rem"><strong>Description:</strong> {detailedProduct.description}</Text>
                <Text mt="1rem"><strong>Price:</strong> {detailedProduct.price}</Text>
                <Text mt="1rem"><strong>Promotional Price:</strong> {detailedProduct.promotional_price}</Text>
                <Text mt="1rem"><strong>Quantity:</strong> {detailedProduct.quantity}</Text>
                <Text mt="1rem"><strong>Sold:</strong> {detailedProduct.sold}</Text>
                <Text mt="1rem"><strong>Category:</strong> {detailedProduct.list_category.map(category => category.name).join(', ')}</Text>
                <Text mt="1rem"><strong>Author:</strong> {detailedProduct.author_name.map(author => author).join(', ')}</Text>
                <Text mt="1rem"><strong>Translator:</strong> {detailedProduct.translator}</Text>
                <Text mt="1rem"><strong>Publisher:</strong> {detailedProduct.publisher}</Text>
                <Text mt="1rem"><strong>Published Year:</strong> {detailedProduct.published_date}</Text>
                <Text mt="1rem"><strong>Supplier:</strong> {detailedProduct.supplier}</Text>
                <Text mt="1rem"><strong>Pages:</strong> {detailedProduct.pages}</Text>
                <Text mt="1rem"><strong>Weight:</strong> {detailedProduct.weight}</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onDetailClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>

  );
};

export default ProductManagement;
