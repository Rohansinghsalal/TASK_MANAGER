package com.rohan.taskmanagement.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;

/**
 * Configuration for resetting database schema on application startup
 * This will ensure user IDs and task IDs start from 1
 * Only active when the 'reset-db' profile is active
 */
@Configuration
@Profile("reset-db") // Only run when this profile is active
public class DatabaseResetConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseResetConfig.class);
    
    @Value("${app.db.reset:false}")
    private boolean shouldResetDb;
    
    /**
     * Bean that runs the database reset script
     * Note: This will clear all data in the database
     */
    @Bean
    public CommandLineRunner databaseReset(@Autowired DataSource dataSource) {
        return args -> {
            if (!shouldResetDb) {
                logger.info("Database reset is disabled. Skipping reset operation.");
                return;
            }
            
            logger.info("Executing database reset script on startup");
            
            try {
                // Load and execute the SQL script
                ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                populator.addScript(new ClassPathResource("db/reset_schema.sql"));
                populator.execute(dataSource);
                
                logger.info("Database schema reset successfully. All tables recreated with auto-increment starting from 1.");
            } catch (Exception e) {
                logger.error("Error executing database reset script", e);
            }
        };
    }
} 