package com.example.TaskerMasterJava.controller;

import com.example.TaskerMasterJava.model.Subtask;
import com.example.TaskerMasterJava.repository.SubtaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtasks")
public class SubtaskController {

    @Autowired
    SubtaskRepository subtaskRepository;

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/task/{taskId}")
    public List<Subtask> getAllTaskSubtasks(@PathVariable("taskId") int taskId){
        return subtaskRepository.getAllTaskSubtasks(taskId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/{subtaskId}")
    public Subtask getById(@PathVariable("subtaskId") int subtaskId) {
        return subtaskRepository.getById(subtaskId);
    }


    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("")
    public int add(@RequestBody Subtask subtasks) {
        return subtaskRepository.save(subtasks);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/{subtaskId}")
    public int update(@PathVariable("subtaskId") int subtaskId, @RequestBody Subtask updatedSubtask) {
        Subtask subtask = subtaskRepository.getById(subtaskId);
        if(subtask != null) {
            subtask.setContent(updatedSubtask.getContent());
            subtaskRepository.update(subtask);

            return 1;
        } else {
            return -1;
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PatchMapping("/{subtaskId}")
    public int partiallyUpdate(@PathVariable("subtaskId") int subtaskId, @RequestBody Subtask updatedSubtask) {
        Subtask subtask = subtaskRepository.getById(subtaskId);
        if(subtask != null) {
            if(updatedSubtask.getContent() != null) subtask.setContent(updatedSubtask.getContent());
            subtaskRepository.update(subtask);

            return 1;
        } else {
            return -1;
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/{subtaskId}")
    public int delete(@PathVariable("subtaskId") int subtaskId) {
        return subtaskRepository.delete(subtaskId);
    }
}