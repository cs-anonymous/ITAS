package com.buaa.annotation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.buaa.annotation.entity.Task;
import com.buaa.annotation.model.PageModel;

public interface TaskService extends IService<Task> {

    PageModel<Task> pageAllTaskInProject(String projectId, int pageNum, int pageSize);

    PageModel<Task> pageMyTaskInProject(String projectId, String userId, int pageNum, int pageSize);

    Long countTask(String projectId);

    Long countFinishedTask(String projectId);

    boolean changeTaskFinished(String taskId);
}
