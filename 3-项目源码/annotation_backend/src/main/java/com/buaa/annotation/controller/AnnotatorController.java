package com.buaa.annotation.controller;

import com.buaa.annotation.entity.User;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.ResultModel;
import com.buaa.annotation.service.AnnotatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/annotator")
public class AnnotatorController {

    @Autowired
    private AnnotatorService annotatorService;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<List<String>> addAnnotator(@RequestParam String projectId, @RequestBody List<String> annotatorIds) {
        return ResultModel.success(annotatorService.batchAddAnnotator(projectId, annotatorIds));
    }

    @PostMapping("/remove")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<List<String>> removeAnnotator(@RequestParam String projectId, @RequestBody List<String> annotatorIds) {
        return ResultModel.success(annotatorService.batchRemoveAnnotator(projectId, annotatorIds));
    }

    @GetMapping("/page")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<PageModel<User>> pageAnnotator(@RequestParam String projectId, @RequestParam Integer pageNum, @RequestParam Integer pageSize) {
        return ResultModel.success(annotatorService.pageAnnotator(projectId, pageNum, pageSize));
    }

    @GetMapping("/get-all-ids")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<List<String>> getAllAnnotatorIds(@RequestParam String projectId) {
        return ResultModel.success(annotatorService.getAllAnnotatorIds(projectId));
    }
}
