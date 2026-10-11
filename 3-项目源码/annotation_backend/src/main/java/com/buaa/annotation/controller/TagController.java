package com.buaa.annotation.controller;

import com.buaa.annotation.entity.Tag;
import com.buaa.annotation.model.ResultModel;
import com.buaa.annotation.model.dto.TagInfoDTO;
import com.buaa.annotation.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tag")
public class TagController {

    @Autowired
    private TagService tagService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Tag> createTag(@RequestParam String projectId, @RequestBody TagInfoDTO tagInfoDTO) {
        return ResultModel.success(tagService.createTag(projectId, tagInfoDTO));
    }

    @GetMapping("/list")
    public ResultModel<List<Tag>> listTags(@RequestParam String projectId) {
        return ResultModel.success(tagService.listTags(projectId));
    }

    @PostMapping("/update")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Void> updateTag(@RequestParam String id, @RequestBody TagInfoDTO tagInfoDTO) {
        tagService.updateTag(id, tagInfoDTO);
        return ResultModel.success();
    }

    @PostMapping("/remove")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Void> deleteTags(@RequestBody List<String> ids) {
        tagService.deleteTags(ids);
        return ResultModel.success();
    }

    @GetMapping("/tag-key-unique")
    @PreAuthorize("hasAuthority('admin')")
    public ResultModel<Boolean> tagKeyUnique(@RequestParam String projectId) {
        return ResultModel.success(tagService.tagKeyUnique(projectId));
    }
}
