-- Reset script to drop and recreate tables with auto-increment starting from 1
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- Recreate tables
CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1;

CREATE TABLE tasks (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_by VARCHAR(255) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  description VARCHAR(1000),
  due_date TIMESTAMP,
  last_updated_by VARCHAR(255) NOT NULL,
  last_updated_on TIMESTAMP NOT NULL,
  remarks VARCHAR(500),
  status VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  user_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB AUTO_INCREMENT=1;

SET FOREIGN_KEY_CHECKS = 1; 