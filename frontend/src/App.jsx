
import { useEffect, useMemo, useState } from "react";
import {
  Search, MapPin, BriefcaseBusiness, Bell, FileUp, Menu,
  X, Bookmark, ArrowUpRight, SlidersHorizontal, Plus,
  CheckCircle2, Sparkles, Clock3, Building2, GraduationCap
} from "lucide-react";

const starterJobs = [
  {
    _id: "j1",
    title: "Frontend Developer",
    company: "PixelCraft Studio",
    location: "Hyderabad",
    category: "Development",
    salary: "4–6 LPA",
    jobType: "Full-time",
    level: "Fresher",
    posted: "2 days ago",
    description: "Build responsive interfaces with React, JavaScript and modern CSS. Great opportunity for fresh graduates.",
    skills: ["React", "JavaScript", "CSS"],
    logo: "P",
    tone: "violet"
  },
  {
    _id: "j2",
    title: "Data Analyst Intern",
    company: "InsightLoop",
    location: "Remote",
    category: "Data Analysis",
    salary: "₹15k–20k / month",
    jobType: "Internship",
    level: "Internship",
    posted: "1 day ago",
    description: "Work with real datasets, create dashboards and communicate insights to business teams.",
    skills: ["Python", "SQL", "Power BI"],
    logo: "I",
    tone: "mint"
  },
  {
    _id: "j3",
    title: "Junior UI/UX Designer",
    company: "Northstar Labs",
    location: "Bengaluru",
    category: "Design",
    salary: "3–5 LPA",
    jobType: "Full-time",
    level: "Fresher",
    posted: "3 days ago",
    description: "Create user-friendly product experiences, wireframes and polished visual designs.",
    skills: ["Figma", "Prototyping", "UI Design"],
    logo: "N",
    tone: "peach"
  },
  {
    _id: "j4",
    title: "Node.js Developer",
    company: "CloudSprint Technologies",
    location: "Pune",
    category: "Development",
    salary: "5–7 LPA",
    jobType: "Full-time",
    level: "1–2 years",
    posted: "4 days ago",
    description: "Develop REST APIs and backend services using Node.js, Express and MongoDB.",
    skills: ["Node.js", "Express", "MongoDB"],
    logo: "C",
    tone: "blue"
  },
  {
    _id: "j5",
    title: "Machine Learning Trainee",
    company: "Aster AI",
    location: "Remote",
    category: "AI & ML",
    salary: "₹18k / month",
    jobType: "Internship",
    level: "Internship",
    posted: "5 days ago",
    description: "Support model experiments, data preparation and evaluation with the applied AI team.",
    skills: ["Python", "ML", "NumPy"],
    logo: "A",
    tone: "yellow"
  },
  {
    _id: "j6",
    title: "Business Analyst",
    company: "Vertex Consulting",
    location: "Chennai",
    category: "Data Analysis",
    salary: "4–6 LPA",
    jobType: "Full-time",
    level: "Fresher",
    posted: "1 week ago",
    description: "Translate business requirements into clear reports, metrics and actionable insights.",
    skills: ["Excel", "SQL", "Communication"],
    logo: "V",
    tone: "pink"
  }
];

function JobGrid({ jobs, saved, setSaved, setSelected }) {
  return (
    <div className="job-grid">
      {jobs.map(job => (
        <article className="job-card" key={job._id}>
          <div className="job-card-top">
            <div className={`company-logo ${job.tone || "violet"}`}>
              {job.logo || job.company?.[0] || "C"}
            </div>

            <button
              className={saved.includes(job._id) ? "save-btn saved" : "save-btn"}
              onClick={() =>
                setSaved(s =>
                  s.includes(job._id)
                    ? s.filter(x => x !== job._id)
                    : [...s, job._id]
                )
              }
              aria-label="Save job"
            >
              <Bookmark
                size={18}
                fill={saved.includes(job._id) ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="job-company">{job.company}</div>
          <h3>{job.title}</h3>

          <div className="job-meta">
            <span><MapPin size={14} />{job.location}</span>
            <span><BriefcaseBusiness size={14} />{job.jobType}</span>
          </div>

          <div className="job-tags">
            {(job.skills || []).slice(0, 3).map(s => (
              <span key={s}>{s}</span>
            ))}
          </div>

          <div className="job-card-bottom">
            <div>
              <b>{job.salary || "Salary not specified"}</b>
              <small>{job.posted || "Recently posted"}</small>
            </div>

            <button className="view-btn" onClick={() => setSelected(job)}>
              View details <ArrowUpRight size={15} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Empty({ icon, title, desc }) {
  return (
    <div className="empty-state">
      <div>{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [jobs, setJobs] = useState(starterJobs);
  const [active, setActive] = useState("Find Jobs");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All categories");
  const [type, setType] = useState("All types");
  const [saved, setSaved] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [resume, setResume] = useState("");
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [applications, setApplications] = useState([]);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    category: "Development",
    salary: "",
    jobType: "Full-time",
    description: ""
  });

  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    skills: "",
    preferredCategory: "All categories",
    preferredLocation: "",
    preferredType: "All types"
  });

  const categories = [
    "All categories",
    "Development",
    "Data Analysis",
    "Design",
    "AI & ML"
  ];

 const nav = [
  "Find Jobs",
  "My Applications",
  "Saved Jobs",
  "Job Alerts",
  "Admin Dashboard"
];

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then(response =>
        response.ok ? response.json() : Promise.reject()
      )
      .then(data => {
        if (Array.isArray(data)) {
          const databaseJobs = data.map((job, index) => ({
            ...job,
            logo: (job.company || "C")[0].toUpperCase(),
            tone: ["violet", "mint", "peach", "blue"][index % 4],
            posted: job.posted || "Recently posted",
            skills: job.skills || []
          }));

          setJobs(databaseJobs);
        }
      })
      .catch(error => {
        console.log("Unable to load database jobs:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/applications`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Unable to fetch applications");
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setApplications(data);
        }
      })
      .catch(error => {
        console.log("Unable to load applications:", error);
      });
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem("careerconnectEmail");

    if (!savedEmail) return;

    fetch(`${API_URL}/api/profile/${encodeURIComponent(savedEmail)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Unable to load profile");
        }
        return response.json();
      })
      .then(data => {
        setCandidate(data);
      })
      .catch(error => {
        console.log("Unable to load saved profile:", error);
      });
  }, []);

useEffect(() => {
  const savedEmail = localStorage.getItem("careerconnectEmail");

  if (!savedEmail) return;

  fetch(`${API_URL}/api/profile/${encodeURIComponent(savedEmail)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to load profile");
      }
      return response.json();
    })
    .then(data => {
      setCandidate(data);
    })
    .catch(error => {
      console.log("Unable to load saved profile:", error);
    });
}, []);

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const q = search.toLowerCase();

      return (
        (!q || [
          j.title,
          j.company,
          j.category,
          ...(j.skills || [])
        ].join(" ").toLowerCase().includes(q)) &&
        (!location ||
          (j.location || "").toLowerCase().includes(location.toLowerCase())) &&
        (category === "All categories" || j.category === category) &&
        (type === "All types" || j.jobType === type)
      );
    });
  }, [jobs, search, location, category, type]);

  const savedJobs = jobs.filter(job => saved.includes(job._id));


  const matchingAlerts = jobs.filter(job =>
    (candidate.preferredCategory === "All categories" ||
      job.category === candidate.preferredCategory) &&
    (!candidate.preferredLocation ||
      (job.location || "").toLowerCase().includes(
        candidate.preferredLocation.toLowerCase()
      )) &&
    (candidate.preferredType === "All types" ||
      job.jobType === candidate.preferredType)
  );

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  async function handleResumeUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedExtensions = ["pdf", "doc", "docx"];
    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      notify("Please select a PDF, DOC or DOCX file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify("Resume must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(
        API_URL + "/api/upload-resume",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setResume(file.name);
      notify("Resume uploaded successfully!");
    } catch (error) {
      console.error("Resume upload error:", error);
      notify(error.message || "Unable to upload resume.");
    }
  }

  async function apply(job) {
    if (!candidate.name.trim() || !candidate.email.trim()) {
      setSelected(null);
      setShowProfile(true);
      notify("Please enter your name and email first.");
      return;
    }
    console.log("Selected job:", job.title, job._id);
    console.log("Saved applications:", applications);
    if (applications.some(a => a.jobId === job._id)) {
      return notify("You have already applied for this job.");
    }

    const applicant = {
      jobId: job._id,
      jobTitle: job.title,
      company: job.company,
      applicantName: candidate.name,
      applicantEmail: candidate.email
    };

    try {
      const response = await fetch(
        API_URL + "/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(applicant)
        }
      );

      if (!response.ok) {
        throw new Error("Application submission failed");
      }

      const savedApplication = await response.json();

      setApplications(a => [...a, savedApplication]);
      setSelected(null);
      notify("Application submitted successfully!");
    } catch (error) {
      console.error(error);
      notify("Unable to submit application. Please try again.");
    }
  }

async function postJob(e) {
  e.preventDefault();

  const item = {
    ...form,
    _id: "local-" + Date.now(),
    logo: (form.company || "C")[0].toUpperCase(),
    tone: "violet",
    posted: "Just now",
    level: "Open to applicants",
    skills: []
  };

  try {
    const response = await fetch(
      API_URL + "/api/jobs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      }
    );

    if (response.ok) {
      const savedJob = await response.json();

      Object.assign(item, savedJob, {
        logo: (savedJob.company || "C")[0].toUpperCase(),
        tone: "violet",
        posted: "Just now",
        skills: savedJob.skills || []
      });
    } else {
      notify("Job could not be saved to the database.");
      return;
    }
  } catch (error) {
    console.error(error);
    notify("Unable to connect to the server.");
    return;
  }

const normalize = value =>
  String(value || "").trim().toLowerCase();

const categoryMatches =
  !candidate.preferredCategory ||
  normalize(candidate.preferredCategory) === "all categories" ||
  normalize(item.category) === normalize(candidate.preferredCategory);

const locationMatches =
  !candidate.preferredLocation ||
  normalize(item.location).includes(
    normalize(candidate.preferredLocation)
  );

const typeMatches =
  !candidate.preferredType ||
  normalize(candidate.preferredType) === "all types" ||
  normalize(item.jobType) === normalize(candidate.preferredType);

const jobMatchesPreferences =
  categoryMatches && locationMatches && typeMatches;

  setJobs(j => [item, ...j]);
  setShowPost(false);

  setForm({
    title: "",
    company: "",
    location: "",
    category: "Development",
    salary: "",
    jobType: "Full-time",
    description: ""
  });

  if (jobMatchesPreferences) {
    notify(
      `New Job Alert! ${item.title} at ${item.company} matches your preferences.`
    );
  } else {
    notify("Your job listing has been added.");
  }
}

async function saveProfile(e) {
  e.preventDefault();

  if (!candidate.name.trim() || !candidate.email.trim()) {
    notify("Name and email are required.");
    return;
  }

  try {
    const response = await fetch(API_URL + "/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(candidate)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to save profile.");
    }

  localStorage.setItem("careerconnectEmail", data.user.email);
setCandidate(data.user);
setShowProfile(false);
    notify("Profile saved successfully!");
  } catch (error) {
    console.error("Profile save error:", error);
    notify(error.message || "Unable to save profile.");
  }
}


  return (
    <div className="app-shell">

      <header className="topbar">
        <a
          className="brand"
          href="#"
          onClick={e => {
            e.preventDefault();
            setActive("Find Jobs");
          }}
        >
          <span className="brand-mark">
            <BriefcaseBusiness size={20} />
          </span>
          <span>
            career<span className="brand-accent">connect</span>
          </span>
        </a>

        <nav className="desktop-nav">
          {nav.map(n => (
            <button
              key={n}
              className={active === n ? "nav-link active" : "nav-link"}
              onClick={() => setActive(n)}
            >
              {n}
            </button>
          ))}
        </nav>

        <div className="top-actions">
          <button className="post-btn" onClick={() => setShowPost(true)}>
            <Plus size={17} /> Post a job
          </button>

          <button
            className="icon-btn notification"
            aria-label="Notifications"
            onClick={() => notify("You're all caught up!")}
          >
            <Bell size={19} />
            <i />
          </button>

          <button className="avatar" onClick={() => setShowProfile(true)}>
            S
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu />
          </button>
        </div>
      </header>

      {mobileMenu && (
        <div className="mobile-nav">
          {nav.map(n => (
            <button
              key={n}
              onClick={() => {
                setActive(n);
                setMobileMenu(false);
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      <main>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={14} /> YOUR NEXT CHAPTER STARTS HERE
            </div>

            <h1>
              Find a job that
              <br />
              <span>moves you forward.</span>
            </h1>

            <p>
              Discover opportunities, showcase your skills and take the next
              step in your career — all in one place.
            </p>

            <div className="hero-stats">
              <div>
                <strong>{jobs.length}+</strong>
                <span>Open opportunities</span>
              </div>
              <div>
                <strong>50+</strong>
                <span>Partner companies</span>
              </div>
              <div>
                <strong>Easy</strong>
                <span>One-click applications</span>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />

            <div className="art-card">
              <div className="art-card-top">
                <span className="art-dot" />
                <span className="art-dot" />
                <span className="art-dot" />
              </div>

              <div className="art-person">
                <div className="person-head" />
                <div className="person-body" />
              </div>

              <div className="art-lines">
                <i />
                <i />
                <i />
              </div>

              <div className="art-mini">
                <CheckCircle2 size={16} /> Profile ready
              </div>
            </div>

            <div className="floating-tag tag-one">
              <span className="tag-icon purple">
                <BriefcaseBusiness size={16} />
              </span>
              <span>
                <b>Dream job</b>
                <small>Within reach</small>
              </span>
            </div>

            <div className="floating-tag tag-two">
              <span className="tag-icon green">
                <CheckCircle2 size={16} />
              </span>
              <span>
                <b>Application sent</b>
                <small>You're on your way!</small>
              </span>
            </div>

            <div className="sparkle s1">✦</div>
            <div className="sparkle s2">✧</div>
          </div>
        </section>

        <section className="search-panel">
          <div className="search-field">
            <Search size={20} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Job title, skill or company"
            />
          </div>

          <div className="search-divider" />

          <div className="search-field location-field">
            <MapPin size={20} />
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="City or remote"
            />
          </div>

          <button
            className="search-button"
            onClick={() => setActive("Find Jobs")}
          >
            Search jobs <ArrowUpRight size={17} />
          </button>
        </section>

        <div className="content-layout">

          <aside className="sidebar">
            <div className="side-heading">
              <SlidersHorizontal size={17} /> Filters

              <button
                onClick={() => {
                  setCategory("All categories");
                  setType("All types");
                  setLocation("");
                  setSearch("");
                }}
              >
                Clear
              </button>
            </div>

            <div className="filter-group">
              <h4>Job category</h4>

              {categories.map((c, i) => (
                <button
                  key={c}
                  className={
                    category === c
                      ? "filter-option chosen"
                      : "filter-option"
                  }
                  onClick={() => setCategory(c)}
                >
                  <span className="radio-dot" />
                  {c}
                  <span className="filter-count">
                    {i === 0
                      ? jobs.length
                      : jobs.filter(j => j.category === c).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="filter-group">
              <h4>Employment type</h4>

              {["All types", "Full-time", "Part-time", "Internship", "Contract"].map(t => (
                <button
                  key={t}
                  className={
                    type === t
                      ? "filter-option chosen"
                      : "filter-option"
                  }
                  onClick={() => setType(t)}
                >
                  <span className="radio-dot" />
                  {t}
                </button>
              ))}
            </div>

            <div className="sidebar-tip">
              <div className="tip-icon">
                <Bell size={17} />
              </div>
              <b>Stay in the loop</b>
              <p>
                Get notified when jobs matching your interests are posted.
              </p>
              <button
                onClick={() => {
                  setActive("Job Alerts");
                  setShowProfile(true);
                }}
              >
                Set up job alerts <ArrowUpRight size={14} />
              </button>
            </div>
          </aside>

          <section className="jobs-area">

            <div className="section-heading">
              <div>
                <div className="eyebrow dark-eyebrow">
                  OPPORTUNITIES FOR YOU
                </div>

                <h2>
                  {active === "Find Jobs"
                    ? "Explore open positions"
                    : active}
                </h2>

                <p>
                  {active === "Find Jobs"
                    ? "Find the role where your potential meets opportunity."
                    : active === "My Applications"
                    ? "Keep track of the opportunities you've applied to."
                    : active === "Saved Jobs"
                    ? "Your bookmarked opportunities, all in one place."
                    : "Never miss an opportunity that matches your goals."}
                </p>
              </div>

              <div className="sort-label">
                <span>Sort by</span>
                <select aria-label="Sort jobs">
                  <option>Most relevant</option>
                  <option>Newest first</option>
                </select>
              </div>
            </div>

            {active === "Find Jobs" && (
              filtered.length > 0 ? (
                <JobGrid
                  jobs={filtered}
                  saved={saved}
                  setSaved={setSaved}
                  setSelected={setSelected}
                />
              ) : (
                <Empty
                  icon={<Search size={28} />}
                  title="No jobs found"
                  desc="Try changing your search or filters to find more opportunities."
                />
              )
            )}

            {active === "Saved Jobs" && (
              savedJobs.length > 0 ? (
                <JobGrid
                  jobs={savedJobs}
                  saved={saved}
                  setSaved={setSaved}
                  setSelected={setSelected}
                />
              ) : (
                <Empty
                  icon={<Bookmark size={28} />}
                  title="No saved jobs yet"
                  desc="Bookmark jobs that interest you and they will appear here."
                />
              )
            )}

            {active === "My Applications" && (
              applications.length > 0 ? (
                <div className="application-list">
                  {applications.map((app, index) => (
                    <div className="application-card" key={app._id || index}>
                      <div className="company-logo violet">
                        {(app.company || "C")[0]}
                      </div>

                      <div>
                        <h3>{app.jobTitle}</h3>
                        <p>{app.company}</p>
                        <small>
                          Applicant: {app.applicantName}
                        </small>
                      </div>

                      <span className="application-status">
                        Submitted
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  icon={<FileUp size={28} />}
                  title="No applications yet"
                  desc="Your submitted job applications will appear here."
                />
              )
            )}

            {active === "Job Alerts" && (
              <div className="alert-card">
                <div className="alert-symbol">
                  <Bell />
                </div>

                <div>
                  <h3>Make opportunities come to you</h3>

                  <p>
                    Your current preferences:
                    {" "}{candidate.preferredCategory},
                    {" "}{candidate.preferredLocation || "Any location"},
                    {" "}{candidate.preferredType}
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() => setShowProfile(true)}
                  >
                    Set my preferences
                  </button>

                  <h3>Matching jobs ({matchingAlerts.length})</h3>

                  {matchingAlerts.length > 0 ? (
                    <JobGrid
                      jobs={matchingAlerts}
                      saved={saved}
                      setSaved={setSaved}
                      setSelected={setSelected}
                    />
                  ) : (
                    <p>
                      No matching jobs currently. Try changing your preferences.
                    </p>
                  )}
                </div>
              </div>
            )}
                      {active === "Admin Dashboard" && (
              <div className="admin-dashboard">

                <div className="eyebrow dark-eyebrow">
                  ADMINISTRATION
                </div>

                <h2>Admin Dashboard</h2>

                <p>
                  Manage jobs and monitor candidate applications.
                </p>

                <div className="admin-stats">

                  <div className="admin-stat-card">
                    <BriefcaseBusiness size={25} />
                    <h3>Total Jobs</h3>
                    <strong>{jobs.length}</strong>
                  </div>

                  <div className="admin-stat-card">
                    <FileUp size={25} />
                    <h3>Total Applications</h3>
                    <strong>{applications.length}</strong>
                                  <div className="admin-job-management">

                  <h3>Manage Job Listings</h3>

                  <p>View all jobs available on CareerConnect.</p>

                  <div className="admin-job-list">

                    {jobs.map(job => (
                      <div className="admin-job-row" key={job._id}>

                        <div>
                          <h4>{job.title}</h4>
                          <p>{job.company}</p>
                          <small>
                            {job.location} | {job.jobType}
                          </small>
                        </div>

                        <span className="admin-job-category">
                          {job.category}
                        </span>
                                              { /^[0-9a-fA-F]{24}$/.test(String(job._id)) && (
                          <button
                            className="admin-delete-btn"
                            onClick={() => deleteJob(job._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}

                  </div>

                </div>
                  </div>

                  <div className="admin-stat-card">
                    <Bookmark size={25} />
                    <h3>Saved Jobs</h3>
                    <strong>{saved.length}</strong>
                  </div>

                </div>

              </div>
            )}
          </section>
        </div>
      </main>

      {selected && (
        <div className="modal-backdrop">
          <div className="modal">
            <button
              type="button"
              className="close-btn"
              onClick={() => setSelected(null)}
            >
              <X />
            </button>

            <div className="eyebrow dark-eyebrow">
              JOB DETAILS
            </div>

            <h2>{selected.title}</h2>
            <p>{selected.company}</p>

            <div className="job-meta">
              <span><MapPin size={14} />{selected.location}</span>
              <span><BriefcaseBusiness size={14} />{selected.jobType}</span>
            </div>

            <p><b>Category:</b> {selected.category}</p>
            <p><b>Salary:</b> {selected.salary || "Not specified"}</p>
            <p><b>Experience:</b> {selected.level || "Not specified"}</p>

            <h3>About this role</h3>
            <p>{selected.description}</p>

            <h3>Required skills</h3>
            <div className="job-tags">
              {(selected.skills || []).map(skill => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <button
              className="primary-btn submit-btn"
              onClick={() => apply(selected)}
            >
              Apply for this job <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="modal-backdrop">
          <form className="modal form-modal" onSubmit={saveProfile}>
            <button
              type="button"
              className="close-btn"
              onClick={() => setShowProfile(false)}
            >
              <X />
            </button>

            <div className="eyebrow dark-eyebrow">
              YOUR CAREER PROFILE
            </div>

            <h2>Build your profile</h2>

            <p className="form-intro">
              Help employers understand what makes you a great candidate.
            </p>

            <div className="form-grid">
              <label>
                Full name
                <input
                  value={candidate.name}
                  onChange={e =>
                    setCandidate({ ...candidate, name: e.target.value })
                  }
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={candidate.email}
                  onChange={e =>
                    setCandidate({ ...candidate, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Phone number
                <input
                  value={candidate.phone}
                  onChange={e =>
                    setCandidate({ ...candidate, phone: e.target.value })
                  }
                  placeholder="Mobile number"
                />
              </label>

              <label>
                College / University
                <input
                  value={candidate.college}
                  onChange={e =>
                    setCandidate({ ...candidate, college: e.target.value })
                  }
                  placeholder="Your institution"
                />
              </label>

              <label className="full-field">
                Skills
                <input
                  value={candidate.skills}
                  onChange={e =>
                    setCandidate({ ...candidate, skills: e.target.value })
                  }
                  placeholder="React, Python, SQL..."
                />
              </label>

              <label className="full-field">
                Preferred job category
                <select
                  value={candidate.preferredCategory}
                  onChange={e =>
                    setCandidate({
                      ...candidate,
                      preferredCategory: e.target.value
                    })
                  }
                >
                  {categories.map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="full-field">
                Preferred location
                <input
                  value={candidate.preferredLocation}
                  onChange={e =>
                    setCandidate({
                      ...candidate,
                      preferredLocation: e.target.value
                    })
                  }
                  placeholder="Any location or enter a city"
                />
              </label>

              <label className="full-field">
                Preferred employment type
                <select
                  value={candidate.preferredType}
                  onChange={e =>
                    setCandidate({
                      ...candidate,
                      preferredType: e.target.value
                    })
                  }
                >
                  {["All types", "Full-time", "Part-time", "Internship", "Contract"].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="full-field upload-box">
                <FileUp size={20} />

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />

                <span>
                  {resume || "Upload your resume (PDF or DOC)"}
                </span>
              </label>
            </div>

            <button
              className="primary-btn submit-btn"
              type="submit"
            >
              Save profile <CheckCircle2 size={16} />
            </button>
          </form>
        </div>
      )}

      {showPost && (
        <div className="modal-backdrop">
          <form className="modal form-modal" onSubmit={postJob}>
            <button
              type="button"
              className="close-btn"
              onClick={() => setShowPost(false)}
            >
              <X />
            </button>

            <div className="eyebrow dark-eyebrow">
              RECRUITER PORTAL
            </div>

            <h2>Post a new job</h2>

            <p className="form-intro">
              Share an opportunity with talented candidates.
            </p>

            <div className="form-grid">
              <label>
                Job title
                <input
                  required
                  value={form.title}
                  onChange={e =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Python Developer"
                />
              </label>

              <label>
                Company
                <input
                  required
                  value={form.company}
                  onChange={e =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="Company name"
                />
              </label>

              <label>
                Location
                <input
                  required
                  value={form.location}
                  onChange={e =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="City or Remote"
                />
              </label>

              <label>
                Category
                <select

                  value={form.category}
                  onChange={e =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {categories.slice(1).map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label>
                Salary
                <input
                  value={form.salary}
                  onChange={e =>
                    setForm({ ...form, salary: e.target.value })
                  }
                  placeholder="e.g. 4-6 LPA"
                />
              </label>

              <label>
                Employment type
                <select
                  value={form.jobType}
                  onChange={e =>
                    setForm({ ...form, jobType: e.target.value })
                  }
                >
                  {["Full-time", "Part-time", "Internship", "Contract"].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="full-field">
                Job description
                <textarea
                  required
                  value={form.description}
                  onChange={e =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the job role and responsibilities..."
                />
              </label>
            </div>

            <button
              className="primary-btn submit-btn"
              type="submit"
            >
              Publish job <Plus size={16} />
            </button>
          </form>
        </div>
      )}

      {toast && (
        <div className="toast-message">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

    </div>
  );
}
