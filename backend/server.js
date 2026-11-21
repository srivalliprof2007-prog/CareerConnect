require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Job = require("./models/Job");
const Application = require("./models/Application");
const app = express();
const uploadDir = path.join(__dirname, "uploads", "resumes");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC and DOCX files are allowed."));
    }
  }
});
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/",(req,res)=>res.send("CareerConnect Backend is Running!"));
app.get("/api/jobs",async(req,res)=>{
  try { if(mongoose.connection.readyState!==1) return res.json([]);
    const jobs=await Job.find().sort({createdAt:-1}); res.json(jobs);
  } catch(error){res.status(500).json({message:error.message});}
});
app.post("/api/jobs",async(req,res)=>{
  try { const job=await Job.create(req.body); res.status(201).json(job); }
  catch(error){res.status(400).json({message:error.message});}
  
});
app.get("/api/applications",async(req,res)=>{
  try { const items=await Application.find().sort({createdAt:-1});res.json(items); }
  catch(error){res.status(500).json({message:error.message});}
});
app.post("/api/applications",async(req,res)=>{
  try { 
    console.log("APPLICATION DATA RECEIVED:", req.body);
    const item=await Application.create(req.body);res.status(201).json(item); }
  catch(error){res.status(400).json({message:error.message});}
});

// UPDATE JOB
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      message: "Job updated successfully!",
      job: updatedJob
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE JOB
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      message: "Job deleted successfully!"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// RESUME UPLOAD
app.post("/api/upload-resume", upload.single("resume"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a resume."
      });
    }

    res.status(200).json({
      message: "Resume uploaded successfully!",
      filename: req.file.filename,
      fileUrl: `/uploads/resumes/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.error("MongoDB connection error:", err.message));
} else {
  console.log("MONGO_URI not set. Add it in backend/.env");
}

app.listen(PORT, () => {
  console.log(`CareerConnect server running on port ${PORT}`);
});
