package com.buaa.annotation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.entity.Task;
import com.buaa.annotation.mapper.TaskMapper;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.service.TaskService;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl extends ServiceImpl<TaskMapper, Task> implements TaskService {

    @Override
    public PageModel<Task> pageAllTaskInProject(String projectId, int pageNum, int pageSize) {
        Page<Task> page = new Page<>(pageNum, pageSize);
        QueryWrapper<Task> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Task::getProjectId, projectId);
        return PageModel.convert(page(page, queryWrapper));
    }

    @Override
    public PageModel<Task> pageMyTaskInProject(String projectId, String userId, int pageNum, int pageSize) {
        Page<Task> page = new Page<>(pageNum, pageSize);
        QueryWrapper<Task> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Task::getProjectId, projectId).eq(Task::getUserId, userId);
        queryWrapper.lambda().orderByAsc(Task::getFinished);
        return PageModel.convert(page(page, queryWrapper));
    }

    @Override
    public Long countTask(String projectId) {
        QueryWrapper<Task> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Task::getProjectId, projectId);
        return count(queryWrapper);
    }

    @Override
    public Long countFinishedTask(String projectId) {
        QueryWrapper<Task> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Task::getProjectId, projectId).eq(Task::getFinished, true);
        return count(queryWrapper);
    }

    @Override
    public boolean changeTaskFinished(String taskId) {
        Task task = getById(taskId);
        if (task == null) {
            throw new BusinessException(ResponseCode.TASK_NOT_EXIST);
        }
        task.setFinished(!task.getFinished());
        return updateById(task);
    }
}
