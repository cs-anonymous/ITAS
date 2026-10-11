package com.buaa.annotation.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.buaa.annotation.config.mybatis.ListStringTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@TableName(value = "sys_user", autoResultMap = true)
public class User implements Serializable {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String username;

    private String realName;

    @JsonIgnore
    private String password;

    @TableField(typeHandler = ListStringTypeHandler.class)
    private List<String> roles;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;
}
