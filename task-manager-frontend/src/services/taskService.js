import { 
  fetchTasks, 
  createTask, 
  updateTask as apiUpdateTask,
  deleteTask,
  completeTask,
  pendingTask,
  searchTasks,
  fetchTaskById
} from '../api/taskApi';
import { toISOString } from '../utils/dateUtils';

/**
 * Service for managing tasks with additional business logic
 */
class TaskService {
  /**
   * Get all tasks
   * @returns {Promise} Promise resolving to task list
   */
  async getAllTasks() {
    try {
      const response = await fetchTasks();
      return response.data;
    } catch (error) {
      console.error('Failed to get tasks:', error);
      throw error;
    }
  }

  /**
   * Get a task by ID
   * @param {number} taskId - The task ID
   * @returns {Promise} Promise resolving to task data
   */
  async getTaskById(taskId) {
    try {
      const response = await fetchTaskById(taskId);
      return response.data;
    } catch (error) {
      console.error(`Failed to get task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new task
   * @param {Object} taskData - The task data
   * @returns {Promise} Promise resolving to created task
   */
  async createTask(taskData) {
    try {
      // Basic validation
      if (!taskData.title || taskData.title.trim() === '') {
        throw new Error('Task title is required');
      }
      
      // Format dates correctly for API
      const formattedTask = this._formatTaskDates(taskData);
      
      // Ensure all required fields are present
      // Only set createdBy if not already specified in the taskData
      if (!formattedTask.createdBy || formattedTask.createdBy === '') {
        formattedTask.createdBy = 'Company Admin';
      }
      
      // Set lastUpdatedBy if not already specified
      if (!formattedTask.lastUpdatedBy || formattedTask.lastUpdatedBy === '') {
        formattedTask.lastUpdatedBy = formattedTask.createdBy;
      }
      
      // Ensure status is set to a valid value
      if (!formattedTask.status) {
        formattedTask.status = 'TODO';
      }
      
      console.log('Sending task data to API:', formattedTask);
      
      try {
        const response = await createTask(formattedTask);
        console.log('Task created successfully:', response.data);
        return response.data;
      } catch (apiError) {
        console.error('API Error creating task:', apiError);
        
        // Check if there's a response from the server
        if (apiError.response) {
          const status = apiError.response.status;
          const errorData = apiError.response.data;
          
          console.error(`Server returned ${status} status:`, errorData);
          
          // Format the error message based on the response
          let errorMessage = 'Failed to create task: ';
          
          if (typeof errorData === 'string') {
            errorMessage += errorData;
          } else if (errorData && typeof errorData === 'object') {
            // Try to get a meaningful message from the error object
            errorMessage += errorData.message || JSON.stringify(errorData);
          } else {
            errorMessage += 'Unknown server error';
          }
          
          throw new Error(errorMessage);
        } else if (apiError.request) {
          // The request was made but no response was received
          throw new Error('No response received from server. Check your network connection.');
        } else {
          // Something happened in setting up the request
          throw new Error(`Error creating task: ${apiError.message}`);
        }
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      
      // If it's already an Error object with a formatted message, just throw it
      if (error instanceof Error) {
        throw error;
      }
      
      // Otherwise create a new error with a generic message
      throw new Error(`Failed to create task: ${error}`);
    }
  }

  /**
   * Update an existing task
   * @param {number} taskId - The task ID
   * @param {Object} taskData - The updated task data
   * @returns {Promise} Promise resolving to updated task
   */
  async updateTask(taskId, taskData) {
    try {
      // Basic validation
      if (!taskId) {
        throw new Error('Task ID is required for update');
      }
      
      if (!taskData.title || taskData.title.trim() === '') {
        throw new Error('Task title is required');
      }
      
      // Create a minimal task object with only the essential fields
      const minimalTaskData = {
        title: taskData.title.trim(),
        status: taskData.status || 'TODO'
      };
      
      // Only add these fields if they actually exist and are needed
      if (taskData.description) {
        minimalTaskData.description = taskData.description;
      }
      
      if (taskData.remarks) {
        minimalTaskData.remarks = taskData.remarks;
      }
      
      if (taskData.lastUpdatedBy) {
        minimalTaskData.lastUpdatedBy = taskData.lastUpdatedBy;
      }
      
      // Only add dueDate if it exists and is in the correct format
      if (taskData.dueDate) {
        try {
          minimalTaskData.dueDate = toISOString(taskData.dueDate);
        } catch (dateError) {
          console.warn('Invalid date format, not including due date in update', dateError);
        }
      }
      
      console.log('Updating task:', taskId, 'with data:', minimalTaskData);
      
      try {
        const response = await apiUpdateTask(taskId, minimalTaskData);
        console.log('Task updated successfully:', response.data);
        return response.data;
      } catch (apiError) {
        console.error('API Error updating task:', apiError);
        
        // Check if there's a response from the server
        if (apiError.response) {
          const status = apiError.response.status;
          const errorData = apiError.response.data;
          
          console.error(`Server returned ${status} status:`, errorData);
          
          // Format the error message based on the response
          let errorMessage = 'Failed to update task: ';
          
          if (typeof errorData === 'string') {
            errorMessage += errorData;
          } else if (errorData && typeof errorData === 'object') {
            // Try to get a meaningful message from the error object
            errorMessage += errorData.message || JSON.stringify(errorData);
          } else {
            errorMessage += 'Unknown server error';
          }
          
          throw new Error(errorMessage);
        } else if (apiError.request) {
          // The request was made but no response was received
          throw new Error('No response received from server. Check your network connection.');
        } else {
          // Something happened in setting up the request
          throw new Error(`Error updating task: ${apiError.message}`);
        }
      }
    } catch (error) {
      console.error(`Failed to update task ${taskId}:`, error);
      
      // If it's already an Error object with a formatted message, just throw it
      if (error instanceof Error) {
        throw error;
      }
      
      // Otherwise create a new error with a generic message
      throw new Error(`Failed to update task: ${error}`);
    }
  }

  /**
   * Delete a task
   * @param {number} taskId - The task ID
   * @returns {Promise} Promise resolving on completion
   */
  async deleteTask(taskId) {
    try {
      await deleteTask(taskId);
      return true;
    } catch (error) {
      console.error(`Failed to delete task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Mark a task as completed
   * @param {number} taskId - The task ID
   * @returns {Promise} Promise resolving to updated task
   */
  async markTaskCompleted(taskId) {
    try {
      const response = await completeTask(taskId);
      return response.data;
    } catch (error) {
      console.error(`Failed to mark task ${taskId} as completed:`, error);
      throw error;
    }
  }

  /**
   * Mark a task as pending
   * @param {number} taskId - The task ID
   * @returns {Promise} Promise resolving to updated task
   */
  async markTaskPending(taskId) {
    try {
      const response = await pendingTask(taskId);
      return response.data;
    } catch (error) {
      console.error(`Failed to mark task ${taskId} as pending:`, error);
      throw error;
    }
  }

  /**
   * Search for tasks using filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise} Promise resolving to filtered task list
   */
  async searchTasks(filters = {}) {
    try {
      const searchFilters = {};
      
      // Only add title filter if it exists and is not empty
      if (filters.title && filters.title.trim() !== '') {
        searchFilters.title = filters.title.trim();
      }
      
      // Only add status filter if it exists and is not empty
      if (filters.status && filters.status.trim() !== '') {
        searchFilters.status = filters.status.trim();
      }
      
      console.log('Searching tasks with filters:', searchFilters);
      
      const response = await searchTasks(searchFilters);
      return response.data || [];
    } catch (error) {
      console.error('Failed to search tasks:', error);
      throw error;
    }
  }

  /**
   * Helper method to format dates in a task object
   * @param {Object} task - Task data with dates to format
   * @returns {Object} Copy of task with formatted dates
   */
  _formatTaskDates(task) {
    const formattedTask = { ...task };
    
    // Format dueDate if it exists
    if (formattedTask.dueDate) {
      try {
        formattedTask.dueDate = toISOString(formattedTask.dueDate);
      } catch (e) {
        console.warn('Invalid date format detected, using original value:', e);
      }
    }
    
    return formattedTask;
  }
}

export default new TaskService(); 