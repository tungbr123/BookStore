package com.example.demo.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity._User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.UserService;
import com.example.demo.model.request.User.UpdateUserRequest;

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

}
