package com.buaa.annotation.service.impl;

import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.entity.Paper;
import com.buaa.annotation.entity.Project;
import com.buaa.annotation.entity.Task;
import com.buaa.annotation.entity.User;
import com.buaa.annotation.enumeration.PaperStatus;
import com.buaa.annotation.model.vo.ProjectStatisticVO;
import com.buaa.annotation.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class TaskAssignServiceImpl implements TaskAssignService {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private PaperService paperService;

    @Autowired
    private AnnotatorService annotatorService;

    @Autowired
    private TagService tagService;

    @Autowired
    private TaskService taskService;

    @Override
    @Transactional
    public boolean assignTask(String projectId, Integer threshold) {
        projectService.checkAssigned(projectId);

        // Paper转换状态检查
        List<Paper> papers = paperService.listPaperByProject(projectId);
        if (papers.isEmpty()) {
            throw new BusinessException(ResponseCode.EMPTY_PAPER_LIST);
        }
        for (Paper paper : papers) {
            if (!paper.getStatus().equals(PaperStatus.FINISH)) {
                throw new BusinessException(ResponseCode.PAPER_CONVERT_NOT_FINISH);
            }
        }

        // Paper标识符唯一性检查
        if (!paperService.checkIdentifier(projectId).isEmpty()) {
            throw new BusinessException(ResponseCode.DUPLICATE_PAPER_IDENTIFIER);
        }

        List<User> users = annotatorService.listAnnotatorByProject(projectId);
        if (users.isEmpty()) {
            throw new BusinessException(ResponseCode.EMPTY_ANNOTATOR_LIST);
        }

        if (tagService.listTags(projectId).isEmpty()) {
            throw new BusinessException(ResponseCode.EMPTY_TAG_LIST);
        }

        int m = papers.size();
        int n = users.size();
        threshold = Math.min(threshold, n);
        if (threshold <= 0) {
            throw new BusinessException(ResponseCode.INVALID_THRESHOLD);
        }

        List<Task> taskList = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < threshold; j++) {
                int index = (i * threshold + j) % n;
                Task task = new Task();
                Paper paper = papers.get(i);
                User user = users.get(index);
                task.setProjectId(projectId);
                task.setPaperId(paper.getId());
                task.setIdentifier(paper.getIdentifier());
                task.setUserId(user.getId());
                task.setUserRealName(user.getRealName());
                task.setPdfId(paper.getPdfId());
                task.setHtmlId(paper.getHtmlId());
                task.setTxtId(paper.getTxtId());
                taskList.add(task);
            }
        }
        if (taskService.saveBatch(taskList)) {
            Project project = new Project();
            project.setId(projectId);
            project.setAssigned(true);
            project.setAssignedAt(new Date());
            return projectService.updateById(project);
        }
        return false;
    }

    @Override
    public ProjectStatisticVO getProjectStatistic(String projectId) {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        ProjectStatisticVO statisticVO = new ProjectStatisticVO();
        CompletableFuture<Void> annotatorTask = CompletableFuture.runAsync(
                () -> statisticVO.setAnnotatorCount(annotatorService.countAnnotator(projectId)), executorService);
        CompletableFuture<Void> paperTask = CompletableFuture.runAsync(
                () -> statisticVO.setPaperCount(paperService.countPaper(projectId)), executorService);
        CompletableFuture<Void> tagTask = CompletableFuture.runAsync(
                () -> statisticVO.setTagCount(tagService.countTag(projectId)), executorService);
        CompletableFuture<Void> taskTask = CompletableFuture.runAsync(
                () -> statisticVO.setTaskCount(taskService.countTask(projectId)), executorService);
        CompletableFuture<Void> finishedTaskTask = CompletableFuture.runAsync(
                () -> statisticVO.setFinishedTaskCount(taskService.countFinishedTask(projectId)), executorService);
        CompletableFuture.allOf(annotatorTask, paperTask, tagTask, taskTask, finishedTaskTask).join();
        executorService.shutdown();
        return statisticVO;
    }
}
