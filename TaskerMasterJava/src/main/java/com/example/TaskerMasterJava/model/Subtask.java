package com.example.TaskerMasterJava.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subtask {

    private int id;
    private int taskId;
    private String content;
    private String username;
    private Date createdAt;
    private String status;


}
