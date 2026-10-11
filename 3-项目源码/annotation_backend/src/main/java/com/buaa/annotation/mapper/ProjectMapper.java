package com.buaa.annotation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.buaa.annotation.entity.Project;

public interface ProjectMapper extends BaseMapper<Project> {

    IPage<Project> pageMyProject(String userId, Page<Project> page);
}
