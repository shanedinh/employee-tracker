const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});

// Start app & presented with:
// DONE --view all dept, view all employees, view all roles
// DONE add a dept, add an employee, DONE add a role, update employee role

const promptUser = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menuSelect",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View all roles",
          "View all departments",
          "Add an employee",
          "Add a role",
          "Add a department",
          "Update employee role",
          "Delete something",
          "Quit",
        ],
      },
    ])

    .then((selection) => {
      const { menuSelect } = selection;
      if (menuSelect === "View all employees") {
        viewEmployees();
      }
      if (menuSelect === "Add an employee") {
        addEmployee();
      }
      if (menuSelect === "View all roles") {
        viewRoles();
      }
      if (menuSelect === "Add a role") {
        addRole();
      }
      if (menuSelect === "Update employee role") {
        updateRole();
      }
      if (menuSelect === "View all departments") {
        viewDepartments();
      }
      if (menuSelect === "Add a department") {
        addDepartment();
      }
      if (menuSelect === "Delete something") {
        toDelete();
      }
      if (menuSelect === "Quit") {
        console.log("Please start app again to use.");
      }
    });
};

// show data for each menu selection

// options to VIEW
viewRoles = () => {
  console.log("List of Employee Roles");
  const query = `SELECT roles.*, departments.name AS department
                 FROM roles
                 LEFT JOIN departments ON roles.department_id = departments.id`;
  db.query(query, (err, res) => {
    console.table(res);
    promptUser();
  });
};

viewEmployees = () => {
  console.log("List of Current Employees");
  const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, roles.salary AS salary, roles.department_id, employees.manager_id
                 FROM employees
                 LEFT JOIN roles ON employees.role_id = roles.id`;
  db.query(query, (err, res) => {
    console.table(res);
    promptUser();
  });
};

viewDepartments = () => {
  console.log("List of Departments");
  const query = `SELECT * FROM departments`;
  db.query(query, (err, res) => {
    console.table(res);
    promptUser();
  });
};

// options to ADD
addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first",
        message: "Enter employee's first name",
        validate: (addFirst) => {
          if (addFirst) {
            return true;
          } else {
            console.log("Please enter employee's first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "last",
        message: "Enter employee's last name",
        validate: (addLast) => {
          if (addLast) {
            return true;
          } else {
            console.log("Please enter employee's first name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.first, answer.last];

      const getRoles = `SELECT roles.id, roles.title FROM roles`;

      db.query(getRoles, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's job title?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            params.push(role);

            const sqlMan = `SELECT * FROM employees`;

            db.query(sqlMan, (err, data) => {
              if (err) throw err;

              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              managers.push({ name: "None", value: 0 });
              console.log(managers);

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  if (managerChoice.manager !== 0) {
                    const manager = managerChoice.manager;
                    params.push(manager);
                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                     VALUES (?, ?, ?, ?)`;

                    db.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added");
                      viewEmployees();
                    });
                  } else {
                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;

                    db.query(sql, params, (err, res) => {
                      if (err) throw err;
                      console.log("Employee has been added");
                      viewEmployees();
                    });
                  }
                });
            });
          });
      });
    });
};

addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role would you like to add?",
        validate: (addRole) => {
          if (addRole) {
            return true;
          } else {
            console.log("Please enter a new role");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this role?",
        validate: (addSalary) => {
          if (addSalary) {
            return true;
          } else {
            console.log("Please enter a salary for this role");
            return false;
          }
        },
      },
    ])
    .then((selection) => {
      const params = [selection.role, selection.salary];
      const sqlRole = `SELECT name, id FROM departments`;

      db.query(sqlRole, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "What department is this role in?",
              choices: dept,
            },
          ])
          .then((deptChoice) => {
            const dept = deptChoice.dept;
            params.push(dept);

            const sql = `INSERT INTO roles (title, salary, department_id)
                         VALUES (?, ?, ?)`;

            db.query(sql, params, (err, res) => {
              if (err) throw err;
              viewRoles();
            });
          });
      });
    });
};

addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDept",
        message: "What department would you like to add?",
        validate: (addDept) => {
          if (addDept) {
            return true;
          } else {
            console.log("Please enter a new department name");
            return false;
          }
        },
      },
    ])
    .then((selection) => {
      const sql = `INSERT INTO departments (name)
                     VALUES (?)`;

      db.query(sql, selection.newDept, (err, res) => {
        if (err) throw err;
        console.log("Added " + selection.newDept + "to departments list");

        viewDepartments();
      });
    });
};

// options to UPDATE
updateRole = () => {
  const getEmployeeSql = `SELECT * from employees`;
  db.query(getEmployeeSql, (err, result) => {
    if (err) throw err;
    const employees = result.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee's role would you like to update?",
          choices: employees,
        },
      ])
      .then((choice) => {
        const employee = choice.name;
        var params = [employee];

        const getRoleSql = `SELECT * FROM roles`;
        db.query(getRoleSql, (err, result) => {
          if (err) throw err;
          const roles = result.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's new role?",
                choices: roles,
              },
            ])
            .then((choice) => {
              const role = choice.role;
              params.push(role);
              params = params.reverse();
              const updateSql = "UPDATE employees SET role_id = ? WHERE id = ?";
              db.query(updateSql, params, (err, res) => {
                if (err) throw err;
                console.log("Employee role updated");
                viewEmployees();
              });
            });
        });
      });
  });
};

// option to DELETE
toDelete = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "toDelete",
        message: "Which category would you like to delete from?",
        choices: ["Departments", "Employees", "Roles"],
      },
    ])
    .then((choice) => {
      if (choice.toDelete === "Employees") {
        db.query(`SELECT * FROM employees`, (err, res) => {
          console.table(res);

          inquirer
            .prompt([
              {
                type: "number",
                name: "choiceID",
                message:
                  "Which employee would you like to delete? Enter ID number.",
                validate: (addChoiceID) => {
                  if (addChoiceID) {
                    return true;
                  } else {
                    console.log("Please enter department ID number");
                    return false;
                  }
                },
              },
            ])
            .then((answer) => {
              const sqlDel = `DELETE FROM employees WHERE id = ?`;
              db.query(sqlDel, answer.choiceID, (err, res) => {
                if (err) throw err;
                console.log("Deleted employee");
                viewEmployees();
              });
            });
        });
      }

      if (choice.toDelete === "Departments") {
        db.query(`SELECT * FROM departments`, (err, res) => {
          console.table(res);

          inquirer
            .prompt([
              {
                type: "number",
                name: "choiceID",
                message:
                  "Which department would you like to delete? Enter ID Number.",
                validate: (addChoiceID) => {
                  if (addChoiceID) {
                    return true;
                  } else {
                    console.log("Please enter department ID number");
                    return false;
                  }
                },
              },
            ])
            .then((answer) => {
              const sqlDel = `DELETE FROM departments WHERE id = ?`;
              db.query(sqlDel, answer.choiceID, (err, res) => {
                if (err) throw err;
                console.log("Deleted department");
                viewDepartments();
              });
            });
        });
      }
    });
};

// toDelete = () => {
//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "toDelete",
//         message: "Which category would you like to delete from?",
//         choices: ["Departments", "Employees", "Roles"],
//       },
//     ])
//     .then((choice) => {
//       if (choice.toDelete === "Departments") {
//         const query = `SELECT * FROM departments`;
//         db.query(query, (err, res) => {
//           if (err) throw err;
//           const depts = res.map(({ name, index }) => ({
//             name: name,
//             value: index,
//           }));

//           inquirer
//             .prompt([
//               {
//                 type: "list",
//                 name: "nextOpt",
//                 message: "Choose a department to delete",
//                 choices: depts,
//               },
//             ])
//             .then((res) => {
//               const sql = `DELETE FROM departments WHERE id = ?`;
//               const params = [req.params.deptChoice];
//               // const dept = choice.department;
//               // var params = [dept.id];
//               // params.push(dept);

//               db.query(sql, params, (err, result) => {
//                 if (err) throw err;
//                 console.log("Deleted");
//                 viewDepartments();
//               });
//             });
//         });
//       }
//     });
// };
