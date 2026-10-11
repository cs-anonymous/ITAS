package com.buaa.annotation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.entity.OssFile;
import com.buaa.annotation.entity.Project;
import com.buaa.annotation.mapper.ProjectMapper;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.dto.ProjectInfoDTO;
import com.buaa.annotation.service.OssFileService;
import com.buaa.annotation.service.ProjectService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements ProjectService {

    @Autowired
    private OssFileService ossFileService;

    @Override
    public Project createProject(ProjectInfoDTO projectInfoDTO) {
        Project project = new Project();
        BeanUtils.copyProperties(projectInfoDTO, project);
        if (save(project)) {
            return project;
        }
        return null;
    }

    @Override
    public void updateProject(String projectId, ProjectInfoDTO projectInfoDTO) {
        Project project = new Project();
        project.setId(projectId);
        BeanUtils.copyProperties(projectInfoDTO, project);
        updateById(project);
    }

    @Override
    public PageModel<Project> pageAllProject(int pageNum, int pageSize) {
        Page<Project> page = new Page<>(pageNum, pageSize);
        QueryWrapper<Project> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().orderByDesc(Project::getCreatedAt);
        return PageModel.convert(page(page, queryWrapper));
    }

    @Override
    public PageModel<Project> pageMyProject(String userId, int pageNum, int pageSize) {
        Page<Project> page = new Page<>(pageNum, pageSize);
        return PageModel.convert(baseMapper.pageMyProject(userId, page));
    }

    @Override
    public OssFile uploadInstructionFile(MultipartFile file) {
        return ossFileService.uploadInstructionFile(file);
    }

    @Override
    public Project getProjectById(String projectId) {
        Project project = getById(projectId);
        if (project == null) {
            throw new BusinessException(ResponseCode.PROJECT_NOT_EXIST);
        }
        return project;
    }

    @Override
    public void checkAssigned(String projectId) {
        if (getProjectById(projectId).getAssigned()) {
            throw new BusinessException(ResponseCode.ASSIGNED_PROJECT_OPERATION_NOT_SUPPORT);
        }
    }
}
