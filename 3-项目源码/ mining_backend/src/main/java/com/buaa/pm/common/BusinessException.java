package com.buaa.pm.common;


import lombok.Getter;

import java.io.Serial;

@Getter
public final class BusinessException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 2942949883395742038L;

    private ResponseCode errorCode;

    private String description;

    public BusinessException(String description) {
        this.description = description;
    }

    public BusinessException(ResponseCode errorCode) {
        this.errorCode = errorCode;
    }

    public BusinessException(ResponseCode errorCode, String description) {
        this.errorCode = errorCode;
        this.description = description;
    }

}