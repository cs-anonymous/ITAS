package com.buaa.annotation.controller;

import com.buaa.annotation.entity.Paper;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.ResultModel;
import com.buaa.annotation.model.dto.PagePaperDTO;
import com.buaa.annotation.service.PaperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/paper")
public class PaperController {

    @Autowired
    private PaperService paperService;

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Void> uploadPaper(@RequestParam String projectId, @RequestParam MultipartFile[] files) {
        paperService.upload(projectId, files);
        return ResultModel.success();
    }

    @PostMapping("/page")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<PageModel<Paper>> page(@RequestBody PagePaperDTO pagePaperDTO) {
        return ResultModel.success(paperService.pagePaper(pagePaperDTO));
    }

    @GetMapping("/list-by-project")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<List<Paper>> listByProject(@RequestParam String projectId) {
        return ResultModel.success(paperService.listPaperByProject(projectId));
    }

    @GetMapping("/get")
    public ResultModel<Paper> getById(@RequestParam String id) {
        return ResultModel.success(paperService.getPaperById(id));
    }

    @PostMapping("/remove")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Boolean> removePaper(@RequestBody List<String> ids) {
        return ResultModel.success(paperService.removePapers(ids));
    }

    @PostMapping("/update-identifier")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Boolean> updateIdentifier(@RequestParam String id, @RequestParam String identifier) {
        return ResultModel.success(paperService.updateIdentifier(id, identifier));
    }

    @GetMapping("/check-identifier")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<List<String>> checkIdentifier(@RequestParam String projectId) {
        return ResultModel.success(paperService.checkIdentifier(projectId));
    }
}
