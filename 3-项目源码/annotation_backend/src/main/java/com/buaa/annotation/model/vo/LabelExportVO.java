package com.buaa.annotation.model.vo;

import lombok.Data;

@Data
public class LabelExportVO {

    private String content;

    private Integer start;

    private Integer end;

    private String remark;

    private String creatorId;
}
