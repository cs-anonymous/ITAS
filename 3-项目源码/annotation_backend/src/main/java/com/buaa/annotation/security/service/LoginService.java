package com.buaa.annotation.security.service;

import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.model.LoginUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("loginService")
public class LoginService {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public String login(String username, String password) {
        try {
            // 该方法会去调用UserDetailsServiceImpl.loadUserByUsername
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            LoginUser loginUser = (LoginUser) authentication.getPrincipal();
            return tokenService.createToken(loginUser);
        } catch (Exception e) {
            throw new BusinessException(ResponseCode.WRONG_USERNAME_PASSWORD);
        }
    }
}
