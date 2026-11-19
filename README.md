# CareerConnect — Job Alert and Resume Portal

A React + Vite frontend and Express + MongoDB backend starter for the Web Technologies project.

## Features
- Job search by title, skill, company and location
- Category and employment-type filters
- Job detail view and save/bookmark jobs
- Apply flow and My Applications list
- Candidate profile form and resume file selection
- Recruiter job-posting form
- Responsive layout for desktop and mobile
- REST API for jobs and applications

## Requirements
- Node.js (LTS recommended)
- MongoDB Atlas account (optional for the frontend demo)

## Run the frontend
Open a terminal in this folder:
```bash
npm install
npm run dev
```
Open the URL printed by Vite (usually http://localhost:5173).

## Run the backend
Open a second terminal:
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and replace the MongoDB connection string:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```
Then start:
```bash
npm start
```
Backend runs at http://localhost:5000.

## Important project notes
- The frontend includes sample job cards so it can be demonstrated before MongoDB is connected.
- With the backend running and MongoDB connected, newly posted jobs and submitted applications are sent to the API.
- Resume selection currently displays the selected file name in the profile form. Persistent resume storage requires a file-upload endpoint and storage configuration; do not claim that a file has been uploaded to MongoDB yet.
- Candidate profile details are currently held in frontend state; add a User model and authentication before treating profiles as persistent accounts.
- This is a starter project for learning and demonstration. Add authentication, server-side validation, role-based access and secure file storage before production use.
