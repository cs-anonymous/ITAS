package com.buaa.annotation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.buaa.annotation.entity.Annotator;
import com.buaa.annotation.entity.User;

import java.util.List;

public interface AnnotatorMapper extends BaseMapper<Annotator> {

    void ignoreBatchInsert(List<Annotator> annotatorList);

    IPage<User> pageAnnotator(String projectId, Page<User> page);

    List<User> listAnnotator(String projectId);
}
