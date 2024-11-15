CREATE DATABASE crud;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_firstname VARCHAR(255) NOT NULL,
  user_lastname VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL 
);

INSERT INTO users (user_firstname, user_lastname, user_email, user_password) VALUES ('Diego', 'Cruz', 'diego@mail.com', '123456789'); 

CREATE TABLE tasks (
  task_id SERIAL,
  user_id UUID,
  task_name VARCHAR(255) NOT NULL,
  task_description VARCHAR(255) NOT NULL,
  task_deadline DATE,
  task_status VARCHAR(255) NOT NULL,
  PRIMARY KEY (task_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
)

INSERT INTO tasks (user_id, task_name, task_description, task_deadline, task_status) values ('11090df6-2215-4473-8e0e-78560804843f', 'Task1', 'Description1', '2024-12-10', 'Pending')

SELECT * FROM tasks

SELECT * FROM users INNER JOIN tasks ON users.user_id = tasks.user_id 