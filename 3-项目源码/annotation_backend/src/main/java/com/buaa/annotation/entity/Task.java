package com.buaa.annotation.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
@TableName("biz_task")
public class Task {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String projectId;

    private String userId;

    private String userRealName;

    private String paperId;

    private String identifier;

    private String pdfId;

    private String htmlId;

    private String txtId;

    private Boolean finished;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;
}
