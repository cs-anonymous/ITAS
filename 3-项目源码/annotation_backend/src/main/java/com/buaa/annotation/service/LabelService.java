package com.buaa.annotation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.buaa.annotation.entity.Label;
import com.buaa.annotation.model.dto.LabelInfoDTO;

import java.util.List;

public interface LabelService extends IService<Label> {

    Label createLabel(String taskId, LabelInfoDTO labelInfoDTO);

    List<Label> listLabelByTask(String taskId);

    boolean editLabel(String id, LabelInfoDTO labelInfoDTO);

    List<Label> listLabelByPaper(String paperId);

}
