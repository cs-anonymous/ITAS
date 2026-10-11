package com.buaa.annotation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.buaa.annotation.entity.Label;

import java.util.List;

public interface LabelMapper extends BaseMapper<Label> {

    List<Label> listLabelByPaper(String paperId);
}
