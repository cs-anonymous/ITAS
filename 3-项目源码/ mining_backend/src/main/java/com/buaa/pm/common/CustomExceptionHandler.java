package com.buaa.pm.common;

import com.buaa.pm.model.ResultModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

/**
 * 异常处理类，所有子项目的异常处理逻辑在这里定义
 */
@RestControllerAdvice
@Slf4j
public class CustomExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResultModel<String> businessException(BusinessException ex) {
        log.error(ex.getMessage(), ex);
        if (ex.getErrorCode() == null) {
            return ResultModel.error(400, ex.getDescription(), ex.getMessage());
        }
        String payload = ex.getDescription() != null ? ex.getDescription() : ex.getMessage();
        return ResultModel.error(ex.getErrorCode(), payload);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResultModel<String> missingServletRequestParameterException(MissingServletRequestParameterException ex) {
        log.error(ex.getMessage(), ex);
        return ResultModel.error(ResponseCode.PARAMETER_MISS, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResultModel<String> methodArgumentNotValidException(MethodArgumentNotValidException ex) {
        log.error(ex.getMessage(), ex);
        BindingResult bindingResult = ex.getBindingResult();
        List<ObjectError> allErrors = bindingResult.getAllErrors();
        List<String> payload = new ArrayList<>(allErrors.size());
        allErrors.forEach(e -> payload.add(e.getDefaultMessage()));
        return ResultModel.error(400, String.join(",", payload), null);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResultModel<String> exception(Exception ex) {
        log.error(ex.getMessage(), ex);
        return ResultModel.error(ResponseCode.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

}
