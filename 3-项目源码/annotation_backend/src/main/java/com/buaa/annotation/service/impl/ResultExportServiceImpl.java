package com.buaa.annotation.service.impl;

import com.buaa.annotation.common.BusinessException;
import com.buaa.annotation.common.ResponseCode;
import com.buaa.annotation.entity.Label;
import com.buaa.annotation.entity.Paper;
import com.buaa.annotation.entity.Tag;
import com.buaa.annotation.model.vo.LabelExportVO;
import com.buaa.annotation.model.vo.ResultVO;
import com.buaa.annotation.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResultExportServiceImpl implements ResultExportService {

    @Autowired
    private PaperService paperService;

    @Autowired
    private TagService tagService;

    @Autowired
    private LabelService labelService;

    @Autowired
    private OssFileService ossFileService;

    @Override
    public List<ResultVO> export(String projectId) {
        if (!tagService.tagKeyUnique(projectId)) {
            throw new BusinessException(ResponseCode.DUPLICATE_TAG_KEY);
        }
        List<Paper> papers = paperService.listPaperByProject(projectId);
        List<Tag> tags = tagService.listTags(projectId);
        List<ResultVO> resultVOList = new ArrayList<>();
        papers.forEach(paper -> {
            List<Label> labels = labelService.listLabelByPaper(paper.getId());
            ResultVO resultVO = new ResultVO();
            resultVO.setIdentifier(paper.getIdentifier());
            resultVO.setPdf(ossFileService.getById(paper.getPdfId()).getObjectName());
            resultVO.setHtml(ossFileService.getById(paper.getHtmlId()).getObjectName());
            resultVO.setTxt(ossFileService.getById(paper.getTxtId()).getObjectName());
            Map<String, List<LabelExportVO>> map = new HashMap<>();
            tags.forEach(tag -> {
                List<LabelExportVO> list = labels.stream()
                        .filter(label -> label.getTagId().equals(tag.getId()))
                        .map(this::toLabelExportVO)
                        .collect(Collectors.toList());
                map.put(tag.getTagKey(), list);
            });
            resultVO.setLabels(map);
            resultVOList.add(resultVO);
        });
        return resultVOList;
    }

    private LabelExportVO toLabelExportVO(Label label) {
        LabelExportVO labelExportVO = new LabelExportVO();
        labelExportVO.setContent(label.getContent());
        labelExportVO.setStart(label.getStart());
        labelExportVO.setEnd(label.getEnd());
        labelExportVO.setRemark(label.getRemark());
        labelExportVO.setCreatorId(label.getCreatorId());
        return labelExportVO;
    }
}
