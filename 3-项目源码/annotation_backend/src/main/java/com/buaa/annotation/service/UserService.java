package com.buaa.annotation.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.buaa.annotation.entity.User;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.dto.UserRegisterDTO;

public interface UserService extends IService<User> {

    User getUserByUsername(String username);

    void registerUser(UserRegisterDTO userRegisterDTO);

    Boolean usernameExist(String username);

    PageModel<User> pageUser(int pageNum, int pageSize);
}
