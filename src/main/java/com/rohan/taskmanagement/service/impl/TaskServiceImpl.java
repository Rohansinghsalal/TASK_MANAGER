package com.rohan.taskmanagement.service.impl;

import com.rohan.taskmanagement.dto.TaskDTO;
import com.rohan.taskmanagement.exception.ResourceNotFoundException;
import com.rohan.taskmanagement.exception.ValidationException;
import com.rohan.taskmanagement.mapper.TaskMapper;
import com.rohan.taskmanagement.model.Task;
import com.rohan.taskmanagement.repository.TaskRepository;
import com.rohan.taskmanagement.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskServiceImpl.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskMapper taskMapper;

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
        if (taskDTO.getTitle() == null || taskDTO.getTitle().trim().isEmpty()) {
            logger.error("Task creation failed: Title cannot be null or empty");
            throw new ValidationException("title", "Task title cannot be null or empty");
        }
        
        logger.debug("Creating task with title: {}", taskDTO.getTitle());
        
        try {
            Task task = new Task();
            task.setTitle(taskDTO.getTitle());
            task.setDescription(taskDTO.getDescription());
            task.setDueDate(taskDTO.getDueDate());
            task.setStatus(taskDTO.getStatus() != null ? taskDTO.getStatus() : "TODO");
            task.setRemarks(taskDTO.getRemarks());
            
            LocalDateTime now = LocalDateTime.now();
            task.setCreatedOn(now);
            task.setLastUpdatedOn(now);
            
            if (taskDTO.getCreatedBy() != null && !taskDTO.getCreatedBy().isEmpty()) {
                task.setCreatedBy(taskDTO.getCreatedBy());
            } else {
                task.setCreatedBy("Company Admin");
            }
            
            if (taskDTO.getLastUpdatedBy() != null && !taskDTO.getLastUpdatedBy().isEmpty()) {
                task.setLastUpdatedBy(taskDTO.getLastUpdatedBy());
            } else {
                task.setLastUpdatedBy(task.getCreatedBy());
            }
            
            Task savedTask = taskRepository.save(task);
            logger.info("Task saved successfully with ID: {}", savedTask.getId());
            
            return taskMapper.toDTO(savedTask);
        } catch (Exception e) {
            logger.error("Failed to create task: {}", e.getMessage(), e);
            if (e instanceof ValidationException || e instanceof ResourceNotFoundException) {
                throw e;
            } else {
                throw new RuntimeException("Failed to create task: " + e.getMessage(), e);
            }
        }
    }

    @Override
    public List<TaskDTO> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> searchTasks(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            logger.debug("Empty keyword provided, returning all tasks");
            return getAllTasks();
        }
        
        // Use the other search method which has more robust fallback logic
        logger.debug("Redirecting single keyword search to more robust search method");
        return searchTasks(keyword, null);
    }

    @Override
    public TaskDTO getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return taskMapper.toDTO(task);
    }

    @Override
    public TaskDTO updateTask(Long taskId, TaskDTO taskDTO) {
        try {
            if (taskId == null) {
                throw new ValidationException("taskId", "Task ID cannot be null");
            }
            
            if (taskDTO.getTitle() == null || taskDTO.getTitle().trim().isEmpty()) {
                throw new ValidationException("title", "Task title cannot be null or empty");
            }
            
            Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
            
            existingTask.setTitle(taskDTO.getTitle());
            existingTask.setDescription(taskDTO.getDescription());
            existingTask.setDueDate(taskDTO.getDueDate());
            existingTask.setRemarks(taskDTO.getRemarks());
            
            if (taskDTO.getStatus() != null && !taskDTO.getStatus().isEmpty()) {
                existingTask.setStatus(taskDTO.getStatus());
            }
            
            existingTask.setLastUpdatedOn(LocalDateTime.now());
            
            if (taskDTO.getLastUpdatedBy() != null && !taskDTO.getLastUpdatedBy().isEmpty()) {
                existingTask.setLastUpdatedBy(taskDTO.getLastUpdatedBy());
            } else {
                existingTask.setLastUpdatedBy("System Update");
            }
            
            Task updatedTask = taskRepository.save(existingTask);
            return taskMapper.toDTO(updatedTask);
        } catch (Exception e) {
            logger.error("Error updating task: {}", e.getMessage());
            if (e instanceof ResourceNotFoundException || e instanceof ValidationException) {
                throw e;
            } else {
                throw new RuntimeException("Failed to update task: " + e.getMessage(), e);
            }
        }
    }

    @Override
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        taskRepository.deleteById(taskId);
        logger.info("Task with ID {} deleted", taskId);
    }

    @Override
    public TaskDTO markTaskAsCompleted(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setStatus("DONE");
        task.setLastUpdatedOn(LocalDateTime.now());
        task.setLastUpdatedBy("System Status Update");

        Task updatedTask = taskRepository.save(task);
        return taskMapper.toDTO(updatedTask);
    }

    @Override
    public TaskDTO markTaskAsPending(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setStatus("TODO");
        task.setLastUpdatedOn(LocalDateTime.now());
        task.setLastUpdatedBy("System Status Update");

        Task updatedTask = taskRepository.save(task);
        return taskMapper.toDTO(updatedTask);
    }

    @Override
    public List<TaskDTO> searchTasks(String title, String status) {
        List<Task> tasks = null;
        
        // Log search parameters
        logger.debug("Searching tasks with title='{}', status='{}'", title, status);
        
        // Clean up parameters (extra safety validation)
        if (title != null) {
            title = title.trim();
            if (title.isEmpty()) {
                title = null;
            }
        }
        
        if (status != null) {
            status = status.trim();
            if (status.isEmpty()) {
                status = null;
            }
        }
        
        try {
            // First attempt: Try with Spring Data JPA derived query methods
            if (title != null && status != null) {
                logger.debug("Searching by both title and status using derived query method");
                tasks = taskRepository.findByTitleContainingIgnoreCaseAndStatus(title, status);
            } else if (title != null) {
                logger.debug("Searching by title only: '{}' using derived query method", title);
                tasks = taskRepository.findByTitleContainingIgnoreCase(title);
                
                // Check if we got results, if not, try the next method
                if (tasks.isEmpty()) {
                    logger.debug("No results with derived query method. Trying JPQL query.");
                    tasks = taskRepository.searchByTitle(title);
                    
                    // If still no results, try native query
                    if (tasks.isEmpty()) {
                        logger.debug("No results with JPQL query. Trying native SQL query.");
                        tasks = taskRepository.findTasksByTitleNative(title);
                    }
                }
            } else if (status != null) {
                logger.debug("Filtering by status only: '{}'", status);
                tasks = taskRepository.findByStatus(status);
            } else {
                logger.debug("No search criteria provided, returning all tasks");
                tasks = taskRepository.findAll();
            }
            
            // Final fallback - if still no results and we were searching by title
            if ((tasks == null || tasks.isEmpty()) && title != null) {
                logger.warn("All search methods failed. Performing manual search.");
                // Get all tasks and filter manually
                List<Task> allTasks = taskRepository.findAll();
                String lowerTitle = title.toLowerCase();
                tasks = allTasks.stream()
                    .filter(task -> task.getTitle().toLowerCase().contains(lowerTitle))
                    .collect(Collectors.toList());
                
                logger.debug("Manual search found {} tasks", tasks.size());
            }
            
            // Make sure tasks is never null
            if (tasks == null) {
                tasks = List.of();
            }
            
            logger.debug("Search results count: {}", tasks.size());
            if (tasks.isEmpty()) {
                logger.warn("No tasks found for the search criteria");
            } else {
                // Log the first few results for debugging
                tasks.stream().limit(5).forEach(task -> 
                    logger.debug("Found task: id={}, title='{}', status='{}'", 
                        task.getId(), task.getTitle(), task.getStatus())
                );
            }
            
            return tasks.stream()
                    .map(taskMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error during task search: {}", e.getMessage(), e);
            return List.of(); // Return empty list instead of throwing exception
        }
    }
}
