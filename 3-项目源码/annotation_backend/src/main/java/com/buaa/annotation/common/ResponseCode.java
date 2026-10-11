package com.buaa.annotation.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ResponseCode {

    //成功
    SUCCESS(200, "成功"),
    //认证、授权、非业务相关
    INVALID_TOKEN(401, "该用户未认证或认证已过期"),
    ACCESS_DENIED(403, "该用户没有访问权限"),
    // 服务器异常
    INTERNAL_SERVER_ERROR(500, "服务器出现问题"),
    // 用户
    WRONG_USERNAME_PASSWORD(600, "用户名或密码错误"),
    USER_NOT_EXIST(601, "用户不存在"),
    USER_ALREADY_EXIST(602, "用户已存在"),
    GET_USER_INFO_ERROR(603, "获取用户信息失败"),
    // 参数缺失
    PARAMETER_MISS(701, "缺少参数"),
    ENUM_TYPE_NOT_EXIST(751, "枚举类型不存在"),
    // 文件异常
    FILE_UPLOAD_FAILED(801, "文件上传失败"),
    FILE_INFO_SAVE_FAILED(802, "文件信息保存失败"),
    FILE_NOT_EXIST(810, "文件不存在"),
    FILE_DOWNLOAD_FAILED(811, "文件下载失败"),
    // 标注项目
    PROJECT_NOT_EXIST(1101, "标注项目不存在"),
    // 标注任务
    EMPTY_PAPER_LIST(1201, "标注项目中没有标注文本"),
    EMPTY_ANNOTATOR_LIST(1202, "标注项目中没有标注人员"),
    PAPER_CONVERT_NOT_FINISH(1203, "标注文本转换未完成"),
    INVALID_THRESHOLD(1204, "每篇文本标注人数不合法"),
    DUPLICATE_PAPER_IDENTIFIER(1205, "文本标识符存在重复"),
    EMPTY_TAG_LIST(1206, "标注项目中没有标注标签"),
    DUPLICATE_TAG_KEY(1207, "标签KEY存在重复"),
    PAPER_NOT_EXIST(1221, "标注文本不存在"),
    ASSIGNED_PROJECT_OPERATION_NOT_SUPPORT(1231, "已分配任务的标注项目不支持当前修改操作"),
    TASK_NOT_EXIST(1251, "标注任务不存在"),
    WRONG_ANNOTATOR_IN_TASK(1261, "当前用户没有该任务的标注权限");

    private final Integer code;
    private final String msg;
}
