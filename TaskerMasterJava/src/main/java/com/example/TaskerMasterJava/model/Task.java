package com.example.TaskerMasterJava.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

    private int id;
    private String taskName;
    private Date deadline;
    private String notes;
    private String priority;
    private String username;
    private Date createdAt;
    private String status;
    private List<Subtask> subtasks;


}
