package com.buaa.annotation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.buaa.annotation.entity.Annotator;
import com.buaa.annotation.entity.User;
import com.buaa.annotation.mapper.AnnotatorMapper;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.service.AnnotatorService;
import com.buaa.annotation.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnotatorServiceImpl extends ServiceImpl<AnnotatorMapper, Annotator> implements AnnotatorService {

    @Autowired
    private ProjectService projectService;

    @Override
    @Transactional
    public List<String> batchAddAnnotator(String projectId, List<String> userIds) {
        projectService.checkAssigned(projectId);
        if (userIds == null || userIds.isEmpty()) {
            return getAllAnnotatorIds(projectId);
        }
        List<Annotator> annotatorList = userIds.stream().map(uid -> {
            Annotator annotator = new Annotator();
            annotator.setProjectId(projectId);
            annotator.setUserId(uid);
            return annotator;
        }).collect(Collectors.toList());
        baseMapper.ignoreBatchInsert(annotatorList);
        return getAllAnnotatorIds(projectId);
    }

    @Override
    @Transactional
    public List<String> batchRemoveAnnotator(String projectId, List<String> userIds) {
        projectService.checkAssigned(projectId);
        if (userIds == null || userIds.isEmpty()) {
            return getAllAnnotatorIds(projectId);
        }
        QueryWrapper<Annotator> wrapper = new QueryWrapper<>();
        wrapper.lambda().eq(Annotator::getProjectId, projectId).in(Annotator::getUserId, userIds);
        baseMapper.delete(wrapper);
        return getAllAnnotatorIds(projectId);
    }

    @Override
    public PageModel<User> pageAnnotator(String projectId, int pageNum, int pageSize) {
        Page<User> page = new Page<>(pageNum, pageSize);
        return PageModel.convert(baseMapper.pageAnnotator(projectId, page));
    }

    @Override
    public List<String> getAllAnnotatorIds(String projectId) {
        QueryWrapper<Annotator> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Annotator::getProjectId, projectId);
        return list(queryWrapper).stream().map(Annotator::getUserId).collect(Collectors.toList());
    }

    @Override
    public Long countAnnotator(String projectId) {
        QueryWrapper<Annotator> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Annotator::getProjectId, projectId);
        return count(queryWrapper);
    }

    @Override
    public List<User> listAnnotatorByProject(String projectId) {
        return baseMapper.listAnnotator(projectId);
    }
}
