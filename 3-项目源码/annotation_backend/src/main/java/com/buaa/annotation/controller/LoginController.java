package com.buaa.annotation.controller;

import com.buaa.annotation.entity.User;
import com.buaa.annotation.model.ResultModel;
import com.buaa.annotation.model.dto.UserRegisterDTO;
import com.buaa.annotation.security.service.LoginService;
import com.buaa.annotation.service.UserService;
import com.buaa.annotation.util.RequestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResultModel<String> login(@RequestParam String username, @RequestParam String password) {
        return ResultModel.success(loginService.login(username, password));
    }

    @GetMapping("/get-profile")
    public ResultModel<User> getProfile() {
        return ResultModel.success(RequestUtils.getLoginUser().getUser());
    }

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResultModel<Boolean> register(@RequestBody UserRegisterDTO registerDTO) {
        userService.registerUser(registerDTO);
        return ResultModel.success(true);
    }

    @GetMapping("/username-exist")
    public ResultModel<Boolean> usernameExist(@RequestParam String username) {
        return ResultModel.success(userService.usernameExist(username));
    }
}
