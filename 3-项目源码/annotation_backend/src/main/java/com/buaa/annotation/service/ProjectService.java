package com.buaa.annotation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.buaa.annotation.entity.OssFile;
import com.buaa.annotation.entity.Project;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.dto.ProjectInfoDTO;
import org.springframework.web.multipart.MultipartFile;

public interface ProjectService extends IService<Project> {

    Project createProject(ProjectInfoDTO projectInfoDTO);

    void updateProject(String projectId, ProjectInfoDTO projectInfoDTO);

    PageModel<Project> pageAllProject(int pageNum, int pageSize);

    PageModel<Project> pageMyProject(String userId, int pageNum, int pageSize);

    OssFile uploadInstructionFile(MultipartFile file);

    Project getProjectById(String projectId);

    void checkAssigned(String projectId);
}
