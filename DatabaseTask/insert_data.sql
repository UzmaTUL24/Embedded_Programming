-- insert_data.sql

-- Original Courses
INSERT INTO Course (course_name, course_description) VALUES
('Database Systems', 'Introduction to databases'),
('Web Development', 'Frontend and backend web development'),
('Data Analysis', 'Data analysis using Python');

-- Additional Courses
INSERT INTO Course (course_name, course_description) VALUES
('Mobile App Development', 'Creating apps for iOS and Android'),
('Machine Learning', 'Introduction to ML algorithms');

-- Original Students
INSERT INTO Student (student_name, major) VALUES
('Alice', 'Computer Science'),
('Uzma', 'Information Systems'),
('Charlie', 'Software Engineering');

-- Additional Students
INSERT INTO Student (student_name, major) VALUES
('David', 'Data Science'),
('Eva', 'Cybersecurity');

-- Original Assignments
INSERT INTO Assignment (task_name, course_id) VALUES
('SQL Basics', 1),
('Normalize Tables', 1),
('HTML & CSS Project', 2),
('Python Data Analysis', 3);

-- Additional Assignments
INSERT INTO Assignment (task_name, course_id) VALUES
('iOS App Project', 4),
('Android App Project', 4),
('Linear Regression', 5),
('Classification Project', 5);

-- Original Completions
INSERT INTO Completion (student_id, assignment_id, completion_time, grade, credits) VALUES
(1, 1, '2025-01-05', 85, 5),
(1, 2, '2025-01-15', 90, 5),
(2, 3, '2025-02-01', 70, 4),
(3, 4, '2024-12-20', 95, 6);

-- Additional Completions
INSERT INTO Completion (student_id, assignment_id, completion_time, grade, credits) VALUES
(4, 5, '2025-02-10', 88, 5),
(4, 6, '2025-02-12', 92, 5),
(5, 7, '2025-01-18', 75, 4),
(5, 8, '2025-01-20', 80, 5);
