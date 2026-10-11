package com.buaa.annotation.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("biz_annotator")
public class Annotator {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String userId;

    private String projectId;
}
