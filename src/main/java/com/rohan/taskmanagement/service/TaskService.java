package com.rohan.taskmanagement.service;

import com.rohan.taskmanagement.dto.TaskDTO;
import java.util.List;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO);
    TaskDTO getTaskById(Long taskId);
    List<TaskDTO> getAllTasks();
    TaskDTO updateTask(Long taskId, TaskDTO taskDTO);
    void deleteTask(Long taskId);
    TaskDTO markTaskAsCompleted(Long taskId);
    TaskDTO markTaskAsPending(Long taskId);
    List<TaskDTO> searchTasks(String title, String status);
    List<TaskDTO> searchTasks(String keyword);
}