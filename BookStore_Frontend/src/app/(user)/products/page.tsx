"use client";

import React, { useState, useEffect } from 'react';
import { AllProducts } from '@/features/products';
import { Hero } from '@/components/Hero/Hero';
import { IProduct, ICategory } from '@/model';
import { Box, Flex, Text, Button, Input, useSafeLayoutEffect } from '@chakra-ui/react';
import { useCategoryContext } from '@/CategoryContext';

const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [ categories, setCategories ] = useState<ICategory[]>([]);
  const {selectedCategory, setSelectedCategory} = useCategoryContext()
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const pageSize: number = 6;

  useEffect(() => {
    fetchData(currentPage, selectedCategory, searchQuery);
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getAllCategories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchData = async (page: number, category: number | null, search: string) => {
    try {
      const url = `http://localhost:8080/api/product/getAllProductByCategory?page=${page}&size=${pageSize}${category !== null ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Flex direction="column">
        <Hero
          heading='Sách hay bạn tốt'
          description='Sách hay mang đến những trải nghiệm tuyệt vời nhất'
          imageUrl="https://americastarbooks.com/wp-content/uploads/2018/01/c58f32cc-b6f2-11e7-aaab-cac091044fd5.jpg"
          btnLabel='View all categories'
          btnLink='/categories'
        />
        <Flex justify="center" align="center" my="4">
          <Button onClick={toggleSidebar} colorScheme="blue" mr="4">
            {isSidebarOpen ? "Collapse" : "Expand"} Sidebar
          </Button>
          <Input
            placeholder="Search products"
            value={searchQuery}
            onChange={handleSearchChange}
            width="50%"
          />
        </Flex>
        <Flex>
          <Box w={isSidebarOpen ? "20%" : "6%"} p="4" bg="gray.100" transition="width 0.3s ease">
            {isSidebarOpen && (
              <>
                <Text fontSize="xl" fontWeight="bold">All Categories</Text>
                <Box mt="2">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      variant={category.id === selectedCategory ? "solid" : "outline"}
                      colorScheme="blue"
                      size="sm"
                      mb="2"
                      w="100%"
                      textAlign="left"
                    >
                      {category.name}
                    </Button>
                  ))}
                </Box>
              </>
            )}
          </Box>
          <Box w={isSidebarOpen ? "75%" : "94%"} p="4">
            <AllProducts products={products} />
            <Flex justify="center" mt="4">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                mr="2"
                colorScheme="blue"
              >
                Previous
              </Button>
              <Text fontSize="md" mt="1">
                Page {currentPage + 1} of {totalPages}
              </Text>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                ml="2"
                colorScheme="blue"
              >
                Next
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default ProductsPage;
