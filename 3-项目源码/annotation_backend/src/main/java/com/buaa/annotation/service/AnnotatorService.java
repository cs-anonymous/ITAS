package com.buaa.annotation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.buaa.annotation.entity.Annotator;
import com.buaa.annotation.entity.User;
import com.buaa.annotation.model.PageModel;

import java.util.List;

public interface AnnotatorService extends IService<Annotator> {

    List<String> batchAddAnnotator(String projectId, List<String> userIds);

    List<String> batchRemoveAnnotator(String projectId, List<String> userIds);

    PageModel<User> pageAnnotator(String projectId, int pageNum, int pageSize);

    List<String> getAllAnnotatorIds(String projectId);

    Long countAnnotator(String projectId);

    List<User> listAnnotatorByProject(String projectId);
}
