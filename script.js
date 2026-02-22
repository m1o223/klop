const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = admin.firestore();
const JWT_SECRET = "BlueMindSecretKey";

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existingUser = await db.collection("users")
      .where("email", "==", email)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRef = await db.collection("users").add({
      email,
      name,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const token = jwt.sign(
      { userId: userRef.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token });

  } catch (error) {
    res.status(500).json({ error: "Register failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSnapshot = await db.collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: userDoc.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};