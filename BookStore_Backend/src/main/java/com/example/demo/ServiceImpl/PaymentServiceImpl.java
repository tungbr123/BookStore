package com.example.demo.ServiceImpl;



import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.Service.PaymentService;
import com.example.demo.config.VNPAYConfig;
import com.example.demo.model.response.VNPayResponse;
import com.example.demo.utils.VNPayUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class PaymentServiceImpl implements PaymentService{
	private final VNPAYConfig vnPayConfig = new VNPAYConfig();
	@Override
	public VNPayResponse createVnPayPayment(HttpServletRequest request) {
		long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512("VRLDWNVWDNPCOEPBZUTWSEDQAGXJCNGZ", hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html" + "?" + queryUrl;
        return VNPayResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();
    }

}
