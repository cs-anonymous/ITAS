package com.buaa.annotation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.buaa.annotation.entity.Tag;
import com.buaa.annotation.model.dto.TagInfoDTO;

import java.util.List;

public interface TagService extends IService<Tag> {

    Tag createTag(String projectId, TagInfoDTO tagInfoDTO);

    List<Tag> listTags(String projectId);

    void updateTag(String id, TagInfoDTO tagInfoDTO);

    void deleteTags(List<String> ids);

    Long countTag(String projectId);

    boolean tagKeyUnique(String projectId);
}
