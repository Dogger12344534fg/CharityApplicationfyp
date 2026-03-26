// dummy-app.js

// Simple user data
const users = [
  { id: 1, name: "Dipendra", role: "Admin" },
  { id: 2, name: "Suraj", role: "Business Analyst" },
  { id: 3, name: "Shubham", role: "Frontend Dev" },
];

// Function to display users
function displayUsers() {
  console.log("=== User List ===");
  users.forEach(user => {
    console.log(`${user.id}: ${user.name} (${user.role})`);
  });
}

// Function to add a new user
function addUser(name, role) {
  const newUser = {
    id: users.length + 1,
    name,
    role,
  };
  users.push(newUser);
  console.log("User added:", newUser);
}

// Function to simulate app start
function startApp() {
  console.log("App started...");
  displayUsers();

  console.log("\nAdding a new user...\n");
  addUser("Atharva", "Backend Dev");

  console.log("\nUpdated User List:\n");
  displayUsers();
}

// Run the app
startApp();