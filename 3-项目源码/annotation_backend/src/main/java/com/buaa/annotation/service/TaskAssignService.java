package com.buaa.annotation.service;

import com.buaa.annotation.model.vo.ProjectStatisticVO;

public interface TaskAssignService {

    boolean assignTask(String projectId, Integer threshold);

    ProjectStatisticVO getProjectStatistic(String projectId);
}
