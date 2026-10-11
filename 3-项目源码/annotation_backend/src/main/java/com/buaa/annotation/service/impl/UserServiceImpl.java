package com.buaa.annotation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.common.RoleConstant;
import com.buaa.annotation.entity.User;
import com.buaa.annotation.mapper.UserMapper;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.dto.UserRegisterDTO;
import com.buaa.annotation.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @Override
    public User getUserByUsername(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(User::getUsername, username);
        return getOne(queryWrapper);
    }

    @Override
    public void registerUser(UserRegisterDTO userRegisterDTO) {
        if (usernameExist(userRegisterDTO.getUsername())) {
            throw new BusinessException(ResponseCode.USER_ALREADY_EXIST);
        } else {
            User user = new User();
            user.setUsername(userRegisterDTO.getUsername());
            user.setRealName(userRegisterDTO.getRealName());
            user.setPassword(bCryptPasswordEncoder.encode(userRegisterDTO.getPassword()));
            user.setRoles(new ArrayList<>(Collections.singletonList(RoleConstant.ANNOTATOR)));
            save(user);
        }
    }

    @Override
    public Boolean usernameExist(String username) {
        return getUserByUsername(username) != null;
    }

    @Override
    public PageModel<User> pageUser(int pageNum, int pageSize) {
        Page<User> page = new Page<>(pageNum, pageSize);
        return PageModel.convert(page(page));
    }

}
