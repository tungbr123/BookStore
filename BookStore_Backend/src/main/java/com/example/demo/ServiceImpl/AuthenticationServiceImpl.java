package com.example.demo.ServiceImpl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.Entity.ConfirmationToken;
import com.example.demo.Entity._User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.AuthenticationService;
import com.example.demo.Service.ConfirmationTokenService;
import com.example.demo.Service.EmailService;
import com.example.demo.Service.UserService;
import com.example.demo.model.request.Auth.AuthRequest;
import com.example.demo.model.request.Auth.ConfirmEmailRequest;
import com.example.demo.model.request.Auth.RegisterRequest;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.AuthenticationResponse;
import com.example.demo.security.JwtService;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private EmailValidatorImpl emailValidator;
	@Autowired
	private EmailService emailService;
	@Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ConfirmationTokenService confirmationTokenService;  

    private UserService userService;
    
	@Override
	public ApiResponse<Object> authenticate(AuthRequest request) {
        if(checkUser(request)) {
            var user = userRepository.findByEmail(request.getEmail());
            var jwtToken = jwtService.generateToken(user.get());
            var response = ApiResponse
                    .builder()
                    .statusCode("200")
                    .message("Login successes")
                    .data(
                            AuthenticationResponse.builder()
                            		.userid(user.get().getId())
                                    .email(user.get().getEmail())
                                    .name(user.get().getFirstname())
                                    .accessToken(jwtToken)
                                    .role(user.get().getRole())
                                    .build())
                    .build();
            return response;
        } else {
            return ApiResponse
                    .builder()
                    .statusCode("401")
                    .message("Login failed - Incorrect email or password")
                    .build();
        }
		
		
		
//		if (checkUser(request)) {
//			var user = userRepository.findByEmail(request.getEmail());
//			AuthenticationResponse response = new AuthenticationResponse();
//			response.setEmail(user.get().getEmail());
//			response.setName(user.get().getFirstname());
//			response.setRole(user.get().getRole());
//			var responseAPI = ApiResponse.builder().statusCode("200").message("Login successes").data(response).build();
//			return responseAPI;
//		} else {
//			return ApiResponse.builder().statusCode("401").message("Login failed - Incorrect email or password")
//					.build();
//		}
	}

	public boolean checkUser(AuthRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            var user = userRepository.findByEmail(request.getEmail());
            String password = user.get().getPassword();
            if(passwordEncoder.matches(request.getPassword(),password)){
                return true;
            }
        };
        return false;
	}

	@Override
	public ApiResponse<Object> register(RegisterRequest request) {
		boolean isValidEmail = emailValidator.
                test(request.getEmail());
        if (!isValidEmail) {
            throw new IllegalStateException("email not valid");
        }
        if(userRepository.findByEmail(request.getEmail()).isEmpty()){
            var user = _User.builder().email(request.getEmail()).password(passwordEncoder.encode(request.getPassword()))
					.firstname(request.getFirstname()).lastname(request.getLastname()).phone(request.getPhone())
					.CMND(request.getCmnd()).statusUser(0).role(1).build();
            try {
                userRepository.save(user);
                String token = UUID.randomUUID().toString();

                ConfirmationToken confirmationToken = new ConfirmationToken(
                        token,
                        LocalDateTime.now(),
                        LocalDateTime.now().plusMinutes(15),
                        user
                );
                String link = "http://localhost:8080/confirm?token=" + token;
                confirmationTokenService.saveConfirmationToken(
                        confirmationToken);
                //send verify email to user after register
                emailService.send(user.getEmail(),buildEmail(request.getEmail(), link));

                var jwtToken = jwtService.generateToken(user);
                var response = ApiResponse.builder().statusCode("200").message("Register successes")
						.data(AuthenticationResponse.builder().email(user.getEmail()).name(user.getFirstname())
								.role(user.getRole()).accessToken(jwtToken).build())
                        .build();
                return response;
            }
            catch (Exception e) {
                return ApiResponse
                        .builder()
                        .statusCode("401")
                        .message("Register failed")
                        .build();
            }
        } else {
            return ApiResponse
                    .builder()
                    .statusCode("401")
                    .message("User existed")
                    .build();
        }
		
//		boolean isValidEmail = emailValidator.test(request.getEmail());
//		if (!isValidEmail) {
//			throw new IllegalStateException("email not valid");
//		}
//		if (userRepository.findByEmail(request.getEmail()).isEmpty()) {
//			var user = _User.builder().email(request.getEmail()).password(request.getPassword())
//					.firstname(request.getFirstname()).lastname(request.getLastname()).phone(request.getPhone())
//					.CMND(request.getCmnd()).statusUser(0).role(1).build();
//			try {
//				System.out.print(user.getCMND());
//				userRepository.save(user);
//				String token = UUID.randomUUID().toString();
//				String link = "http://localhost:8080/confirm?token=" + token;
//				// send verify email to user after register
//				emailService.send(user.getEmail(), buildEmail(request.getEmail(), link));
//
//				var response = ApiResponse.builder().statusCode("200").message("Register successes")
//						.data(AuthenticationResponse.builder().email(user.getEmail()).name(user.getFirstname())
//								.role(user.getRole()).build())
//						.build();
//				return response;
//			} catch (Exception e) {
//				return ApiResponse.builder().statusCode("401").message("Register failed").build();
//			}
//		} else {
//			return ApiResponse.builder().statusCode("401").message("User existed").build();
//		}
	}
    @Transactional
    @Override
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElseThrow(() ->
                        new IllegalStateException("token not found"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("token expired");
        }

        confirmationTokenService.setConfirmedAt(token);
        userService.enableUser(
                confirmationToken.getUser().getEmail());
        return "confirmed";
    }

	@Override
	public ApiResponse<Object> confirmEmail(ConfirmEmailRequest request) {
		boolean isValidEmail = emailValidator.test(request.getEmail());
		if (!isValidEmail) {
			return ApiResponse.builder().statusCode("401").message("Confirm Failed").build();
		}
		return ApiResponse.builder().statusCode("200").message("Confirm successes").build();
	}

	@Override
	public ApiResponse<Object> resetPassword(AuthRequest request) {
		boolean isValidEmail = emailValidator.test(request.getEmail());
		if (isValidEmail) {
			userRepository.updatePassword(request.getPassword(), request.getEmail());
			var response = ApiResponse.builder().statusCode("200").message("Confirm successes")
					.data(AuthenticationResponse.builder().email(request.getEmail()).name(request.getPassword())
							.build())
					.build();
			return response;
		}
		return ApiResponse.builder().statusCode("401").message("Reset password failed").build();
	}
	
	
	public String buildEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 15 minutes. <p>See you soon</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }
}
