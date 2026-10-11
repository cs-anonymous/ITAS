package com.buaa.annotation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.entity.Label;
import com.buaa.annotation.entity.Task;
import com.buaa.annotation.mapper.LabelMapper;
import com.buaa.annotation.model.dto.LabelInfoDTO;
import com.buaa.annotation.service.LabelService;
import com.buaa.annotation.service.TaskService;
import com.buaa.annotation.util.RequestUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LabelServiceImpl extends ServiceImpl<LabelMapper, Label> implements LabelService {

    @Autowired
    private TaskService taskService;

    @Override
    public Label createLabel(String taskId, LabelInfoDTO labelInfoDTO) {
        Task task = taskService.getById(taskId);
        if (task == null) {
            throw new BusinessException(ResponseCode.TASK_NOT_EXIST);
        }
        if (!task.getUserId().equals(RequestUtils.getUserId())) {
            throw new BusinessException(ResponseCode.WRONG_ANNOTATOR_IN_TASK);
        }
        Label label = new Label();
        BeanUtils.copyProperties(labelInfoDTO, label);
        label.setTaskId(taskId);
        label.setCreatorId(task.getUserId());
        label.setCreatorName(task.getUserRealName());
        if (save(label)) {
            return label;
        }
        return null;
    }

    @Override
    public List<Label> listLabelByTask(String taskId) {
        QueryWrapper<Label> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Label::getTaskId, taskId);
        queryWrapper.lambda().orderByAsc(Label::getStart);
        return list(queryWrapper);
    }

    @Override
    public boolean editLabel(String id, LabelInfoDTO labelInfoDTO) {
        Label label = new Label();
        label.setId(id);
        label.setTagId(labelInfoDTO.getTagId());
        label.setRemark(labelInfoDTO.getRemark());
        return updateById(label);
    }

    @Override
    public List<Label> listLabelByPaper(String paperId) {
        return baseMapper.listLabelByPaper(paperId);
    }
}
