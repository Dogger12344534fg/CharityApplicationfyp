// dummy.js

// Simple variables
let name = "Dipendra";
let age = 21;

// Function
function greet(user) {
    return `Hello, ${user}! Welcome to the dummy JS file.`;
}

// Arrow function
const add = (a, b) => a + b;

// Object
const person = {
    name: name,
    age: age,
    isStudent: true
};

// Array
const numbers = [1, 2, 3, 4, 5];

// Loop
numbers.forEach(num => {
    console.log(`Number: ${num}`);
});

// Function calls
console.log(greet(name));
console.log("Sum:", add(5, 10));
console.log("Person Object:", person);

// Conditional
if (age > 18) {
    console.log("Adult");
} else {
    console.log("Minor");
}