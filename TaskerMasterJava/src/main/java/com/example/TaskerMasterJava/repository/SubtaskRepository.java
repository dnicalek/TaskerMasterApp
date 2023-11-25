package com.example.TaskerMasterJava.repository;

import com.example.TaskerMasterJava.model.Subtask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SubtaskRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<Subtask> getAllTaskSubtasks(int idTask) {
        return jdbcTemplate.query("SELECT * FROM subtasks WHERE " +
                "taskId = ?", BeanPropertyRowMapper.newInstance(Subtask.class), idTask);
    }

    public Subtask getById(int idSubtask) {
        return jdbcTemplate.queryForObject("SELECT * FROM subtasks WHERE " +
                "id = ?", BeanPropertyRowMapper.newInstance(Subtask.class), idSubtask);
    }

    public int save(Subtask subtask) {
        jdbcTemplate.update("INSERT INTO subtasks(taskId, content, username, createdAt, status) VALUES (?, ?, ?, ?, ?)",
                subtask.getTaskId(),
                subtask.getContent(),
                subtask.getUsername(),
                subtask.getCreatedAt(),
                subtask.getStatus()
                );
        return 1;
    }

    public int update(Subtask subtask) {
        return jdbcTemplate.update("UPDATE subtasks SET content=?, status=? WHERE id=?",
                subtask.getContent(),
                subtask.getStatus(),
                subtask.getId()
        );
    }

    public int delete(int subtaskId) {
        return jdbcTemplate.update("DELETE FROM subtasks WHERE id=?", subtaskId);
    }

    public int deleteByTaskId(int taskId) {
        return jdbcTemplate.update("DELETE FROM subtasks WHERE taskId=?", taskId);
    }
}
