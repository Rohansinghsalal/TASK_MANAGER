/**
 * Application configuration
 */
const config = {
  /**
   * API configuration
   */
  api: {
    /**
     * Base URL for API requests
     * Will use the environment variable if set, otherwise fallback to /api
     */
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    
    /**
     * Timeout for API requests in milliseconds
     */
    timeout: 10000,
    
    /**
     * Backend server URL
     */
    serverUrl: 'http://localhost:9090'
  },
  
  /**
   * Application metadata
   */
  app: {
    /**
     * Application name
     */
    name: import.meta.env.VITE_APP_NAME || 'Task Management System',
    
    /**
     * Application version
     */
    version: '1.0.0'
  }
};

export default config; 