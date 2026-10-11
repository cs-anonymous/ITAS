package com.buaa.annotation.model;

import com.buaa.annotation.common.ResponseCode;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultModel<T> {

    private Integer code;

    private String msg;

    private T payload;

    private ResultModel(ResponseCode responseCode) {
        this(responseCode, null);
    }

    private ResultModel(ResponseCode responseCode, T payload) {
        this.code = responseCode.getCode();
        this.msg = responseCode.getMsg();
        this.payload = payload;
    }

    public static <T> ResultModel<T> success() {
        return new ResultModel<>(ResponseCode.SUCCESS);
    }

    public static <T> ResultModel<T> success(T payload) {
        return new ResultModel<>(ResponseCode.SUCCESS, payload);
    }

    public static <T> ResultModel<T> error(ResponseCode responseCode, T payload) {
        return new ResultModel<>(responseCode, payload);
    }

    public static <T> ResultModel<T> error(Integer code, String message, T payload) {
        return new ResultModel<>(code, message, payload);
    }
}
