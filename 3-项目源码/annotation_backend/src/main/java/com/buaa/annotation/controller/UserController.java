package com.buaa.annotation.controller;

import com.buaa.annotation.entity.User;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.ResultModel;
import com.buaa.annotation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/page")
    @PreAuthorize("hasAnyAuthority('admin')")
    public ResultModel<PageModel<User>> page(@RequestParam Integer pageNum, @RequestParam Integer pageSize){
        return ResultModel.success(userService.pageUser(pageNum, pageSize));
    }
}
