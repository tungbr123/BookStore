package com.example.demo.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Address;
import com.example.demo.Repository.AddressRepository;
import com.example.demo.Service.AddressService;
import com.example.demo.model.response.ApiResponse;

@Service
public class AddressServiceImpl implements AddressService{
	@Autowired
    private AddressRepository addressRepository;
	@Override
	public List<Address> getAddressesByUserId(Long userid) {
		// TODO Auto-generated method stub
		return addressRepository.findByUserid(userid);
	}

	@Override
	public Address createAddress(Address address) {
		// TODO Auto-generated method stub
		return addressRepository.save(address);
	}

	@Override
	
	
	
	public Address updateAddress(int id, Address addressDetails) {
		Address address = addressRepository.findById(id);

        address.setCity(addressDetails.getCity());
        address.setDistrict(addressDetails.getDistrict());
        address.setWard(addressDetails.getWard());
        address.setStreet(addressDetails.getStreet());
        address.setApart_num(addressDetails.getApart_num());
        address.setUserid(addressDetails.getUserid()); // Ensure userid is updated if necessary

        return addressRepository.save(address);
	}

	@Override
	public void deleteAddress(Long id) {
		Address address = addressRepository.findById(id).orElse(null);;
        addressRepository.delete(address);
		
	}

	@Override
	public void setDefaultAddress(int id, Long userId) {
        List<Address> userAddresses = addressRepository.findByUserid(userId);

        // Cập nhật trạng thái mặc định
        for (Address address : userAddresses) {
            Long addressId = address.getId();
            if(addressId == id)
            {
            	address.setIs_default(1);
            }
            else
            {
            	address.setIs_default(0);
            }
            addressRepository.save(address);
        }
    
	}

}
