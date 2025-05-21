package com.rohan.taskmanagement.repository;

import com.rohan.taskmanagement.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Basic search using derived query methods
    List<Task> findByTitleContainingIgnoreCase(String title);
    List<Task> findByStatus(String status);
    List<Task> findByTitleContainingIgnoreCaseAndStatus(String title, String status);
    
    // Custom JPQL query for title search as fallback
    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTitle, '%'))")
    List<Task> searchByTitle(@Param("searchTitle") String title);
    
    // Native SQL query as last resort
    @Query(value = "SELECT * FROM tasks WHERE LOWER(title) LIKE LOWER(CONCAT('%', :term, '%'))", nativeQuery = true)
    List<Task> findTasksByTitleNative(@Param("term") String searchTerm);
} 