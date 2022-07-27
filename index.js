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
// add a dept, add an employee, add a role, update employee role

const promptUser = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menuSelect",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "Add an employee",
          "View all roles",
          "Add a role",
          "Update employee role",
          "View all departments",
          "Add a department",
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
  const query = `SELECT employees.*, roles.title AS title, roles.salary AS salary, roles.department_id
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
// addEmployee = () => {
//     inquirer.promptUser([
//         {
//           type: "input",
//           name: "firstName",
//           message: "Enter employee's first name:",
//           validate: (addFirstName) => {
//               if (addFirstName) {
//                   return true;
//               }
//               else {
//                   console.log("Please enter employee's first name");
//                   return false;
//               }
//           }
//         },
//         {
//           type: "input",
//           name: "lastName",
//           message: "Enter employee's last name:",
//           validate: (addLastName) => {
//             if (addLastName) {
//                 return true;
//             }
//             else {
//                 console.log("Please enter employee's last name");
//                 return false;
//               }
//           },
//         }
//     ])
//     .then((selection) => {
//         const params = [selection.firstName, selection.lastName];
//         const sqlDept = `SELECT name, id FROM departments`;

//         db.query(sqlDept, (err, data) => {
//             if (err) throw err;

//             const dept.map(({ name, id }) => ({ name: name, value: id }));

//             inquirer.prompt([
//                 {
//                     type: "list",
//                     name: "deptId",
//                     message: "What is the department id"
//                 }
//             ])
//         })
//     })
// }

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

// options to UPDATE

//     inquirer
//       .prompt([
//         {
//           type: "input",
//           name: "firstName",
//           message: "Enter employee's first name:",
//         },
//         {
//           type: "input",
//           name: "lastName",
//           message: "Enter employee's last name:",
//         },
//         {
//           type: "list",
//           name: "department",
//           message: "Which department do they work for?",
//           choices: ["Design", "Marketing", "Finance"],
//         },
