package com.buaa.annotation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.buaa.annotation.entity.Project;
import com.buaa.annotation.entity.Tag;
import com.buaa.annotation.mapper.TagMapper;
import com.buaa.annotation.model.dto.TagInfoDTO;
import com.buaa.annotation.service.ProjectService;
import com.buaa.annotation.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements TagService {

    @Autowired
    private ProjectService projectService;

    @Override
    public Tag createTag(String projectId, TagInfoDTO tagInfoDTO) {
        projectService.checkAssigned(projectId);
        Tag tag = new Tag();
        tag.setProjectId(projectId);
        tag.setTagKey(tagInfoDTO.getTagKey());
        tag.setTagName(tagInfoDTO.getTagName());
        if (save(tag)) {
            return tag;
        }
        return null;
    }

    @Override
    public List<Tag> listTags(String projectId) {
        QueryWrapper<Tag> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Tag::getProjectId, projectId);
        return list(queryWrapper);
    }

    @Override
    public void updateTag(String id, TagInfoDTO tagInfoDTO) {
        Tag tag = getById(id);
        Project project = projectService.getProjectById(tag.getProjectId());
        tag.setTagKey(tagInfoDTO.getTagKey());
        if (!project.getAssigned()) {
            tag.setTagName(tagInfoDTO.getTagName());
        }
        updateById(tag);
    }

    @Override
    public void deleteTags(List<String> ids) {
        if (!ids.isEmpty()) {
            Tag tag = getById(ids.get(0));
            projectService.checkAssigned(tag.getProjectId());
            removeBatchByIds(ids);
        }
    }

    @Override
    public Long countTag(String projectId) {
        QueryWrapper<Tag> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Tag::getProjectId, projectId);
        return count(queryWrapper);
    }

    @Override
    public boolean tagKeyUnique(String projectId) {
        QueryWrapper<Tag> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().select(Tag::getTagKey);
        queryWrapper.lambda().eq(Tag::getProjectId, projectId);
        queryWrapper.lambda().groupBy(Tag::getTagKey).having("count(tag_key)>1");
        return list(queryWrapper).isEmpty();
    }
}
