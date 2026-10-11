package com.buaa.annotation.model.dto;

import lombok.Data;

@Data
public class PagePaperDTO {

    private String projectId;

    private int pageNum;

    private int pageSize;

    private String identifier;

    private Integer status;

    private String sortField;

    private Boolean sortDescending;
}
