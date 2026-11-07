require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "development-only-change-me";
const DB_PATH = path.join(__dirname, "data", "db.json");

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "2mb" }));
app.use("/api/", rateLimit({ windowMs: 60 * 1000, limit: 90 }));
app.use(express.static(path.join(__dirname, "public")));

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, "utf8")); }
  catch {
    const initial = { users: [], progress: { completedLessons: [], completedProjects: [], streak: 4 }, activity: [] };
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
}
function writeDB(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
const courses = [
  { id:"html", title:"HTML Foundations", category:"Frontend", level:"Beginner", lessons:4, duration:"1h 04m", progress:0, color:"mint", icon:"code", description:"Build page structure, links, lists, images, and forms." },
  { id:"css", title:"CSS & Modern Layouts", category:"Frontend", level:"Beginner", lessons:4, duration:"1h 06m", progress:0, color:"violet", icon:"palette", description:"Style pages, understand layout, and adapt to mobile screens." },
  { id:"js", title:"JavaScript Essentials", category:"Programming", level:"Beginner", lessons:4, duration:"1h 16m", progress:0, color:"amber", icon:"braces", description:"Use variables, functions, arrays, and browser events." },
  { id:"python", title:"Python for Problem Solving", category:"Programming", level:"Beginner", lessons:4, duration:"1h 12m", progress:0, color:"blue", icon:"terminal", description:"Learn Python values, control flow, functions, and data." }
];
const lessons = [
  { id:"html-1", course:"html", title:"Build your first HTML page", duration:"12 min", type:"lesson" },
  { id:"html-2", course:"html", title:"Headings and paragraphs", duration:"14 min", type:"lesson" },
  { id:"html-3", course:"html", title:"Links, images, and lists", duration:"18 min", type:"lesson" },
  { id:"html-4", course:"html", title:"Create a simple form", duration:"20 min", type:"lesson" },
  { id:"css-1", course:"css", title:"CSS rules and selectors", duration:"14 min", type:"lesson" },
  { id:"css-2", course:"css", title:"The box model and spacing", duration:"16 min", type:"lesson" },
  { id:"css-3", course:"css", title:"Build a layout with Flexbox", duration:"18 min", type:"lesson" },
  { id:"css-4", course:"css", title:"Make a page responsive", duration:"18 min", type:"lesson" },
  { id:"js-1", course:"js", title:"Variables and values", duration:"16 min", type:"lesson" },
  { id:"js-2", course:"js", title:"Make decisions with conditions", duration:"18 min", type:"lesson" },
  { id:"js-3", course:"js", title:"Arrays and loops", duration:"20 min", type:"lesson" },
  { id:"js-4", course:"js", title:"Respond to a button click", duration:"22 min", type:"lesson" },
  { id:"python-1", course:"python", title:"Python values and variables", duration:"16 min", type:"lesson" },
  { id:"python-2", course:"python", title:"Conditions and loops", duration:"18 min", type:"lesson" },
  { id:"python-3", course:"python", title:"Write reusable functions", duration:"18 min", type:"lesson" },
  { id:"python-4", course:"python", title:"Lists and dictionaries", duration:"20 min", type:"lesson" }
];
const projects = [
  { id:"p1", title:"Personal portfolio", track:"HTML + CSS", difficulty:"Beginner", status:"In progress", description:"Build a responsive portfolio with an about section, projects and contact form." },
  { id:"p2", title:"Interactive quiz app", track:"JavaScript", difficulty:"Intermediate", status:"Not started", description:"Create a quiz with scoring, feedback and a restart flow." },
  { id:"p3", title:"Weather dashboard", track:"JavaScript + APIs", difficulty:"Intermediate", status:"Not started", description:"Fetch and display weather data with loading and error states." }
];

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Sign in required." });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: "Session expired. Please sign in again." }); }
}
function safeUser(user) { return { id: user.id, name: user.name, email: user.email, role: user.role || "learner" }; }

app.get("/api/health", (_req, res) => res.json({ ok:true, app:"SkillPath AI", aiConfigured:Boolean(process.env.OPENAI_API_KEY) }));
app.get("/api/courses", (_req, res) => res.json({ courses, lessons }));
app.get("/api/dashboard", (_req, res) => {
  const db = readDB();
  res.json({
    learner: { name:"Alex Morgan", level:"Beginner", goal:"Become a Full Stack Developer" },
    stats: { learningHours: 18.5, lessonsCompleted: db.progress.completedLessons.length, currentStreak: db.progress.streak || 4, skillsInProgress: 4 },
    progress: db.progress,
    courses,
    nextLesson: lessons.find(l => !db.progress.completedLessons.includes(l.id)) || lessons[0],
    activity: db.activity.slice(-6).reverse()
  });
});
app.post("/api/progress/lesson", (req, res) => {
  const { lessonId } = req.body || {};
  if (!lessons.some(l => l.id === lessonId)) return res.status(400).json({ error:"Unknown lesson." });
  const db = readDB();
  if (!db.progress.completedLessons.includes(lessonId)) db.progress.completedLessons.push(lessonId);
  db.activity.push({ id:Date.now(), text:"Completed a lesson", detail:lessons.find(l=>l.id===lessonId).title, date:new Date().toISOString() });
  writeDB(db);
  res.json({ ok:true, progress:db.progress });
});
app.post("/api/progress/project", (req, res) => {
  const { projectId } = req.body || {};
  if (!projects.some(p => p.id === projectId)) return res.status(400).json({ error:"Unknown project." });
  const db = readDB();
  if (!db.progress.completedProjects.includes(projectId)) db.progress.completedProjects.push(projectId);
  writeDB(db);
  res.json({ ok:true, progress:db.progress });
});
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password || password.length < 8) return res.status(400).json({ error:"Name, email and a password of at least 8 characters are required." });
  const db = readDB();
  if (db.users.some(u => u.email.toLowerCase() === String(email).toLowerCase())) return res.status(409).json({ error:"An account with this email already exists." });
  const user = { id:Date.now().toString(), name:String(name).trim(), email:String(email).toLowerCase(), password:await bcrypt.hash(password, 12), role:"learner" };
  db.users.push(user); writeDB(db);
  const token = jwt.sign({ id:user.id, email:user.email, role:user.role }, JWT_SECRET, { expiresIn:"7d" });
  res.status(201).json({ token, user:safeUser(user) });
});
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const db = readDB();
  const user = db.users.find(u => u.email === String(email || "").toLowerCase());
  if (!user || !await bcrypt.compare(password || "", user.password)) return res.status(401).json({ error:"Email or password is incorrect." });
  const token = jwt.sign({ id:user.id, email:user.email, role:user.role }, JWT_SECRET, { expiresIn:"7d" });
  res.json({ token, user:safeUser(user) });
});
app.get("/api/auth/me", auth, (req, res) => {
  const user = readDB().users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error:"Account not found." });
  res.json({ user:safeUser(user) });
});
app.get("/api/admin/overview", auth, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error:"Admin access required." });
  const db = readDB();
  res.json({ users:db.users.length, courses:courses.length, lessons:lessons.length, recentActivity:db.activity.slice(-10).reverse() });
});

const fallbackTutor = (message) => {
  const q = message.toLowerCase();
  if (q.includes("html")) return "HTML defines the structure of a web page. Start with <!doctype html>, then <html>, <head> for page information, and <body> for visible content. Try creating a page with one h1, one paragraph and one link. Would you like a small exercise?";
  if (q.includes("css")) return "CSS controls how HTML looks. A rule has a selector and declarations: `p { color: teal; }`. Learn the box model, selectors, Flexbox and Grid in that order. Try changing a paragraph's color and spacing.";
  if (q.includes("javascript") || q.includes(" js")) return "JavaScript adds behavior to a page. Start with variables (`const` and `let`), data types, conditions, loops, functions and DOM events. A good first exercise is a button that changes a heading when clicked.";
  if (q.includes("python")) return "Python is a readable general-purpose language. Begin with variables, strings, numbers, conditions, loops, functions and lists. Try writing a function that adds two numbers and returns the result.";
  return "Let's break your question into small steps. First, tell me what you already understand and what result you want to achieve. I'll explain the concept, show a short example, then give you a practice task. Remember: learning works best when you try the code yourself.";
};
app.post("/api/ai/tutor", async (req, res) => {
  const { message, history = [] } = req.body || {};
  if (!message || String(message).length > 5000) return res.status(400).json({ error:"Enter a message under 5,000 characters." });
  if (!process.env.OPENAI_API_KEY) return res.json({ reply:fallbackTutor(String(message)), mode:"demo" });
  try {
    const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const response = await fetch(base + "/chat/completions", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":"Bearer " + process.env.OPENAI_API_KEY },
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages:[
          { role:"system", content:"You are SkillPath, a patient expert programming teacher. Teach step by step in clear language. Ask one question at a time when useful. Give accurate code examples, explain why they work, and encourage practice. Do not claim a learner has mastered a topic without evidence." },
          ...history.slice(-8).filter(m => ["user","assistant"].includes(m.role)).map(m=>({role:m.role,content:String(m.content).slice(0,4000)})),
          { role:"user", content:String(message) }
        ],
        temperature:0.6
      })
    });
    if (!response.ok) throw new Error("AI provider returned " + response.status);
    const data = await response.json();
    res.json({ reply:data.choices?.[0]?.message?.content || fallbackTutor(message), mode:"ai" });
  } catch (error) {
    console.error("Tutor error:", error.message);
    res.status(502).json({ error:"The AI tutor could not connect. Check your API settings and try again." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`SkillPath AI running at http://localhost:${PORT}`));
