package com.buaa.annotation.enumeration;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PaperStatus {

    WAITING(0),
    FINISH(1),
    FAIL(-1);

    @EnumValue
    @JsonValue
    private final Integer code;

    public static PaperStatus fromCode(Integer code){
        for (PaperStatus status: PaperStatus.values()){
            if(status.code.equals(code)){
                return status;
            }
        }
        throw new BusinessException(ResponseCode.ENUM_TYPE_NOT_EXIST);
    }
}
