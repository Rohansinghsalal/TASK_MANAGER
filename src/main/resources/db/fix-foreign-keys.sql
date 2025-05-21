-- Script to fix foreign key constraints - preventing user deletion when tasks are deleted

-- Step 1: First check for the actual foreign key name (adjust as needed)
SELECT TABLE_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'task_management'
  AND TABLE_NAME = 'tasks'
  AND REFERENCED_TABLE_NAME = 'users';

-- Step 2: Drop the existing foreign key constraint (replace FK_NAME with actual constraint name from previous query)
-- If there's no result from the previous query, you can try this directly using the table structure
ALTER TABLE tasks
DROP FOREIGN KEY tasks_ibfk_1;

-- If the above doesn't work, try alternative constraint names:
-- ALTER TABLE tasks DROP FOREIGN KEY FK_tasks_user;
-- ALTER TABLE tasks DROP FOREIGN KEY fk_tasks_user_id;

-- Step 3: Re-create the foreign key without CASCADE DELETE
ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_user_id
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE RESTRICT
ON UPDATE RESTRICT;

-- Step 4: Verify the new constraint
SELECT TABLE_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, DELETE_RULE
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
WHERE TABLE_NAME = 'tasks'
  AND REFERENCED_TABLE_NAME = 'users'; 