package com.buaa.annotation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.buaa.annotation.entity.OssFile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;

public interface OssFileService extends IService<OssFile> {

    OssFile uploadInstructionFile(MultipartFile file);

    OssFile uploadPdfFile(MultipartFile file);

    OssFile uploadHtmlFile(File file);

    OssFile uploadTxtFile(File file);

    InputStream getStream(OssFile ossFile);

    ResponseEntity<byte[]> download(String fileId);
}