// user-management.js

class User {
  constructor(id, name, role) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}

class UserManager {
  constructor() {
    this.users = [];
  }

  addUser(name, role) {
    const id = this.users.length + 1;
    const user = new User(id, name, role);
    this.users.push(user);
    console.log("User added:", user);
  }

  removeUser(id) {
    this.users = this.users.filter(user => user.id !== id);
    console.log(`User with id ${id} removed`);
  }

  listUsers() {
    console.log("\n=== Users ===");
    this.users.forEach(user => {
      console.log(`${user.id} | ${user.name} | ${user.role} | Active: ${user.isActive}`);
    });
  }

  deactivateUser(id) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.deactivate();
      console.log(`User ${user.name} deactivated`);
    }
  }
}

// Simulation
const manager = new UserManager();
manager.addUser("Dipendra", "Admin");
manager.addUser("Suraj", "BA");
manager.addUser("Shubham", "Frontend");

manager.listUsers();
manager.deactivateUser(2);
manager.removeUser(1);
manager.listUsers();