// authDummy.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// Dummy database
let users = [];

// Secret key (store in env in real apps)
const SECRET = "mysecretkey";

// ================= REGISTER =================
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = { id: Date.now(), username, password: hashedPassword };
    users.push(newUser);

    res.json({ message: "User registered successfully" });
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET,
        { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
});

// ================= AUTH MIDDLEWARE =================
function authMiddleware(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

// ================= PROTECTED ROUTE =================
app.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Protected data",
        user: req.user
    });
});

// ================= LOGOUT (CLIENT SIDE) =================
// Usually handled by deleting token on frontend

// ================= START SERVER =================
app.listen(3000, () => {
    console.log("Server running on port 3000");
});