import { DeliveryInfoContext } from "@/context";
import { Box, Card, CardBody, CardHeader, FormLabel, Heading, Input, Stack, Select, Button } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import showToast from '@/hooks/useToast';
import api from '@/ApiProcess/api';

export const DeliveryInformation = () => {
    const loggedUser = useSelector((state) => state.auth);
    const [state, setState, LoadUserInformation] = useContext(DeliveryInfoContext);
    const [addresses, setAddresses] = useState([]);  // Lưu danh sách địa chỉ
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false); // Quản lý trạng thái form "Thêm địa chỉ"

    // Các state cho form địa chỉ mới
    const [newCity, setNewCity] = useState('');
    const [newDistrict, setNewDistrict] = useState('');
    const [newWard, setNewWard] = useState('');
    const [newStreet, setNewStreet] = useState('');
    const [newApartNum, setNewApartNum] = useState('');

    // State lưu danh sách tỉnh, quận và phường
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    // Gọi API lấy danh sách tỉnh/thành phố
    // Gọi API lấy danh sách địa chỉ theo userId
    useEffect(() => {
        if (loggedUser?.userid) {
            const loadUserAddresses = async () => {
                try {
                    const response = await api.get(`getAddressByUserId/${loggedUser.userid}`, {}, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.status === 200) {
                        const data = response.data;
                        // Xử lý hiển thị địa chỉ
                        const defaultAddress = data.find(addr => addr.is_default);
                        const formattedAddresses = data.map((addr) => ({
                            id: addr.id,
                            fullAddress: `${addr.apart_num}, ${addr.street}, ${addr.ward}, ${addr.district}, ${addr.city}`
                        }));
                        setAddresses(formattedAddresses);
                        if (defaultAddress) {
                            const defaultFormatted = `${defaultAddress.apart_num}, ${defaultAddress.street}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.city}`;
                            setAddress(defaultFormatted);
                            setState(prevState => ({ ...prevState, address: defaultFormatted }));
                        } else if (formattedAddresses.length > 0) {
                            // Nếu không có địa chỉ mặc định, chọn địa chỉ đầu tiên
                            const firstAddress = formattedAddresses[0].fullAddress;
                            setAddress(firstAddress);
                            setState(prevState => ({ ...prevState, address: firstAddress }));
                        }
                    } else {
                        showToast("Lấy danh sách địa chỉ thất bại", "error");
                    }
                } catch (error) {
                    showToast("Lỗi khi lấy danh sách địa chỉ", "error");
                    console.error("Error fetching addresses", error);
                }
            };
            loadUserAddresses();
        }
    }, [loggedUser.userid]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                const data = await response.json();
                setCities(data);
            } catch (error) {
                showToast("Lỗi khi tải danh sách tỉnh/thành phố", "error");
            }
        };

        fetchCities();
    }, []);

    // Gọi API lấy danh sách quận/huyện khi chọn tỉnh/thành phố
    const fetchDistricts = async (cityCode) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts);
        } catch (error) {
            showToast("Lỗi khi tải danh sách quận/huyện", "error");
        }
    };

    // Gọi API lấy danh sách phường/xã khi chọn quận/huyện
    const fetchWards = async (districtCode) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const data = await response.json();
            setWards(data.wards);
        } catch (error) {
            showToast("Lỗi khi tải danh sách phường/xã", "error");
        }
    };

    useEffect(() => {
        
        if (addresses.length == 0) {
            setIsAddingNewAddress(true); // Tự động hiển thị form thêm địa chỉ mới
        }
        else
        {
            setIsAddingNewAddress(false);
        }
            
    }, [addresses]);

    // Hàm thay đổi giá trị address
    const handleAddressChange = (e) => {
        const selectedAddress = e.target.value;
        console.log(selectedAddress)
        if (selectedAddress === "new") {
            setIsAddingNewAddress(true);  // Hiển thị form thêm địa chỉ mới
        } else {
            setAddress(selectedAddress);
            setState(prevState => ({ ...prevState, address: selectedAddress }));
            setIsAddingNewAddress(false);  // Ẩn form thêm địa chỉ mới nếu có
        }
    };

    // Hàm thay đổi giá trị name, phone, email
    const handleNameChange = (e) => {
        setName(e.target.value);
        setState(prevState => ({ ...prevState, name: e.target.value }));
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
        setState(prevState => ({ ...prevState, phone: e.target.value }));
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setState(prevState => ({ ...prevState, email: e.target.value }));
    };

    // Hàm thêm địa chỉ mới
    const handleNewAddressSubmit = async () => {
        try {
            const response = await api.post('createAddress', {
                userid: loggedUser.userid,
                city: newCity,
                district: newDistrict,
                ward: newWard,
                street: newStreet,
                apart_num: newApartNum,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                const addedAddress = response.data;
                const formattedAddress = {
                    id: addedAddress.id,
                    fullAddress: `${addedAddress.apart_num}, ${addedAddress.street}, ${addedAddress.ward}, ${addedAddress.district}, ${addedAddress.city}`
                };
                setAddresses([...addresses, formattedAddress]);  // Cập nhật danh sách địa chỉ
                setAddress(formattedAddress.fullAddress);  // Chọn địa chỉ mới vừa thêm
                setState(prevState => ({ ...prevState, address: formattedAddress.fullAddress }));
                setIsAddingNewAddress(false);  // Ẩn form sau khi thêm địa chỉ
                showToast("Thêm địa chỉ thành công", "success");
            } else {
                showToast("Thêm địa chỉ thất bại", "error");
            } 
        } catch (error) {
            showToast("Lỗi khi thêm địa chỉ", "error");
            console.error("Error adding address", error);
        }
    };

    // Hàm xử lý thay đổi tỉnh/thành phố
    const handleCityChange = (e) => {
        const selectedCity = cities.find(city => city.code == e.target.value);
        setNewCity(selectedCity.name);
        fetchDistricts(selectedCity.code);  // Lấy danh sách quận/huyện khi chọn tỉnh
    };

    // Hàm xử lý thay đổi quận/huyện
    const handleDistrictChange = (e) => {
        const selectedDistrict = districts.find(district => district.code == e.target.value);
        setNewDistrict(selectedDistrict.name);
        fetchWards(selectedDistrict.code);  // Lấy danh sách phường/xã khi chọn quận
    };

    const handleWardChange = (e) => {
        const selectedWard = wards.find(ward => ward.code == e.target.value)
        setNewWard(selectedWard.name);
        fetchWards(selectedWard.code);  // Lấy danh sách phường/xã khi chọn quận
    };
    return (
        <Card borderWidth="1px" borderColor="gray.200" shadow="none">
            <CardHeader>
                <Heading size="md">Delivery Information</Heading>
            </CardHeader>
            <CardBody>
                <Stack spacing="2rem">
                    <Box>
                        <FormLabel>Full Name</FormLabel>
                        <Input onChange={handleNameChange} value={state.name} type="text" placeholder={state.name} />
                    </Box>

                    <Box>
                        <FormLabel>Address</FormLabel>
                        <Select onChange={handleAddressChange} value={address}>
                            {addresses ? addresses.map((addr) => (
                                <option style={{
                                    fontWeight: addr.is_default == 1 ? "bold" : "normal",
                                    backgroundColor: addr.is_default == 1 ? "#f0f8ff" : "white",
                                }}
                                 key={addr.id} value={addr.fullAddress}>{addr.fullAddress}</option>
                            )) : <option value = "no address found">No Address found</option>}
                            <option value="new">Thêm địa chỉ mới</option>
                        </Select>
                    </Box>

                    {/* Form thêm địa chỉ mới */}
                    {isAddingNewAddress && (
                        <Box>
                            <FormLabel>City/Province</FormLabel>
                            <Select value={newCity} onChange={handleCityChange}>
                            {!newCity ? (
                                        <option value="">City/Province</option> // Khi chưa chọn thành phố
                                    ) : (
                                        <option value={newCity}>
                                            {newCity} {/* Hiển thị tên thành phố đã chọn */}
                                        </option>
                                    )}
                                {cities.map((city) => (
                                    <option key={city.code} value={city.code}>{city.name}</option>
                                ))}
                            </Select>

                            <FormLabel>District</FormLabel>
                            <Select value={newDistrict} onChange={handleDistrictChange}>
                            {!newDistrict ? (
                                        <option value="">District</option> // Khi chưa chọn thành phố
                                    ) : (
                                        <option value={newDistrict}>
                                            {newDistrict} {/* Hiển thị tên thành phố đã chọn */}
                                        </option>
                                    )}
                                {districts.map((district) => (
                                    <option key={district.code} value={district.code}>{district.name}</option>
                                ))}
                            </Select>

                            <FormLabel>Ward</FormLabel>
                            <Select value={newWard} onChange={handleWardChange}>
                            {!newWard ? (
                                        <option value="">Ward</option> // Khi chưa chọn thành phố
                                    ) : (
                                        <option value={newWard}>
                                            {newWard} {/* Hiển thị tên thành phố đã chọn */}
                                        </option>
                                    )}
                                {wards.map((ward) => (
                                    <option key={ward.code} value={ward.code}>{ward.name}</option>
                                ))}
                            </Select>

                            <FormLabel>Street</FormLabel>
                            <Input value={newStreet} onChange={(e) => setNewStreet(e.target.value)} placeholder="Đường" />

                            <FormLabel>Apart_Num</FormLabel>
                            <Input value={newApartNum} onChange={(e) => setNewApartNum(e.target.value)} placeholder="Số nhà" />

                            <Button mt="2" onClick={handleNewAddressSubmit}>Add Address</Button>
                        </Box>
                    )}

                    <Box>
                        <FormLabel>Phone</FormLabel>
                        <Input value={state.phone} onChange={handlePhoneChange} type="text" placeholder={state.phone} />
                    </Box>

                    <Box>
                        <FormLabel>Email</FormLabel>
                        <Input value={state.email} type="email" onChange={handleEmailChange} placeholder={state.email} />
                    </Box>
                </Stack>
            </CardBody>
        </Card>
    );
};
