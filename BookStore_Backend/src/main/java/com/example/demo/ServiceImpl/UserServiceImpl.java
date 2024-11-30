package com.example.demo.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.demo.Entity._User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.UserService;
import com.example.demo.model.request.User.UpdateUserRequest;
import com.example.demo.model.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
	@Autowired
    UserRepository userRepository;
	@Override
	public int enableUser(String email) {
		return userRepository.enableUser(email);
	}

	@Override
	public _User findByEmail(String email) {
        return userRepository.findByEmail(email).get();
	}

	@Override
	public List<_User> listAllUser() {
		return userRepository.findAll();
	}

	@Override
	public _User updateUser(Long id, UpdateUserRequest updatedUser) {
		
		return userRepository.findById(id).map(user -> {
            user.setFirstname(updatedUser.getFirstname());
            user.setLastname(updatedUser.getLastname());
            user.setCMND(updatedUser.getCMND());
            user.setEmail(updatedUser.getEmail());
            user.setPhone(updatedUser.getPhone());
            user.setAvatar(updatedUser.getAvatar());
            return userRepository.save(user);
        }).orElse(null);
	}

	@Override
	public _User toggleUserStatus(Long id) {
        return userRepository.findById(id).map(user -> {
            user.setStatus(user.getStatus() == 1 ? 0 : 1);
            return userRepository.save(user);
        }).orElse(null);
	}

	@Override
	public _User getUserById(int id) {
		// TODO Auto-generated method stub
		return userRepository.findById(id);
	}

	@Override
	public ApiResponse<Object> getAllUsersWithPaging(int page, int size) {
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<_User> userPage = userRepository.findAllUsers(pageable);
			if (userPage.isEmpty()) {
				return ApiResponse.builder().statusCode("404").message("No orders found for the user.").data(null)
						.build();
			}
			else
			{
				return ApiResponse.builder().statusCode("200").message("Get users successfully").data(userPage)
						.build();
			}
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("Internal Server Error: " + e.getMessage())
					.data(null).build();
		}
	}

}
