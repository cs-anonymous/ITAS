package com.buaa.annotation.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.buaa.annotation.enumeration.PaperStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
@TableName("biz_paper")
public class Paper implements Serializable {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String projectId;

    private String identifier;

    private String filename;

    private String pdfId;

    private String htmlId;

    private String txtId;

    private PaperStatus status;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;
}
