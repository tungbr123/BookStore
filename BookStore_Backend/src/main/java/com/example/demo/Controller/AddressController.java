package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Address;
import com.example.demo.Service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class AddressController {
    @Autowired
    private AddressService addressService;
    
    
    @GetMapping("/getAddressByUserId/{userid}")
    public List<Address> getAddressesByUserId(@PathVariable Long userid) {
        return addressService.getAddressesByUserId(userid);
    }
    @PostMapping("createAddress")
    public Address createAddress(@RequestBody Address address) {
        return addressService.createAddress(address);
    }
    @PutMapping("/updateAddress/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable int id, @RequestBody Address addressDetails) {
        Address updatedAddress = addressService.updateAddress(id, addressDetails);
        return ResponseEntity.ok(updatedAddress);
    }
    @GetMapping("/setDefaultAddress")
    public ResponseEntity<?> setDefaultAddress(@RequestParam int id, @RequestParam Long userId) {
        addressService.setDefaultAddress(id, userId);
        return ResponseEntity.ok("Default address updated successfully.");
    }	
    @DeleteMapping("/deleteAddress/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
