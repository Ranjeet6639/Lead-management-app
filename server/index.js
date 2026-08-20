import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnect from "./lib/mongodb.js";
import Lead from "./models/Lead.js";

const app = express();
app.use(cors());
app.use(express.json());

// POST create a new lead
app.post("/api/lead", async (req, res) => {
  try {
    await dbConnect();

    const { name, email } = req.body;

    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    const lead = await Lead.create({ name: name.trim(), email: email.trim().toLowerCase() });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: {
        id: lead._id,
        name: lead.name,
        email: lead.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "A lead with this email already exists" });
    }

    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message || "Validation error";
      return res.status(400).json({ success: false, message: firstError });
    }

    console.error("Error creating lead:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

// GET all leads
app.get("/api/lead", async (req, res) => {
  try {
    await dbConnect();

    const leads = await Lead.find({}).sort({ createdAt: -1 });

    const formatted = leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      email: lead.email,
      createdAt: lead.createdAt,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch leads" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
