const inquirer = require("inquirer");
const db = require("./db/connection");

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});
// Start app & presented with:
// view all dept, view all employees, view all roles,
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
viewEmployees = () => {
  console.log("List of Current Employees");
  const query = `SELECT * FROM employees`;
  db.query(query, (err, res) => {
    console.table(res);
    promptUser();
  });
};

addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter employee's last name:",
      },
      {
        type: "list",
        name: "department",
        message: "Which department do they work for?",
        choices: ["Design", "Marketing", "Finance"],
      },
    ])
    .then((res) => {
      const query = `INSERT INTO employee (first_name, last_name, role_id)`;
      db.query(query, (err, res) => {
        console.log("Employee added!");
        promptUser();
      });
    });
};

viewRoles = () => {
  console.log("List of Employee Roles");
  const query = `SELECT * FROM roles`;
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
