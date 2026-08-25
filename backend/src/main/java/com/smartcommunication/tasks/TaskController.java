package com.smartcommunication.tasks;

import com.smartcommunication.users.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskItem>> getTasks() {
        return ResponseEntity.ok(taskService.getTasks());
    }

    @PostMapping
    public ResponseEntity<TaskItem> createTask(@RequestBody TaskItem task, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(taskService.createTask(task, currentUser));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskItem> updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }
}
