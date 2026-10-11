package com.buaa.annotation.service;

import com.buaa.annotation.model.vo.ResultVO;

import java.util.List;

public interface ResultExportService {

    List<ResultVO> export(String projectId);
}
