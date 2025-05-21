package com.rohan.taskmanagement.controller;

import com.rohan.taskmanagement.dto.TaskDTO;
import com.rohan.taskmanagement.exception.ResourceNotFoundException;
import com.rohan.taskmanagement.exception.ValidationException;
import com.rohan.taskmanagement.model.Task;
import com.rohan.taskmanagement.repository.TaskRepository;
import com.rohan.taskmanagement.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TaskService taskService;
    
    @Autowired
    private TaskRepository taskRepository;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskDTO taskDTO) {
        try {
            logger.debug("Creating task with title: {}", taskDTO.getTitle());
            
            // Validate required fields
            if (taskDTO.getTitle() == null || taskDTO.getTitle().isEmpty()) {
                logger.error("Task title is required but was not provided");
                return new ResponseEntity<>("Task title is required", HttpStatus.BAD_REQUEST);
            }
            
            // Log creator for clarity
            logger.info("Task creation - CreatedBy: '{}'", 
                    taskDTO.getCreatedBy() != null ? taskDTO.getCreatedBy() : "Company Admin");

            TaskDTO createdTask = taskService.createTask(taskDTO);
            logger.info("Task created successfully with ID: {}", createdTask.getId());
            return new ResponseEntity<>(createdTask, HttpStatus.CREATED);

        } catch (Exception e) {
            logger.error("Error creating task: {}", e.getMessage(), e);
                
            // Return appropriate status code based on the exception type
            if (e instanceof ResourceNotFoundException) {
                return new ResponseEntity<>("Error creating task: " + e.getMessage(), 
                    HttpStatus.NOT_FOUND);
            } else if (e instanceof ValidationException) {
                return new ResponseEntity<>("Validation error: " + e.getMessage(), 
                    HttpStatus.BAD_REQUEST);
            }
                
            return new ResponseEntity<>("Error creating task: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<?> getTaskById(@PathVariable Long taskId) {
        try {
            TaskDTO task = taskService.getTaskById(taskId);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            logger.error("Error fetching task by ID {}: {}", taskId, e.getMessage(), e);
            return new ResponseEntity<>("Error fetching task: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllTasks() {
        try {
            List<TaskDTO> tasks = taskService.getAllTasks();
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching all tasks: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error fetching tasks: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody TaskDTO taskDTO) {
        try {
            logger.debug("Updating task with ID: {} with data: {}", taskId, taskDTO);
            
            // Basic validation
            if (taskId == null) {
                return new ResponseEntity<>("Task ID is required", HttpStatus.BAD_REQUEST);
            }
            
            if (taskDTO.getTitle() == null || taskDTO.getTitle().isEmpty()) {
                return new ResponseEntity<>("Task title is required", HttpStatus.BAD_REQUEST);
            }
            
            // Log fields for debugging
            logger.info("Task update fields - ID: {}, Title: '{}', Description: '{}', Status: '{}'", 
                taskId, taskDTO.getTitle(), taskDTO.getDescription(), taskDTO.getStatus());
            
            TaskDTO updatedTask = taskService.updateTask(taskId, taskDTO);
            logger.info("Task updated successfully with ID: {}", updatedTask.getId());
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            logger.error("Error updating task with ID {}: {}", taskId, e.getMessage(), e);
            
            // Log the stack trace for more detailed debugging
            logger.error("Exception stack trace:", e);
            
            // If there's a nested cause, log it too
            if (e.getCause() != null) {
                logger.error("Root cause: {}", e.getCause().getMessage(), e.getCause());
            }
            
            // Return appropriate status code based on the exception type
            if (e instanceof ResourceNotFoundException) {
                return new ResponseEntity<>("Task not found: " + e.getMessage(), 
                    HttpStatus.NOT_FOUND);
            } else if (e instanceof ValidationException) {
                return new ResponseEntity<>("Validation error: " + e.getMessage(), 
                    HttpStatus.BAD_REQUEST);
            }
            
            // Return more detailed error information
            String errorDetails = e.getMessage();
            if (e.getCause() != null) {
                errorDetails += " - Caused by: " + e.getCause().getMessage();
            }
            
            return new ResponseEntity<>("Error updating task: " + errorDetails, 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        try {
            taskService.deleteTask(taskId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting task with ID {}: {}", taskId, e.getMessage(), e);
            return new ResponseEntity<>("Error deleting task: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{taskId}/complete")
    public ResponseEntity<?> markTaskAsCompleted(@PathVariable Long taskId) {
        try {
            TaskDTO updatedTask = taskService.markTaskAsCompleted(taskId);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            logger.error("Error marking task as complete with ID {}: {}", taskId, e.getMessage(), e);
            return new ResponseEntity<>("Error marking task as complete: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{taskId}/pending")
    public ResponseEntity<?> markTaskAsPending(@PathVariable Long taskId) {
        try {
            TaskDTO updatedTask = taskService.markTaskAsPending(taskId);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            logger.error("Error marking task as pending with ID {}: {}", taskId, e.getMessage(), e);
            return new ResponseEntity<>("Error marking task as pending: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTasks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status) {
        try {
            logger.info("Search API called with raw parameters: title='{}', status='{}'", 
                title != null ? title : "null", 
                status != null ? status : "null");
            
            // Check if the request parameters were received correctly
            Map<String, String[]> parameterMap = new HashMap<>(
                ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .getRequest().getParameterMap()
            );
            
            logger.debug("Raw request parameters: {}", parameterMap);
            
            // Clean up title parameter if provided
            if (title != null) {
                title = title.trim();
                if (title.isEmpty()) {
                    title = null; // Treat empty strings as null
                    logger.debug("Empty title parameter treated as null");
                } else {
                    logger.debug("Using title search parameter: '{}'", title);
                }
            }
            
            // Clean up status parameter if provided
            if (status != null) {
                status = status.trim();
                if (status.isEmpty()) {
                    status = null; // Treat empty strings as null
                    logger.debug("Empty status parameter treated as null");
                } else {
                    logger.debug("Using status filter parameter: '{}'", status);
                }
            }
            
            // Perform the search with both direct method calls for comparison
            logger.info("Calling taskService.searchTasks with title='{}', status='{}'", 
                title != null ? title : "null", 
                status != null ? status : "null");
            
            List<TaskDTO> tasks = taskService.searchTasks(title, status);
            logger.info("Search completed - Found {} tasks matching criteria", tasks.size());
            
            // Debug: print the found tasks
            if (tasks.isEmpty()) {
                logger.warn("No tasks found for search with title='{}', status='{}'", 
                    title, status);
                
                // Try a fallback search if we have a title to search for
                if (title != null) {
                    logger.info("Attempting fallback search with title only");
                    
                    // Get all tasks and manually filter them in memory
                    List<TaskDTO> allTasks = taskService.getAllTasks();
                    String lowerCaseTitle = title.toLowerCase();
                    
                    List<TaskDTO> filteredTasks = allTasks.stream()
                        .filter(task -> task.getTitle().toLowerCase().contains(lowerCaseTitle))
                        .collect(Collectors.toList());
                    
                    if (!filteredTasks.isEmpty()) {
                        logger.info("Fallback search found {} tasks", filteredTasks.size());
                        tasks = filteredTasks;
                    }
                }
            } else {
                // Log the found tasks for debugging
                for (TaskDTO task : tasks) {
                    logger.debug("Found task: ID={}, Title='{}', Status='{}'", 
                        task.getId(), task.getTitle(), task.getStatus());
                }
            }
            
            // Even if no tasks were found, return what we have with 200 OK
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error searching tasks: {}", e.getMessage(), e);
            return new ResponseEntity<>(
                Map.of(
                    "error", "Error searching tasks: " + e.getMessage(),
                    "timestamp", LocalDateTime.now().toString(),
                    "search_parameters", Map.of(
                        "title", title != null ? title : "null",
                        "status", status != null ? status : "null"
                    )
                ), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Added test method to diagnose task update issues
    @GetMapping("/test/update/{taskId}")
    public ResponseEntity<?> testTaskUpdate(@PathVariable Long taskId) {
        try {
            logger.info("Running task update diagnostics for task ID: {}", taskId);
            
            // Step 1: Try to find the task
            TaskDTO existingTask = taskService.getTaskById(taskId);
            logger.info("Found task: ID={}, Title='{}', Status='{}'", 
                existingTask.getId(), existingTask.getTitle(), existingTask.getStatus());
            
            // Step 2: Create a diagnostic response with all task fields
            HashMap<String, Object> diagnosticInfo = new HashMap<>();
            diagnosticInfo.put("task_found", true);
            diagnosticInfo.put("task_id", existingTask.getId());
            diagnosticInfo.put("title", existingTask.getTitle());
            diagnosticInfo.put("description", existingTask.getDescription());
            diagnosticInfo.put("status", existingTask.getStatus());
            diagnosticInfo.put("due_date", existingTask.getDueDate());
            diagnosticInfo.put("created_by", existingTask.getCreatedBy());
            diagnosticInfo.put("last_updated_by", existingTask.getLastUpdatedBy());
            
            return ResponseEntity.ok(diagnosticInfo);
        } catch (Exception e) {
            logger.error("Error during task update diagnostics for task ID {}: {}", taskId, e.getMessage(), e);
            
            HashMap<String, Object> errorInfo = new HashMap<>();
            errorInfo.put("task_found", false);
            errorInfo.put("error", e.getMessage());
            if (e instanceof ResourceNotFoundException) {
                errorInfo.put("error_type", "NOT_FOUND");
                return new ResponseEntity<>(errorInfo, HttpStatus.NOT_FOUND);
            } else {
                errorInfo.put("error_type", e.getClass().getSimpleName());
                return new ResponseEntity<>(errorInfo, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Diagnostic endpoint for testing search functionality
    @GetMapping("/search-debug")
    public ResponseEntity<?> debugSearch(@RequestParam String title) {
        try {
            logger.info("DEBUG API: Testing search with title='{}'", title);
            
            // Get direct repository results
            List<Task> rawResults = taskRepository.findByTitleContainingIgnoreCase(title);
            logger.info("DEBUG API: Raw repository results count: {}", rawResults.size());
            
            // Get results via service
            List<TaskDTO> serviceResults = taskService.searchTasks(title, null);
            logger.info("DEBUG API: Service results count: {}", serviceResults.size());
            
            // Construct response with detailed debugging info
            Map<String, Object> debugResponse = new HashMap<>();
            debugResponse.put("search_term", title);
            debugResponse.put("raw_count", rawResults.size());
            debugResponse.put("service_count", serviceResults.size());
            debugResponse.put("raw_results", rawResults.stream()
                .map(task -> Map.of(
                    "id", task.getId(),
                    "title", task.getTitle(),
                    "status", task.getStatus()
                ))
                .collect(Collectors.toList())
            );
            debugResponse.put("service_results", serviceResults);
            
            return ResponseEntity.ok(debugResponse);
        } catch (Exception e) {
            logger.error("DEBUG API: Error during search debug: {}", e.getMessage(), e);
            return new ResponseEntity<>("Debug error: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
