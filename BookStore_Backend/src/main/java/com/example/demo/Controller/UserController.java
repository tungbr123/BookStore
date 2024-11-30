package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity._User;
import com.example.demo.Service.UserService;
import com.example.demo.model.request.User.UpdateUserRequest;


import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class UserController {
	@Autowired
	private UserService userService;
	
    @GetMapping("/getAllUsers")
    public List<_User> listAllUsers() {
        return userService.listAllUser();
    }
    @GetMapping("/getAllUsersWithPaging")
    public ResponseEntity<?> getAllUsersWithPaging(
            @RequestParam int page,
            @RequestParam int size) {
        return new ResponseEntity<>(userService.getAllUsersWithPaging(page,size), HttpStatus.OK);
    }
    @PutMapping("/updateUser/{id}")
    public _User updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest user) {
        return userService.updateUser(id, user);
    }
    
    @PatchMapping("/{id}/toggle-status")
    public _User toggleUserStatus(@PathVariable Long id) {
        return userService.toggleUserStatus(id);
    }
    @GetMapping("/getUserById")
    public _User getUserById(@RequestParam(value = "userid") int id) {
        return userService.getUserById(id);
    }
}
