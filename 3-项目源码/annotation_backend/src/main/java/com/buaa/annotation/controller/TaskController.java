package com.buaa.annotation.controller;

import com.buaa.annotation.entity.Task;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.ResultModel;
import com.buaa.annotation.model.vo.ProjectStatisticVO;
import com.buaa.annotation.service.TaskAssignService;
import com.buaa.annotation.service.TaskService;
import com.buaa.annotation.util.RequestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

//
@RestController
@RequestMapping("/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskAssignService taskAssignService;

    @PostMapping("/assign")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Boolean> assignTask(@RequestParam String projectId, @RequestParam Integer threshold) {
        return ResultModel.success(taskAssignService.assignTask(projectId, threshold));
    }

    @GetMapping("/statistic")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<ProjectStatisticVO> getProjectStatistic(@RequestParam String projectId) {
        return ResultModel.success(taskAssignService.getProjectStatistic(projectId));
    }

    @GetMapping("/page-all")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<PageModel<Task>> pageAllTask(@RequestParam String projectId, @RequestParam int pageNum, @RequestParam int pageSize) {
        return ResultModel.success(taskService.pageAllTaskInProject(projectId, pageNum, pageSize));
    }

    @GetMapping("/page-my")
    public ResultModel<PageModel<Task>> pageMyTask(@RequestParam String projectId, @RequestParam int pageNum, @RequestParam int pageSize) {
        String userId = RequestUtils.getUserId();
        return ResultModel.success(taskService.pageMyTaskInProject(projectId, userId, pageNum, pageSize));
    }

    @GetMapping("/get")
    public ResultModel<Task> getById(@RequestParam String taskId) {
        return ResultModel.success(taskService.getById(taskId));
    }

    @PostMapping("/change-finished")
    public ResultModel<Boolean> changeFinished(@RequestParam String taskId) {
        return ResultModel.success(taskService.changeTaskFinished(taskId));
    }
}
