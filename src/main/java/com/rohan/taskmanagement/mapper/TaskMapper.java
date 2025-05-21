package com.rohan.taskmanagement.mapper;

import com.rohan.taskmanagement.dto.TaskDTO;
import com.rohan.taskmanagement.model.Task;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class TaskMapper {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskMapper.class);

    public TaskDTO toDTO(Task task) {
        if (task == null) return null;

        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setStatus(task.getStatus());
        dto.setRemarks(task.getRemarks());
        dto.setCreatedOn(task.getCreatedOn());
        dto.setLastUpdatedOn(task.getLastUpdatedOn());
        dto.setCreatedBy(task.getCreatedBy());
        dto.setLastUpdatedBy(task.getLastUpdatedBy());

        return dto;
    }

    public Task toEntity(TaskDTO dto) {
        if (dto == null) return null;

        Task task = new Task();

        if (dto.getId() != null) {
            task.setId(dto.getId());
        }

        task.setTitle(dto.getTitle() != null ? dto.getTitle() : "");
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : "TODO");
        task.setRemarks(dto.getRemarks());

        LocalDateTime now = LocalDateTime.now();
        if (dto.getCreatedOn() != null) {
            task.setCreatedOn(dto.getCreatedOn());
        } else {
            task.setCreatedOn(now);
        }
        
        if (dto.getLastUpdatedOn() != null) {
            task.setLastUpdatedOn(dto.getLastUpdatedOn());
        } else {
            task.setLastUpdatedOn(now);
        }

        if (dto.getCreatedBy() != null && !dto.getCreatedBy().isEmpty()) {
            task.setCreatedBy(dto.getCreatedBy());
        } else {
            task.setCreatedBy("Company Admin");
        }

        if (dto.getLastUpdatedBy() != null && !dto.getLastUpdatedBy().isEmpty()) {
            task.setLastUpdatedBy(dto.getLastUpdatedBy());
        } else {
            task.setLastUpdatedBy(task.getCreatedBy());
        }

        return task;
    }
}
