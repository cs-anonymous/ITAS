package com.buaa.pm.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ResponseCode {

    SUCCESS(200, "成功"),
    //认证、授权、非业务相关
    INVALID_TOKEN(401, "该用户未认证或认证已过期"),
    ACCESS_DENIED(403, "该用户没有访问权限"),
    // 服务器异常
    INTERNAL_SERVER_ERROR(500, "服务器出现问题"),
    // 参数缺失
    PARAMETER_MISS(701, "缺少参数"),
    ENUM_TYPE_NOT_EXIST(751, "枚举类型不存在"),
    // 文件异常
    FILE_UPLOAD_FAILED(801, "文件上传失败"),
    FILE_INFO_SAVE_FAILED(802, "文件信息保存失败"),
    FILE_NOT_EXIST(810, "文件不存在"),
    FILE_DOWNLOAD_FAILED(811, "文件下载失败"),
    // 任务
    EMPTY_PAPER_LIST(1201, "项目中没有文本"),
    PAPER_NOT_EXIST(1221, "文本不存在"),
    // 项目
    PROJECT_NOT_EXIST(1101, "项目不存在");

    private final Integer code;
    private final String msg;
}
