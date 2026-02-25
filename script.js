// =========================
// IMPORTS
// =========================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import admin from "firebase-admin";

// =========================
// CONFIG
// =========================
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// FIREBASE INIT
// =========================
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

// =========================
// OPENAI INIT
// =========================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =========================
// PLAN LIMITS
// =========================
const PLAN_LIMITS = {
  free: {
    messages: 15,
    images: 3,
    reminders: 5,
  },
  pro: {
    messages: 150,
    images: 20,
    reminders: 40,
  },
  premium: {
    messages: 1000,
    images: 100,
    reminders: 999999,
  },
};

// =========================
// HELPERS
// =========================
function checkLimit(userData, type) {
  const plan = userData.plan || "free";
  const limit = PLAN_LIMITS[plan][type];

  if (!userData.usage) {
    userData.usage = { messages: 0, images: 0, reminders: 0 };
  }

  return userData.usage[type] < limit;
}

async function increaseUsage(userRef, userData, type) {
  userData.usage[type] += 1;
  await userRef.update({ usage: userData.usage });
}

// =========================
// AUTH MIDDLEWARE (اختياري)
// =========================
async function auth(req, res, next) {
  const uid = req.headers["uid"];
  if (!uid) return res.status(401).json({ error: "No UID provided" });

  req.uid = uid;
  next();
}

// =========================
// CREATE USER
// =========================
app.post("/api/user/create", async (req, res) => {
  const { uid, email } = req.body;

  await db.collection("users").doc(uid).set({
    email,
    plan: "free",
    usage: { messages: 0, images: 0, reminders: 0 },
    createdAt: new Date(),
  });

  res.json({ success: true });
});

// =========================
// CHAT AI
// =========================
app.post("/api/chat", auth, async (req, res) => {
  const { message } = req.body;
  const uid = req.uid;

  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data();

  if (!checkLimit(userData, "messages")) {
    return res.status(403).json({ error: "Message limit reached" });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  });

  const reply = completion.choices[0].message.content;

  await increaseUsage(userRef, userData, "messages");

  res.json({ reply });
});

// =========================
// IMAGE GENERATION
// =========================
app.post("/api/image", auth, async (req, res) => {
  const { prompt } = req.body;
  const uid = req.uid;

  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data();

  if (!checkLimit(userData, "images")) {
    return res.status(403).json({ error: "Image limit reached" });
  }

  const image = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  await increaseUsage(userRef, userData, "images");

  res.json({ image: image.data[0].url });
});

// =========================
// REMINDERS
// =========================
app.post("/api/reminder/create", auth, async (req, res) => {
  const { text, time } = req.body;
  const uid = req.uid;

  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data();

  if (!checkLimit(userData, "reminders")) {
    return res.status(403).json({ error: "Reminder limit reached" });
  }

  await db.collection("reminders").add({
    uid,
    text,
    time,
    createdAt: new Date(),
  });

  await increaseUsage(userRef, userData, "reminders");

  res.json({ success: true });
});

// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});