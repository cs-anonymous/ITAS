package com.buaa.annotation.util;

import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.model.LoginUser;

import org.springframework.security.core.context.SecurityContextHolder;

public class RequestUtils {

    /**
     * 获取用户名
     **/
    public static String getUsername() {
        return getLoginUser().getUsername();
    }

    /**
     * 获取用户ID
     */
    public static String getUserId() {
        return getLoginUser().getUser().getId();
    }

    /**
     * 获取用户
     **/
    public static LoginUser getLoginUser() {
        try {
            return (LoginUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            throw new BusinessException(ResponseCode.GET_USER_INFO_ERROR);
        }
    }

}