DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS configs;

CREATE TABLE users (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, 
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    years_of_study INTEGER NOT NULL,
    semesters_per_year INTEGER NOT NULL,
    grades_json TEXT
);

CREATE TABLE configs (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    faculty_name TEXT NOT NULL, 
    domain TEXT NOT NULL,
    user_id INTEGER NOT NULL, 
    user_name TEXT NOT NULL,
    grades_json TEXT
);