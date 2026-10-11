package com.buaa.annotation.controller;

import com.buaa.annotation.entity.OssFile;
import com.buaa.annotation.entity.Project;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.ResultModel;
import com.buaa.annotation.model.dto.ProjectInfoDTO;
import com.buaa.annotation.service.ProjectService;
import com.buaa.annotation.util.RequestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Project> createProject(@RequestBody ProjectInfoDTO projectInfoDTO) {
        return ResultModel.success(projectService.createProject(projectInfoDTO));
    }

    @PostMapping("/update")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Void> updateProject(@RequestParam String id, @RequestBody ProjectInfoDTO projectInfoDTO) {
        projectService.updateProject(id, projectInfoDTO);
        return ResultModel.success();
    }

    @GetMapping("/page-all")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<PageModel<Project>> pageAllProject(@RequestParam int pageNum, @RequestParam int pageSize) {
        return ResultModel.success(projectService.pageAllProject(pageNum, pageSize));
    }

    @GetMapping("/page-my")
    public ResultModel<PageModel<Project>> pageMyProject(@RequestParam int pageNum, @RequestParam int pageSize) {
        return ResultModel.success(projectService.pageMyProject(RequestUtils.getUserId(), pageNum, pageSize));
    }

    @PostMapping("/upload-instruction")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<OssFile> uploadInstruction(@RequestPart MultipartFile file) {
        return ResultModel.success(projectService.uploadInstructionFile(file));
    }

    @GetMapping("/get")
    public ResultModel<Project> getById(@RequestParam String projectId) {
        return ResultModel.success(projectService.getProjectById(projectId));
    }
}
