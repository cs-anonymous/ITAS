package com.buaa.annotation.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
@TableName("biz_label")
public class Label {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String taskId;

    private String content;

    private String remark;

    private String tagId;

    private String location;

    private Integer start;

    private Integer end;

    private String creatorId;

    private String creatorName;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;

}