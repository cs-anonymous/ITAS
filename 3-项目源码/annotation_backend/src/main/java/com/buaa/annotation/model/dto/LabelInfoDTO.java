package com.buaa.annotation.model.dto;

import lombok.Data;

@Data
public class LabelInfoDTO {

    private String content;

    private String tagId;

    private String remark;

    private String location;

    private Integer start;

    private Integer end;
}
