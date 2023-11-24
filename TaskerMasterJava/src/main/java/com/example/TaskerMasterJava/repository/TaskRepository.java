package com.example.TaskerMasterJava.repository;

import com.example.TaskerMasterJava.model.Subtask;
import com.example.TaskerMasterJava.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TaskRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<Task> getAll(){
        return jdbcTemplate.query("SELECT * FROM tasks", BeanPropertyRowMapper.newInstance(Task.class));
    }

    public List<Task> getAllTasksWithSubtasks() {
        List<Task> tasks = jdbcTemplate.query("SELECT * FROM posts", BeanPropertyRowMapper.newInstance(Task.class));

        for (Task task : tasks){
            List<Subtask> subtasks = jdbcTemplate.query(
                    "SELECT * FROM comments WHERE taskId = ?",
                    new Object[]{task.getId()},
                    BeanPropertyRowMapper.newInstance(Subtask.class));
        task.setSubtasks(subtasks);
        }
        return tasks;
    }

    public Task getById(int idTask) {
        return jdbcTemplate.queryForObject("SELECT * FROM tasks WHERE " +
                "id = ?", BeanPropertyRowMapper.newInstance(Task.class), idTask);
    }

    public int save(Task task) {
        jdbcTemplate.update("INSERT INTO posts(taskName, deadline, notes, priority, username, createdAt, status) VALUES(?, ?, ?, ?, ?, ?, ?)",
                task.getTaskName(),
                task.getDeadline(),
                task.getNotes(),
                task.getPriority(),
                task.getUsername(),
                task.getCreatedAt(),
                task.getStatus()
        );
        return 1;
    }

    public int update(Task task) {
        return jdbcTemplate.update("UPDATE tasks SET taskName=?, deadline=?, notes=?, priority=?, status=? WHERE id=?",
                task.getTaskName(),
                task.getDeadline(),
                task.getNotes(),
                task.getPriority(),
                task.getStatus(),
                task.getId()
        );
    }

    public int delete(int taskId) {
        return jdbcTemplate.update("DELETE FROM tasks WHERE id=?", taskId);
    }




}
