package com.buaa.annotation.controller;

import com.buaa.annotation.service.ResultExportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;

@RestController
public class ResultExportController {

    @Autowired
    private ResultExportService resultExportService;

    @GetMapping("/export")
    public void exportResult(@RequestParam String projectId, HttpServletResponse response) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getOutputStream(), resultExportService.export(projectId));
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Content-Disposition", String.format("attachment; filename=\"%s\"", URLEncoder.encode(projectId + ".json", "UTF-8")));
    }
}
