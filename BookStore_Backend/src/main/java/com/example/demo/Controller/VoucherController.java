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

import com.example.demo.Entity.Order_Voucher;
import com.example.demo.Entity.Product;
import com.example.demo.Entity.User_Voucher;
import com.example.demo.Entity.Voucher;
import com.example.demo.Entity._User;
import com.example.demo.Service.VoucherService;
import com.example.demo.model.request.Orders.OrderRequest;
import com.example.demo.model.request.User.UpdateUserRequest;
import com.example.demo.model.request.Voucher.ProductVoucherRequest;
import com.example.demo.model.request.Voucher.VoucherRequest;
import com.example.demo.model.response.ProductVoucherResponse;
import com.example.demo.model.response.UserVoucherResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class VoucherController {
	@Autowired
	private VoucherService voucherService;
	
    @GetMapping("/voucher/{userId}")
    public ResponseEntity<?> getVoucherByUserId(@PathVariable Long userId) {
        return new ResponseEntity<>(voucherService.getVouchersByUserId(userId), HttpStatus.OK);
    }
    @PostMapping("/addVoucher")
    public ResponseEntity<?> addVoucher(@RequestBody VoucherRequest request){
        return new ResponseEntity<>(voucherService.addVoucher(request), HttpStatus.OK);
    }
    @PutMapping("/updateVoucher/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody VoucherRequest request) {
        return new ResponseEntity<>(voucherService.updateVoucher(id, request), HttpStatus.OK);
    }
    @DeleteMapping("/deleteVoucher/{id}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long id) {
    	return new ResponseEntity<>(voucherService.deleteVoucher(id), HttpStatus.OK);
    }
    @PostMapping("/addProductVoucher")
    public ResponseEntity<?> addVoucherToProducts(@RequestBody ProductVoucherRequest request) {
        return new ResponseEntity<>(voucherService.addVoucherToProducts(request), HttpStatus.OK);
    }
    @GetMapping("/getAllProductVoucher")
    public ResponseEntity<?> getAllProductVouchers()
    {
    	return new ResponseEntity<>(voucherService.getAllProductVoucher(), HttpStatus.OK);
    }
    @GetMapping("/getAllVouchers")
    public ResponseEntity<?> getAllVouchers()
    {
    	return new ResponseEntity<>(voucherService.getAllVouchers(), HttpStatus.OK);
    }
    @GetMapping("/getAllVouchersWithPaging")
    public ResponseEntity<?> getAllVouchersWithPaging(
    		@RequestParam int page,
            @RequestParam int size)
    {
    	return new ResponseEntity<>(voucherService.getAllVouchersWithPaging(page,size), HttpStatus.OK);
    }
    @GetMapping("/getUserVouchers")
    public ResponseEntity<?> getUserVouchers(
    		@RequestParam int userid)
    {
    	return new ResponseEntity<>(voucherService.getUserVouchers(userid), HttpStatus.OK);
    }
    @PostMapping("/addUserVoucher")
    public ResponseEntity<?> addUserVoucher(@RequestBody User_Voucher userVoucher) {
        User_Voucher savedUserVoucher = voucherService.addUserVoucher(userVoucher);
        return new ResponseEntity<>(savedUserVoucher, HttpStatus.CREATED);
    }

    @PostMapping("/addOrderVoucher")
    public ResponseEntity<?> addOrderVoucher(@RequestBody Order_Voucher orderVoucher) {
        Order_Voucher savedOrderVoucher = voucherService.addOrderVoucher(orderVoucher);
        return new ResponseEntity<>(savedOrderVoucher, HttpStatus.CREATED);
    }
    
    @GetMapping("getProductVouchers/{productId}")
    public ResponseEntity<List<ProductVoucherResponse>> getProductVoucherDetails(@PathVariable Long productId) {
        List<ProductVoucherResponse> vouchers = voucherService.getProductVoucherDetails(productId);
        return ResponseEntity.ok(vouchers);
    }
}
