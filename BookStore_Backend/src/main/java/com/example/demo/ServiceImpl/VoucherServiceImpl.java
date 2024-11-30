package com.example.demo.ServiceImpl;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Order_Voucher;
import com.example.demo.Entity.Orders;
import com.example.demo.Entity.Product;
import com.example.demo.Entity.ProductVoucher;
import com.example.demo.Entity.User_Voucher;
import com.example.demo.Entity.Voucher;
import com.example.demo.Repository.OrderVoucherRepository;
import com.example.demo.Repository.ProductVoucherRepository;
import com.example.demo.Repository.UserVoucherRepository;
import com.example.demo.Repository.VoucherRepository;
import com.example.demo.Service.VoucherService;
import com.example.demo.model.request.Voucher.ProductVoucherRequest;
import com.example.demo.model.request.Voucher.VoucherRequest;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.ProductVoucherResponse;
import com.example.demo.model.response.UserVoucherResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
	@Autowired
	VoucherRepository voucherRepository;

	@Autowired
	UserVoucherRepository userVoucherRepository;

	@Autowired
	ProductVoucherRepository productVoucherRepository;

	@Autowired
	OrderVoucherRepository orderVoucherRepository;

	@Override
	public ApiResponse<Object> getVouchersByUserId(Long userId) {
		try {
			// Fetch UserVoucher entries by userId
			List<User_Voucher> userVouchers = userVoucherRepository.findByUser_id(userId);
			// Create UserVoucherResponse list
			List<UserVoucherResponse> responses = userVouchers.stream().map(userVoucher -> {
				// Fetch Voucher details for each UserVoucher
				Voucher voucher = voucherRepository.findById(userVoucher.getVoucher_id());
				// Map Voucher and UserVoucher data into UserVoucherResponse
				return new UserVoucherResponse(userVoucher.getVoucher_id(), voucher.getCode(), voucher.getType(),
						voucher.getDiscount_value(), voucher.getMin_order_value(), voucher.getStart_date(),
						voucher.getEnd_date(), voucher.getUsage_limit(), voucher.getImage_voucher(),
						userVoucher.getStatus(), userVoucher.getUsage_count(), userVoucher.getUser_id(), userVoucher.getId());
			}).collect(Collectors.toList());
			return ApiResponse.builder().statusCode("200").message("Get Orders Successfully").data(responses).build();

		} catch (Exception ex) {
			return ApiResponse.builder().statusCode("500").message("Internal Server Error: " + ex.getMessage())
					.data(null).build();
		}
	}

	@Override
	public User_Voucher addUserVoucher(User_Voucher userVoucher) {
		// TODO Auto-generated method stub
		return userVoucherRepository.save(userVoucher);
	}

	@Override
	public Order_Voucher addOrderVoucher(Order_Voucher orderVoucher) {
		// TODO Auto-generated method stub
		return orderVoucherRepository.save(orderVoucher);
	}

	@Override
	public List<ProductVoucherResponse> getProductVoucherDetails(Long productId) {
		List<Object[]> results = productVoucherRepository.findProductVoucherDetailsByProductId(productId);
		return results.stream()
				.map(result -> new ProductVoucherResponse((int) result[0], (int) result[1], (int) result[2],
						(String) result[3], (BigDecimal) result[4], (Date) result[5], (BigDecimal) result[6]))
				.collect(Collectors.toList());
	}

	@Override
	public ApiResponse<Object> getAllVouchers() {
		try {
			List<Voucher> vouchers = voucherRepository.findAll();

			return ApiResponse.builder().statusCode("200").message("Get all vouchers Successfully").data(vouchers)
					.build();

		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("Fail to get all vouchers").data(null).build();
		}

	}
	@Override
	public ApiResponse<Object> getAllVouchersWithPaging(int page, int size) {
		try {
			Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "usage_limit"));
			Page<Voucher> vouchers = voucherRepository.findAllVouchers(pageable);
			return ApiResponse.builder().statusCode("200").message("Get all vouchers Successfully").data(vouchers)
					.build();

		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("Fail to get all vouchers").data(null).build();
		}

	}
	@Override
	public ApiResponse<Object> addVoucher(VoucherRequest request) {
		var voucher = Voucher.builder().code(request.getCode()).discount_value(request.getDiscount_value())
				.end_date(request.getEnd_date()).start_date(request.getStart_date())
				.min_order_value(request.getMin_order_value()).type(request.getType())
				.usage_limit(request.getUsage_limit()).build();
		try {

			voucherRepository.save(voucher);
			var response = ApiResponse.builder().statusCode("200").message("Add Voucher Sucessfully").build();
			// String emailContent = buildOrderConfirmationEmail(request.getName());
			// emailService.send(request.getEmail(), emailContent);
			return response;

		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Add failed").build();
		}
	}

	@Override
	public ApiResponse<Object> updateVoucher(Long id, VoucherRequest request) {
		try {

			Optional<Voucher> optionalVoucher = voucherRepository.findById(id);
			if (optionalVoucher.isPresent()) {
				Voucher voucher = optionalVoucher.get();
				voucher.setCode(request.getCode());
				voucher.setType(request.getType());
				voucher.setDiscount_value(request.getDiscount_value());
				voucher.setMin_order_value(request.getMin_order_value());
				voucher.setStart_date(request.getStart_date());
				voucher.setEnd_date(request.getEnd_date());
				voucher.setUsage_limit(request.getUsage_limit());
				voucherRepository.save(voucher);
			} else {
				throw new RuntimeException("Voucher not found with id " + id);
			}
			var response = ApiResponse.builder().statusCode("200").message("Update Voucher Sucessfully").build();
			// String emailContent = buildOrderConfirmationEmail(request.getName());
			// emailService.send(request.getEmail(), emailContent);
			return response;

		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Update failed").build();
		}
	}

	@Override
	public ApiResponse<Object> deleteVoucher(Long id) {
		try {
			voucherRepository.deleteById(id);
			var response = ApiResponse.builder().statusCode("200").message("Delete Voucher Sucessfully").build();
			return response;
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Delete failed").build();
		}
	}

	@Override
	public ApiResponse<Object> addVoucherToProducts(ProductVoucherRequest request) {
		try {
			// Validate voucher
			var voucher = voucherRepository.findById(request.getVoucherId()).orElseThrow(
					() -> new IllegalArgumentException("Voucher not found with ID: " + request.getVoucherId()));

			// Assign voucher to products
			request.getProductIds().forEach(productId -> {
				var productVoucher = ProductVoucher.builder().voucher_id(voucher.getId()).product_id(productId).build();
				productVoucherRepository.save(productVoucher);
			});

			return ApiResponse.builder().statusCode("200").message("Voucher successfully added to products.").build();
		} catch (IllegalArgumentException e) {
			return ApiResponse.builder().statusCode("400").message(e.getMessage()).build();
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("An unexpected error occurred.").build();
		}
	}

	@Override
	public ApiResponse<Object> getAllProductVoucher() {
		try {
			List<ProductVoucher> product_vouchers = productVoucherRepository.findAll();

			return ApiResponse.builder().statusCode("200").message("Get all vouchers Successfully").data(product_vouchers)
					.build();

		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("Fail to get all vouchers").data(null).build();
		}
	}

	@Override
	public ApiResponse<Object> getUserVouchers(int userid) {
		// TODO Auto-generated method stub
		return null;
	}

}
