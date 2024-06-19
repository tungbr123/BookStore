package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Entity._User;
import com.example.demo.model.request.User.UpdateUserRequest;


@Service
public interface UserService {
//    PageResponse<List<UserResponse>> getAllUserWithPage(String search, Integer page, Integer size);
//    ApiResponse<List<UserResponse>> getAllUser(String search);
//    UserResponse findById(Long id);
//    UserResponse updateUser(Long id,UserRequest userRequest, BindingResult bindingResult);
//    UserResponse deleteById(Long id);
//    List<UserResponse> getUserListofPage(int page,int size);
//
//    
//    long getTotalPage(long total, int size);
    int enableUser(String email);

    _User findByEmail(String email);
    
    _User getUserById(int id);
    
    List<_User> listAllUser();
    _User updateUser(Long id, UpdateUserRequest updateUser);
    _User toggleUserStatus(Long id);
//    ApiResponse<Object> addUser(AddUserRequest request);
}