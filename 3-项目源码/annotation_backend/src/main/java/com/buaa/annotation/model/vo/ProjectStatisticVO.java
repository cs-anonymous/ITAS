package com.buaa.annotation.model.vo;

import lombok.Data;

@Data
public class ProjectStatisticVO {

    private long paperCount;

    private long annotatorCount;

    private long tagCount;

    private long taskCount;

    private long finishedTaskCount;
}
