CREATE TABLE Course (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    course_description TEXT
);

CREATE TABLE Student (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    major TEXT
);

CREATE TABLE Assignment (
    assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_name TEXT NOT NULL,
    course_id INTEGER,
    FOREIGN KEY(course_id) REFERENCES Course(course_id)
);

CREATE TABLE Completion (
    completion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    assignment_id INTEGER,
    completion_time DATE,
    grade INTEGER,
    credits INTEGER,
    FOREIGN KEY(student_id) REFERENCES Student(student_id),
    FOREIGN KEY(assignment_id) REFERENCES Assignment(assignment_id)
);
