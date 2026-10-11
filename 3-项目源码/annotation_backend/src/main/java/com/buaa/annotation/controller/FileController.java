package com.buaa.annotation.controller;

import com.buaa.annotation.service.OssFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private OssFileService ossFileService;

    @GetMapping("/download")
    public ResponseEntity<byte[]> getHtmlFile(@RequestParam String id) {
        return ossFileService.download(id);
    }

}
