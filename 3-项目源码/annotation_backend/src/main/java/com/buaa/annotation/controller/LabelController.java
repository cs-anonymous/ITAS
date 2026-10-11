package com.buaa.annotation.controller;

import com.buaa.annotation.entity.Label;
import com.buaa.annotation.model.ResultModel;
import com.buaa.annotation.model.dto.LabelInfoDTO;
import com.buaa.annotation.service.LabelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/label")
public class LabelController {

    @Autowired
    private LabelService labelService;

    @PostMapping("/create")
    public ResultModel<Label> createLabel(@RequestParam String taskId, @RequestBody LabelInfoDTO labelInfoDTO) {
        return ResultModel.success(labelService.createLabel(taskId, labelInfoDTO));
    }

    @GetMapping("/list-by-task")
    public ResultModel<List<Label>> listByTask(@RequestParam String taskId) {
        return ResultModel.success(labelService.listLabelByTask(taskId));
    }

    @GetMapping("/list-by-paper")
    public ResultModel<List<Label>> listByPaper(@RequestParam String paperId) {
        return ResultModel.success(labelService.listLabelByPaper(paperId));
    }

    @PostMapping("/edit")
    public ResultModel<Boolean> editLabel(@RequestParam String id, @RequestBody LabelInfoDTO labelInfoDTO) {
        return ResultModel.success(labelService.editLabel(id, labelInfoDTO));
    }

    @PostMapping("/delete")
    public ResultModel<Boolean> deleteLabel(@RequestParam String id) {
        return ResultModel.success(labelService.removeById(id));
    }
}
