package com.example.TaskerMasterJava.controller;

import com.example.TaskerMasterJava.model.Task;
import com.example.TaskerMasterJava.repository.SubtaskRepository;
import com.example.TaskerMasterJava.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    SubtaskRepository subtaskRepository;

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("")
    public List<Task> getAll() {
        return taskRepository.getAll();
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/tasksWithSubtasks")
    public List<Task> getAllTasksWithSubtasks() {
        return taskRepository.getAllTasksWithSubtasks();
    }


    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/{taskId}")
    public Task getById(@PathVariable("taskId") int taskId) {
        return taskRepository.getById(taskId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("")
    public int add(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/{taskId}")
    public int update(@PathVariable("taskId") int taskId, @RequestBody Task updatedTask) {
        Task task = taskRepository.getById(taskId);
        if(task != null) {
            task.setTaskName(updatedTask.getTaskName());
            task.setNotes(updatedTask.getNotes());
            task.setPriority(updatedTask.getPriority());
            task.setStatus(updatedTask.getStatus());
            task.setDeadline(updatedTask.getDeadline());

            taskRepository.update(task);

            return 1;
        } else {
            return -1;
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/{taskId}")
    public int delete(@PathVariable("taskId") int taskId) {
        Task task = taskRepository.getById(taskId);

        if (task != null) {
            subtaskRepository.deleteByTaskId(taskId);
            taskRepository.delete(taskId);

            return 1;
        } else {
            return -1;
        }
    }
}
