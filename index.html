// controllers/reminderController.js (متحكم_التذكيرات)
const { db } = require("../firebaseAdmin"); // (قاعدة_البيانات) عدّل المسار إذا ملفك اسمه مختلف

// مساعد بسيط للتحقق من تاريخ ISO
function isValidISODate(value) {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

/**
 * ✅ POST /api/reminders
 * body: { title, description?, date, time?, timezone? }
 */
const createReminder = async (req, res) => {
  try {
    const userId = req.user?.uid;

    const { title, description = "", date, time = "", timezone = "UTC" } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ error: "Title is required (min 2 chars)" });
    }

    if (!date || typeof date !== "string" || !isValidISODate(date)) {
      return res.status(400).json({ error: "Valid date (ISO) is required" });
    }

    const reminderData = {
      userId,
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      date, // ISO string
      time: typeof time === "string" ? time.trim() : "", // optional
      timezone: typeof timezone === "string" ? timezone.trim() : "UTC",
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("reminders").add(reminderData);

    return res.status(201).json({
      message: "Reminder created successfully",
      id: docRef.id,
      reminder: reminderData,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ GET /api/reminders
 */
const getReminders = async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const snap = await db
      .collection("reminders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const reminders = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return res.json({ reminders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ GET /api/reminders/:id
 */
const getReminderById = async (req, res) => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!id) return res.status(400).json({ error: "Missing reminder id" });

    const docRef = db.collection("reminders").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Reminder not found" });

    const data = doc.data();
    if (data.userId !== userId) return res.status(403).json({ error: "Unauthorized" });

    return res.json({ id: doc.id, ...data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ PUT /api/reminders/:id
 * body: { title?, description?, date?, time?, timezone?, isDone? }
 */
const updateReminder = async (req, res) => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!id) return res.status(400).json({ error: "Missing reminder id" });

    const docRef = db.collection("reminders").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Reminder not found" });

    const existing = doc.data();
    if (existing.userId !== userId) return res.status(403).json({ error: "Unauthorized" });

    const { title, description, date, time, timezone, isDone } = req.body;

    const updates = { updatedAt: new Date().toISOString() };

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 2) {
        return res.status(400).json({ error: "Title must be string (min 2 chars)" });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({ error: "Description must be string" });
      }
      updates.description = description.trim();
    }

    if (date !== undefined) {
      if (typeof date !== "string" || !isValidISODate(date)) {
        return res.status(400).json({ error: "date must be valid ISO string" });
      }
      updates.date = date;
    }

    if (time !== undefined) {
      if (typeof time !== "string") {
        return res.status(400).json({ error: "time must be string" });
      }
      updates.time = time.trim();
    }

    if (timezone !== undefined) {
      if (typeof timezone !== "string") {
        return res.status(400).json({ error: "timezone must be string" });
      }
      updates.timezone = timezone.trim();
    }

    if (isDone !== undefined) {
      if (typeof isDone !== "boolean") {
        return res.status(400).json({ error: "isDone must be boolean" });
      }
      updates.isDone = isDone;
    }

    await docRef.update(updates);

    return res.json({ message: "Reminder updated successfully", id, updates });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ DELETE /api/reminders/:id
 */
const deleteReminder = async (req, res) => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!id) return res.status(400).json({ error: "Missing reminder id" });

    const docRef = db.collection("reminders").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Reminder not found" });

    const data = doc.data();
    if (data.userId !== userId) return res.status(403).json({ error: "Unauthorized" });

    await docRef.delete();

    return res.json({ message: "Reminder deleted successfully", id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
};