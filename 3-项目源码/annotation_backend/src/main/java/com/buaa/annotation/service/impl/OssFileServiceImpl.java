package com.buaa.annotation.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.config.minio.MinioBucketConstant;
import com.buaa.annotation.entity.OssFile;
import com.buaa.annotation.mapper.OssFileMapper;
import com.buaa.annotation.service.OssFileService;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLEncoder;

@Service
public class OssFileServiceImpl extends ServiceImpl<OssFileMapper, OssFile> implements OssFileService {

    @Autowired
    private MinioClient minioClient;

    @Override
    public OssFile uploadInstructionFile(MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            String filename = file.getOriginalFilename();
            return upload(inputStream, MinioBucketConstant.INSTRUCTION_BUCKET, filename);
        } catch (IOException e) {
            throw new BusinessException(ResponseCode.FILE_UPLOAD_FAILED, e.getMessage());
        }
    }

    @Override
    public OssFile uploadPdfFile(MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            String filename = file.getOriginalFilename();
            return upload(inputStream, MinioBucketConstant.PDF_BUCKET, filename);
        } catch (IOException e) {
            throw new BusinessException(ResponseCode.FILE_UPLOAD_FAILED, e.getMessage());
        }
    }

    @Override
    public OssFile uploadHtmlFile(File file) {
        try {
            InputStream inputStream = new FileInputStream(file);
            String filename = file.getName();
            return upload(inputStream, MinioBucketConstant.HTML_BUCKET, filename);
        } catch (IOException e) {
            throw new BusinessException(ResponseCode.FILE_UPLOAD_FAILED, e.getMessage());
        }
    }

    @Override
    public OssFile uploadTxtFile(File file) {
        try {
            InputStream inputStream = new FileInputStream(file);
            String filename = file.getName();
            return upload(inputStream, MinioBucketConstant.TXT_BUCKET, filename);
        } catch (IOException e) {
            throw new BusinessException(ResponseCode.FILE_UPLOAD_FAILED, e.getMessage());
        }
    }

    private OssFile upload(InputStream inputStream, String bucket, String filename) {
        String objectName = RandomStringUtils.randomAlphanumeric(10) + "-" + filename;
        String contentType = MediaTypeFactory.getMediaType(filename).orElse(MediaType.APPLICATION_OCTET_STREAM).toString();
        try {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .stream(inputStream, inputStream.available(), -1)
                    .contentType(contentType)
                    .build()
            );
        } catch (Exception e) {
            throw new BusinessException(ResponseCode.FILE_UPLOAD_FAILED, e.getMessage());
        }
        OssFile ossFile = new OssFile();
        ossFile.setFilename(filename);
        ossFile.setObjectName(objectName);
        ossFile.setBucket(bucket);
        if (save(ossFile)) {
            return ossFile;
        }
        throw new BusinessException(ResponseCode.FILE_INFO_SAVE_FAILED);
    }

    @Override
    public InputStream getStream(OssFile ossFile) {
        if (ossFile == null) {
            throw new BusinessException(ResponseCode.FILE_NOT_EXIST);
        }
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(ossFile.getBucket())
                            .object(ossFile.getObjectName())
                            .build()
            );
        } catch (Exception e) {
            throw new BusinessException(ResponseCode.FILE_DOWNLOAD_FAILED);
        }
    }

    @Override
    public ResponseEntity<byte[]> download(String fileId) {
        OssFile ossFile = getById(fileId);
        InputStream stream = getStream(ossFile);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024 * 4];
        int n = 0;
        while (true) {
            try {
                if (-1 == (n = stream.read(buffer))) break;
            } catch (IOException e) {
                e.printStackTrace();
            }
            output.write(buffer, 0, n);
        }
        byte[] content = output.toByteArray();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        try {
            headers.add("Content-Disposition", String.format("attachment; filename=\"%s\"", URLEncoder.encode(ossFile.getFilename(), "UTF-8")));
        } catch (UnsupportedEncodingException e) {
            headers.add("Content-Disposition", String.format("attachment; filename=\"%s\"", ossFile.getFilename()));
        }
        return new ResponseEntity<>(content, headers, HttpStatus.OK);
    }
}
