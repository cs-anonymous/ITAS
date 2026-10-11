package com.buaa.annotation.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
@TableName("biz_tag")
public class Tag {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String projectId;

    @TableField("tag_key")
    private String tagKey;

    @TableField("tag_name")
    private String tagName;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;
}
