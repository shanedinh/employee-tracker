INSERT INTO departments (name)
VALUES 
    ('Design'),
    ('Marketing'),
    ('Finance'),
    ('Sales'),
    ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Graphic Designer', '70000', 1),
    ('Content Marketing Specialist', '83000', 2),
    ('Accountant', '90000', 3),
    ('Lawyer', '999999', 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Robert', 'Robertson', 3, 1),
    ('Bob', 'Bobertson', 2, 2),
    ('Alex', 'Johnson', 1, 1),
    ('Joe', 'Martineau', 1, 3);