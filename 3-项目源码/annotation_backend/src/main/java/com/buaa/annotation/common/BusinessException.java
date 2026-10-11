package com.buaa.annotation.common;

import lombok.Getter;

@Getter
public final class BusinessException extends RuntimeException {

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
