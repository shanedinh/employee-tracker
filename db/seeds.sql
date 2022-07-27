INSERT INTO departments (name)
VALUES 
    ('Design'),
    ('Marketing'),
    ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Graphic Designer', '999999', 1),
    ('Content Marketing Specialist', '999999', 2),
    ('Accountant', '999999', 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
    ('Robert', 'Robertson', 3),
    ('Bob', 'Bobertson', 3),
    ('Alex', 'Johson', 2),
    ('Joe', 'Martineau', 1);