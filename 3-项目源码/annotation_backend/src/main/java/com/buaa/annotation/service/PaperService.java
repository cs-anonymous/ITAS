package com.buaa.annotation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.buaa.annotation.entity.Paper;
import com.buaa.annotation.model.PageModel;
import com.buaa.annotation.model.dto.PagePaperDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PaperService extends IService<Paper> {

    void upload(String projectId, MultipartFile[] files);

    PageModel<Paper> pagePaper(PagePaperDTO pagePaperDTO);

    boolean updateIdentifier(String id, String identifier);

    boolean removePapers(List<String> ids);

    List<String> checkIdentifier(String projectId);

    List<Paper> listPaperByProject(String projectId);

    Long countPaper(String projectId);

    Paper getPaperById(String id);
}
