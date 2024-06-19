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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Image } from "cloudinary-react";

const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dqyfftfrb/image/upload";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
  const toast = useToast();

  useEffect(() => {
    axios.get("http://localhost:8080/getAllUsers").then((response) => {
      setUsers(response.data);
    });
  }, []);

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
              onClick={() => {}}
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
      </Box>
  );
};

export default UserManagement;

