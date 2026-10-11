package com.buaa.annotation.model.vo;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ResultVO {

    private String identifier;

    private Map<String, List<LabelExportVO>> labels;

    private String pdf;

    private String html;

    private String txt;

}
