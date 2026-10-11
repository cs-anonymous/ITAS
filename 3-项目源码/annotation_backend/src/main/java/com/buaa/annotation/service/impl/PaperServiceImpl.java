package com.buaa.annotation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.config.activemq.ActivemqQueueConstant;
import com.buaa.annotation.entity.OssFile;
import com.buaa.annotation.entity.Paper;
import com.buaa.annotation.enumeration.PaperStatus;
import com.buaa.annotation.mapper.PaperMapper;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.dto.PagePaperDTO;
import com.buaa.annotation.service.OssFileService;
import com.buaa.annotation.service.PaperService;
import com.buaa.annotation.service.ProjectService;
import com.buaa.annotation.util.CmdUtils;
import org.apache.commons.exec.CommandLine;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaperServiceImpl extends ServiceImpl<PaperMapper, Paper> implements PaperService {

    private static final String DIR_ROOT_PATH = "tmp";

    @Autowired
    private JmsMessagingTemplate jmsMessagingTemplate;

    @Autowired
    private OssFileService ossFileService;

    @Autowired
    private ProjectService projectService;

    @Override
    @Transactional
    public void upload(String projectId, MultipartFile[] files) {
        if (projectService.getProjectById(projectId) == null) {
            throw new BusinessException(ResponseCode.PROJECT_NOT_EXIST);
        }
        projectService.checkAssigned(projectId);
        for (MultipartFile file : files) {
            Paper paper = new Paper();
            paper.setProjectId(projectId);
            paper.setFilename(file.getOriginalFilename());
            paper.setIdentifier(FilenameUtils.removeExtension(file.getOriginalFilename()));
            OssFile ossFile = ossFileService.uploadPdfFile(file);
            paper.setPdfId(ossFile.getId());
            paper.setStatus(PaperStatus.WAITING);
            if (save(paper)) {
                jmsMessagingTemplate.convertAndSend(ActivemqQueueConstant.FILE_CONVERT_QUEUE, paper);
            }
        }
    }

    @Override
    public PageModel<Paper> pagePaper(PagePaperDTO pagePaperDTO) {
        IPage<Paper> page = new Page<>(pagePaperDTO.getPageNum(), pagePaperDTO.getPageSize());
        QueryWrapper<Paper> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Paper::getProjectId, pagePaperDTO.getProjectId());
        if (StringUtils.hasText(pagePaperDTO.getIdentifier())) {
            queryWrapper.lambda().like(Paper::getIdentifier, pagePaperDTO.getIdentifier());
        }
        if (pagePaperDTO.getStatus() != null) {
            queryWrapper.lambda().eq(Paper::getStatus, PaperStatus.fromCode(pagePaperDTO.getStatus()));
        }
        if (StringUtils.hasText(pagePaperDTO.getSortField())) {
            if (pagePaperDTO.getSortField().equals("identifier")) {
                queryWrapper.lambda().orderBy(true, pagePaperDTO.getSortDescending() != null && pagePaperDTO.getSortDescending(), Paper::getIdentifier);
            } else if (pagePaperDTO.getSortField().equals("createdAt")) {
                queryWrapper.lambda().orderBy(true, pagePaperDTO.getSortDescending() != null && pagePaperDTO.getSortDescending(), Paper::getCreatedAt);
            }
        } else {
            queryWrapper.lambda().orderByAsc(Paper::getIdentifier);
        }
        return PageModel.convert(page(page, queryWrapper));
    }

    @Override
    public boolean updateIdentifier(String id, String identifier) {
        Paper paper = getById(id);
        if (paper == null) {
            return false;
        }
        projectService.checkAssigned(paper.getProjectId());
        paper.setIdentifier(identifier);
        return updateById(paper);
    }

    @Override
    public boolean removePapers(List<String> ids) {
        if (ids.isEmpty()) {
            return false;
        }
        Paper paper = getById(ids.get(0));
        projectService.checkAssigned(paper.getProjectId());
        return removeBatchByIds(ids);
    }

    @Override
    public List<String> checkIdentifier(String projectId) {
        QueryWrapper<Paper> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().select(Paper::getIdentifier);
        queryWrapper.lambda().eq(Paper::getProjectId, projectId);
        queryWrapper.lambda().groupBy(Paper::getIdentifier).having("count(identifier)>1");
        return list(queryWrapper).stream().map(Paper::getIdentifier).collect(Collectors.toList());
    }

    @Override
    public List<Paper> listPaperByProject(String projectId) {
        QueryWrapper<Paper> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Paper::getProjectId, projectId);
        return list(queryWrapper);
    }

    @Override
    public Paper getPaperById(String id) {
        Paper paper = getById(id);
        if (paper == null) {
            throw new BusinessException(ResponseCode.PAPER_NOT_EXIST);
        }
        return paper;
    }

    @Override
    public Long countPaper(String projectId) {
        QueryWrapper<Paper> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Paper::getProjectId, projectId);
        return count(queryWrapper);
    }

    @JmsListener(destination = ActivemqQueueConstant.FILE_CONVERT_QUEUE)
    public void receive(Paper paper) {
        OssFile ossFile = ossFileService.getById(paper.getPdfId());
        String randomDirPath = DIR_ROOT_PATH + "/" + UUID.randomUUID().toString().replaceAll("-", "");
        try {
            FileUtils.forceMkdir(new File(randomDirPath));
            FileUtils.copyInputStreamToFile(ossFileService.getStream(ossFile), new File(randomDirPath + "/" + ossFile.getFilename()));
            String filenameWithoutExt = FilenameUtils.removeExtension(ossFile.getFilename());
            pdf2html(randomDirPath, filenameWithoutExt);
            html2txt(randomDirPath, filenameWithoutExt);
            OssFile htmlFile = ossFileService.uploadHtmlFile(new File(randomDirPath + "/" + filenameWithoutExt + ".html"));
            OssFile txtFile = ossFileService.uploadTxtFile(new File(randomDirPath + "/" + filenameWithoutExt + ".txt"));
            paper.setHtmlId(htmlFile.getId());
            paper.setTxtId(txtFile.getId());
            paper.setStatus(PaperStatus.FINISH);
            updateById(paper);
        } catch (IOException e) {
            paper.setStatus(PaperStatus.FAIL);
            paper.setHtmlId("");
            paper.setTxtId("");
            updateById(paper);
        } finally {
            try {
                FileUtils.deleteDirectory(new File(randomDirPath));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void pdf2html(String dir, String filenameWithoutExt) throws IOException {
        CommandLine commandLine = new CommandLine("pdf2htmlEX");
        commandLine.addArgument("--fit-width");
        commandLine.addArgument("600");
        commandLine.addArgument("${FILE}");
        HashMap<String, File> map = new HashMap<>();
        map.put("FILE", new File(dir + "/" + filenameWithoutExt + ".pdf"));
        commandLine.setSubstitutionMap(map);
        CmdUtils.runCommandLineInDir(commandLine, new File(dir));
    }

    private void html2txt(String dir, String filenameWithoutExt) throws IOException {
        CommandLine commandLine = new CommandLine("node");
        commandLine.addArgument("${EXE}");
        commandLine.addArgument("${FILE}");
        HashMap<String, File> map = new HashMap<>();
        map.put("EXE", new File("convert.js"));
        map.put("FILE", new File(dir + "/" + filenameWithoutExt + ".html"));
        commandLine.setSubstitutionMap(map);
        CmdUtils.runCommandLine(commandLine);
    }
}
