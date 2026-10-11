package com.buaa.annotation.model;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.Data;

import java.util.Collections;
import java.util.List;

@Data
public final class PageModel<T> {
    private long pageNum = 1;

    private long pageSize = 10;

    private long total = 0;

    private List<T> records = Collections.emptyList();

    /**
     * 将mybatis-plus的分页转为自定义分页
     *
     * @param page mybatis-plus的分页
     * @param <T>  记录类型
     * @return 自定义分页
     */
    public static <T> PageModel<T> convert(IPage<T> page) {
        PageModel<T> pageResult = new PageModel<>();
        pageResult.pageNum = page.getCurrent();
        pageResult.pageSize = page.getSize();
        pageResult.total = page.getTotal();
        pageResult.records = page.getRecords();
        return pageResult;
    }
}
