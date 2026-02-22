// controllers/authController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { admin, db } = require("../firebase");

const JWT_SECRET = "BlueMindSecretKey"; // لاحقاً نخليه في .env

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Check if user exists
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!userSnapshot.empty) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await db.collection("users").add({
      email,
      name: name || "",
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Compare password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: userDoc.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};