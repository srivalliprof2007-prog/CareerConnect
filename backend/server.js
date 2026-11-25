require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Job = require("./models/Job");
const Application = require("./models/Application");
const User = require("./models/User");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const app = express();
const uploadDir = path.join(__dirname, "uploads", "resumes");

fs.mkdirSync(uploadDir, { recursive: true });


const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  },

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
app.post("/api/applications", async (req, res) => {
  try {
    const { jobId, jobTitle, company, applicantName, applicantEmail } = req.body;

    if (!jobId || !jobTitle || !company || !applicantName || !applicantEmail) {
      return res.status(400).json({
        message: "All application details are required."
      });
    }

    const email = applicantEmail.trim().toLowerCase();

    const existingApplication = await Application.findOne({
      jobId,
      applicantEmail: { $regex: new RegExp("^" + email + "$", "i") }
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job."
      });
    }

    const item = await Application.create({
      jobId,
      jobTitle,
      company,
      applicantName,
      applicantEmail: email
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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


// STUDENT PROFILE - GET
app.get("/api/profile/:email", async (req, res) => {
  try {
    const email = req.params.email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// STUDENT PROFILE - SAVE OR UPDATE
app.put("/api/profile", async (req, res) => {
  try {
    const profile = req.body;

    if (!profile.name?.trim() || !profile.email?.trim()) {
      return res.status(400).json({
        message: "Name and email are required."
      });
    }

    const email = profile.email.trim().toLowerCase();

    const savedUser = await User.findOneAndUpdate(
      { email },
      {
        name: profile.name.trim(),
        email,
        phone: profile.phone || "",
        college: profile.college || "",
        skills: profile.skills || "",
        preferredCategory:
          profile.preferredCategory || "All categories",
        preferredLocation: profile.preferredLocation || "",
        preferredType: profile.preferredType || "All types"
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      message: "Profile saved successfully!",
      user: savedUser
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// RESUME UPLOAD
app.post("/api/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a resume."
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        resource_type: "raw",
        type: "authenticated",
        folder: "careerconnect/resumes",
        public_id: `${Date.now()}-${path.parse(req.file.originalname).name}`
      }
    );

    res.status(200).json({
      message: "Resume uploaded successfully!",
      filename: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error("Resume upload error:", error);

    res.status(500).json({
      message: "Resume upload failed.",
      error: error.message
    });
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
