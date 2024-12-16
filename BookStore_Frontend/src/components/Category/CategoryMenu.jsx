"use client"
import { useCategoryContext } from "@/CategoryContext";
import {
  Box,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Router } from "react-router";
export const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCategory, setSelectedCategory } = useCategoryContext()
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("http://localhost:8080/getAllCategories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleCategory = (child) => {
    setSelectedCategory(child.id)
    router.push('/products')
  }

  if (error) return <div>Error: {error}</div>;
  return (
    <Box position="relative">
      {/* Main Button */}
      <Box role="group" position="relative">
        <Link
          href="/categories"ro
          p={2}
          _hover={{ textDecoration: "none", color: "blue.500" }}
        >
          Categories
        </Link>

        {/* Dropdown menu */}
        <Box
          position="absolute"
          top="100%"
          left={0}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow="lg"
          p={4}
          display="none"
          _groupHover={{ display: "block" }} // Hiển thị khi hover vào nhóm
          zIndex={10}
          rounded="md"
          minW="200px"
        >
          <Stack spacing={2}>
            {categories.map((child) => (
              <Box
                key={child.id}
                onClick={() => handleCategory(child)} // Sửa lỗi logic ở đây
                cursor="pointer"
                fontSize="sm"
                fontWeight="medium"
                p={2}
                borderRadius="md"
                _hover={{ bg: useColorModeValue("blue.50", "gray.700"), color: "blue.500" }}
              >
                {child.name}
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
