package com.example.demo.Service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Address;
import com.example.demo.model.response.ApiResponse;

@Service
public interface AddressService {
	List<Address> getAddressesByUserId(Long userid); // Add this method

	Address createAddress(Address address);

	Address updateAddress(int id, Address address);

	void deleteAddress(Long id);

	void setDefaultAddress(int id, Long userId);
}
