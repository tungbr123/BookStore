"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  FormControl,
  FormLabel,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useColorMode,
  Heading,
  Select,
  IconButton,
  InputGroup,
  InputRightElement,
  useToast,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Image } from "cloudinary-react";
import showToast from "@/hooks/useToast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dqyfftfrb/image/upload";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVoucherOpen, setIsModalVoucherOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [vouchers, setVouchers] = useState([])
  const [editUser, setEditUser] = useState({
    firstname: "",
    lastname: "",
    cmnd: "",
    email: "",
    phone: "",
    avatar: "",
    status: 1,
  });
  const [image, setImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { colorMode } = useColorMode();

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5);

  const toast = useToast();
  const loggedUser = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loggedUser.token || loggedUser.role != 1) {
      router.push('/signin');
    }
  }, [loggedUser.token, loggedUser.role, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getAllUsersWithPaging`, {
          params: {
            page: currentPage,
            size: pageSize
          },
        });
        const ordersPage = response.data.data;
        setUsers(ordersPage.content);
        setTotalPages(ordersPage.totalPages);

      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        if (selectedUser) {
          const response = await axios.get(`http://localhost:8080/voucher/${selectedUser.id}`,
          );
          const data = response.data.data;
          console.log(data)
          setVouchers(data);
        }
      } catch (error) {
        toast({
          title: "Error fetching vouchers",
          description: error.response?.data?.message || error.message,
          status: "error",
          duration: 5000,
        });
      }
    };

    fetchVouchers();
  }, [selectedUser]);
  const handleViewVoucher = (user) => {
    setSelectedUser(user);
    setIsModalVoucherOpen(true);
  };
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditUser(user);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setEditUser({
      firstname: "",
      lastname: "",
      cmnd: "",
      email: "",
      phone: "",
      avatar: "",
      status: 1,
    });
    setImage("");
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ysfhyepr");

    try {
      const response = await axios.post(cloudinaryUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImage(response.data.secure_url);
      setEditUser((prevState) => ({
        ...prevState,
        avatar: response.data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const handleSubmitEdit = () => {
    axios
      .put(`http://localhost:8080/updateUser/${editUser.id}`, editUser)
      .then((response) => {
        const updatedUsers = users.map((user) =>
          user.id === response.data.id ? response.data : user
        );
        setUsers(updatedUsers);
        handleCloseEdit();
        toast({
          title: "User Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error updating user: ", error);
        toast({
          title: "Error",
          description: "Failed to update user.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleToggleStatus = (user) => {
    axios
      .patch(`http://localhost:8080/${user.id}/toggle-status`)
      .then((response) => {
        const updatedUsers = users.map((u) =>
          u.id === response.data.id ? response.data : u
        );
        setUsers(updatedUsers);
        toast({
          title: "Status Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error updating status: ", error);
        toast({
          title: "Error",
          description: "Failed to update status.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    if (filterStatus !== "all" && user.status !== parseInt(filterStatus)) {
      return false;
    }
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.firstname.toLowerCase().includes(searchTermLower) ||
      user.lastname.toLowerCase().includes(searchTermLower)
    );
  });

  return (

    <Box p={5} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Heading as="h1" size="lg" mb={5}>
        User Management
      </Heading>
      <Box mb={4} display="flex" alignItems="center">
        <InputGroup mr={4} maxW="400px">
          <Input
            placeholder="Search by firstname or lastname"
            value={searchTerm}
            onChange={handleSearch}
          />
          <InputRightElement>
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              onClick={() => { }}
            />
          </InputRightElement>
        </InputGroup>
        <Select
          maxW="200px"
          placeholder="Filter by status"
          value={filterStatus}
          onChange={handleFilterStatus}
        >
          <option value="all">All</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </Select>
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>CMND</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Avatar</Th>
            <Th>Status</Th>
            <Th>Vouchers</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user) => (
            <Tr key={user.id}>
              <Td>{user.firstname}</Td>
              <Td>{user.lastname}</Td>
              <Td>{user.cmnd}</Td>
              <Td>{user.email}</Td>
              <Td>{user.phone}</Td>
              <Td>
                <Avatar src={user.avatar} />
              </Td>
              <Td>{user.status === 1 ? "Active" : "Inactive"}</Td>
              <Td>
                <Button size="sm" onClick={() => handleViewVoucher(user)} mr={2}>
                  View vouchers
                </Button>
              </Td>
              <Td>
                <Button size="sm" onClick={() => handleEdit(user)} mr={2}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleToggleStatus(user)}
                  variant={user.status === 1 ? "outline" : "solid"}
                  colorScheme={user.status === 1 ? "red" : "green"}
                >
                  {user.status === 1 ? "Deactivate" : "Activate"}
                </Button>
              </Td>
            </Tr>
          ))}
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
      {/* Modal for Edit User */}
      <Modal isOpen={isEditing} onClose={handleCloseEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>First Name</FormLabel>
              <Input
                name="firstname"
                value={editUser.firstname}
                onChange={handleChangeEdit}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Last Name</FormLabel>
              <Input
                name="lastname"
                value={editUser.lastname}
                onChange={handleChangeEdit}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>CMND</FormLabel>
              <Input
                name="cmnd"
                value={editUser.cmnd}
                onChange={handleChangeEdit}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                value={editUser.email}
                onChange={handleChangeEdit}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={editUser.phone}
                onChange={handleChangeEdit}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Avatar</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {image && (
                <Image
                  cloudName="dqyfftfrb"
                  publicId={editUser.avatar}
                  width="50"
                  crop="scale"
                />
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmitEdit}>
              Save
            </Button>
            <Button onClick={handleCloseEdit}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isModalVoucherOpen} onClose={() => setIsModalVoucherOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User's Vouchers</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {vouchers.length > 0 ? (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>No.</Th>
                      <Th>Code</Th>
                      <Th>Type</Th>
                      <Th>Discount</Th>
                      <Th>Min Order Value</Th>
                      <Th>Start Date</Th>
                      <Th>End Date</Th>
                      <Th>Status</Th>
                      <Th>Usage Limit</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {vouchers.map((voucher, index) => (
                      <Tr key={voucher.code}>
                        <Td>{index + 1}</Td>
                        <Td>{voucher.code}</Td>
                        <Td>{voucher.type}</Td>
                        <Td>
                          {voucher.discount_value > 1
                            ? `${voucher.discount_value}₫`
                            : `${voucher.discount_value * 100}%`}
                        </Td>
                        <Td>{voucher.min_order_value}₫</Td>
                        <Td>{new Date(voucher.start_date).toLocaleDateString()}</Td>
                        <Td>{new Date(voucher.end_date).toLocaleDateString()}</Td>
                        <Td>{voucher.status}</Td>
                        <Td>{voucher.usage_limit}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            ) : (
              <Text>No vouchers available.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsModalVoucherOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserManagement;

