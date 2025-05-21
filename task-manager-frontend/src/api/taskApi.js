import axios from 'axios';
import config from '../config';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: `${config.api.serverUrl}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: config.api.timeout
});

// Request interceptor for logging and debugging
api.interceptors.request.use(
  config => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data || config.params);
    
    // Add date format debugging for POST and PUT requests
    if ((config.method === 'post' || config.method === 'put') && config.data) {
      if (config.data.dueDate) {
        console.log('Request contains dueDate:', config.data.dueDate);
        console.log('dueDate type:', typeof config.data.dueDate);
      }
    }
    
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle error responses from the API
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data;
      
      console.error(`API Error (${status}) on ${error.config.method.toUpperCase()} ${error.config.url}:`, data);
      
      // Log additional details for debugging
      console.error('API Error Details:', error.response);
      
      if (status === 404) {
        console.error('Resource not found. Check URL and parameters.');
      } else if (status === 401) {
        console.error('Unauthorized. Authentication may be required.');
      } else if (status === 403) {
        console.error('Forbidden. You do not have permission to access this resource.');
      } else if (status === 400) {
        console.error('Bad request. Check your input data.');
      } else if (status === 500) {
        console.error('Server error. Check the backend logs for more information.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received from server. The server may be down or not reachable.');
      console.error('Request details:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error: Error setting up request:', error.message);
    }
    
    // Forward the error to be handled by the component
    return Promise.reject(error);
  }
);

// Check API health
export const checkApiHealth = () => api.get('/health');

// Task API functions
export const fetchTasks = () => api.get('/tasks');
export const fetchTaskById = (id) => api.get(`/tasks/${id}`);
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const completeTask = (id) => api.put(`/tasks/${id}/complete`);
export const pendingTask = (id) => api.put(`/tasks/${id}/pending`);
export const searchTasks = (params) => {
  console.log('API: Calling searchTasks with params:', params);
  
  // Ensure all parameters are sent in the expected format
  const searchParams = {};
  
  // Only add title parameter if it exists and is not empty
  if (params.title && params.title.trim() !== '') {
    searchParams.title = encodeURIComponent(params.title.trim());
    console.log('API: Adding title search parameter:', searchParams.title);
  }
  
  // Only add status parameter if it exists and is not empty
  if (params.status && params.status.trim() !== '') {
    searchParams.status = encodeURIComponent(params.status.trim());
    console.log('API: Adding status filter parameter:', searchParams.status);
  }
  
  console.log('API: Final search params for backend:', searchParams);
  
  // Add a timestamp to prevent caching
  searchParams._t = Date.now();
  
  // For debugging, also make a direct fetch call
  const queryString = Object.keys(searchParams)
    .map(key => `${key}=${searchParams[key]}`)
    .join('&');
  
  console.log(`API: Direct URL would be: ${config.api.serverUrl}/api/tasks/search?${queryString}`);
  
  // Log the full URL that will be requested
  console.log('Full search URL:', `${config.api.serverUrl}/api/tasks/search?${queryString}`);
  
  // Try with axios first
  return api.get('/tasks/search', { 
    params: searchParams,
    // Add timeout and error handling for better debugging
    timeout: 10000,
    validateStatus: function (status) {
      return status >= 200 && status < 500; // Default is 200-300
    }
  }).catch(error => {
    console.error('API Error in searchTasks:', error);
    
    // Provide details about the error for debugging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    // If axios failed, try a direct fetch as fallback
    console.log('Attempting fallback fetch call');
    return fetch(`${config.api.serverUrl}/api/tasks/search?${queryString}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fallback fetch succeeded with data:', data);
        return { data };
      })
      .catch(fetchError => {
        console.error('Even fallback fetch failed:', fetchError);
        throw error; // Throw the original axios error
      });
  });
};

export default api; 