package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.Order_Voucher;
import com.example.demo.Entity.User_Voucher;
import com.example.demo.Entity.Voucher;
import com.example.demo.model.request.Orders.OrderRequest;
import com.example.demo.model.request.Voucher.ProductVoucherRequest;
import com.example.demo.model.request.Voucher.VoucherRequest;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.ProductVoucherResponse;
import com.example.demo.model.response.UserVoucherResponse;

@Service
public interface VoucherService {
	ApiResponse<Object> getVouchersByUserId(Long userId);
    User_Voucher addUserVoucher(User_Voucher userVoucher);
    Order_Voucher addOrderVoucher(Order_Voucher orderVoucher);   
    List<ProductVoucherResponse> getProductVoucherDetails(Long productId);
    ApiResponse<Object> getAllVouchers();
    ApiResponse<Object> getAllProductVoucher();
    ApiResponse<Object> addVoucher(VoucherRequest request);
    ApiResponse<Object> addVoucherToProducts(ProductVoucherRequest request);
    ApiResponse<Object> updateVoucher(Long id, VoucherRequest request);
    ApiResponse<Object> deleteVoucher(Long id);
	ApiResponse<Object> getAllVouchersWithPaging(int page, int size);
	ApiResponse<Object> getUserVouchers(int userid);
}
