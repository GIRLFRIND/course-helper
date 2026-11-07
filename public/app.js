const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const state = {
  page:"overview",
  dashboard:null,
  backendAvailable:null,
  selectedCourseId:"html",
  selectedLessonId:null,
  courses:[
    { id:"html", title:"HTML Foundations", category:"Frontend", level:"Beginner", lessons:4, duration:"1h 04m", progress:0, color:"mint", icon:"code", description:"Build page structure, links, lists, images, and forms." },
    { id:"css", title:"CSS & Modern Layouts", category:"Frontend", level:"Beginner", lessons:4, duration:"1h 06m", progress:0, color:"violet", icon:"palette", description:"Style pages, understand layout, and adapt to mobile screens." },
    { id:"js", title:"JavaScript Essentials", category:"Programming", level:"Beginner", lessons:4, duration:"1h 16m", progress:0, color:"amber", icon:"braces", description:"Use variables, functions, arrays, and browser events." },
    { id:"python", title:"Python for Problem Solving", category:"Programming", level:"Beginner", lessons:4, duration:"1h 12m", progress:0, color:"blue", icon:"terminal", description:"Learn Python values, control flow, functions, and data." }
  ],
  lessons:window.skillPathLessons||[],
  chat:[],
  quizIndex:0,
  quizAnswered:false,
  installPrompt:null
};
const quiz = [
  { q:"Which HTML element represents the main heading?", options:["<head>","<h1>","<title>","<p>"], answer:1, explain:"<h1> is the top-level visible heading. A page should generally have one clear main heading." },
  { q:"Which CSS layout system is designed for rows and columns?", options:["Grid","Float","Inline","Position"], answer:0, explain:"CSS Grid is a two-dimensional layout system for rows and columns." },
  { q:"Which keyword declares a block-scoped variable that can be reassigned?", options:["const","let","static","define"], answer:1, explain:"Use let when the binding needs reassignment. Use const by default when it does not." }
];
async function api(url, options={}) {
  if(state.backendAvailable===false)return localApi(url,options);
  const response = await fetch(url, { headers:{"Content-Type":"application/json",...(options.headers||{})}, ...options });
  const data = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}
const LOCAL_PROGRESS_KEY="skillpath-ai-progress-v1";
function readLocalProgress(){
  try{
    const saved=JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY)||"{}");
    return {
      completedLessons:Array.isArray(saved.completedLessons)?saved.completedLessons:[],
      completedProjects:Array.isArray(saved.completedProjects)?saved.completedProjects:[],
      streak:Number.isFinite(saved.streak)?saved.streak:4,
      activity:Array.isArray(saved.activity)?saved.activity:[]
    };
  }catch(error){
    console.warn("Could not read saved browser progress:",error);
    return {completedLessons:[],completedProjects:[],streak:4,activity:[]};
  }
}
function writeLocalProgress(progress){
  try{localStorage.setItem(LOCAL_PROGRESS_KEY,JSON.stringify(progress))}
  catch(error){console.error("Could not save browser progress:",error);throw new Error("Progress could not be saved in this browser. Check available storage.")}
}
function localTutorReply(message){
  const question=message.toLowerCase();
  if(question.includes("html"))return "HTML gives a web page its structure. Start with <!doctype html>, then add html, head and body elements. Try adding a heading, paragraph and link.";
  if(question.includes("css"))return "CSS controls how a page looks. A rule has a selector and declarations, such as `p { color: teal; }`. Try learning the box model, then Flexbox and Grid.";
  if(question.includes("javascript")||question.includes(" js"))return "JavaScript adds behavior to a page. Start with const and let, conditions, loops and functions. Try making a button update a heading when clicked.";
  if(question.includes("python"))return "Python is a readable general-purpose language. Start with variables, conditions, loops, functions and lists. Try writing a function that adds two numbers.";
  return "Let's break your question into steps. Tell me what you already understand and what you want to build, and I'll explain the idea with a small example and practice task.";
}
async function localApi(url,options={}){
  const method=options.method||"GET";
  if(url==="/api/health")return {ok:true,app:"SkillPath AI",aiConfigured:false,mode:"browser"};
  if(url==="/api/courses")return {courses:state.courses,lessons:state.lessons};
  if(url==="/api/dashboard"){
    const progress=readLocalProgress();
    return {
      learner:{name:"Alex Morgan",level:"Beginner",goal:"Become a Full Stack Developer"},
      stats:{learningHours:18.5,lessonsCompleted:progress.completedLessons.length,currentStreak:progress.streak,skillsInProgress:4},
      progress,
      courses:state.courses,
      nextLesson:state.lessons.find(lesson=>!progress.completedLessons.includes(lesson.id))||state.lessons[0],
      activity:progress.activity.slice(-6).reverse()
    };
  }
  if(url==="/api/progress/project"&&method==="POST"){
    const {projectId}=JSON.parse(options.body||"{}");
    const progress=readLocalProgress();
    if(!progress.completedProjects.includes(projectId))progress.completedProjects.push(projectId);
    writeLocalProgress(progress);
    return {ok:true,progress};
  }
  if(url==="/api/progress/lesson"&&method==="POST"){
    const {lessonId}=JSON.parse(options.body||"{}");
    const lesson=state.lessons.find(item=>item.id===lessonId);
    if(!lesson)throw new Error("Unknown lesson.");
    const progress=readLocalProgress();
    if(!progress.completedLessons.includes(lessonId))progress.completedLessons.push(lessonId);
    progress.activity.push({id:Date.now(),text:"Completed a lesson",detail:lesson.title,date:new Date().toISOString()});
    writeLocalProgress(progress);
    return {ok:true,progress};
  }
  if(url==="/api/ai/tutor"&&method==="POST"){
    const {message}=JSON.parse(options.body||"{}");
    if(!message||message.length>5000)throw new Error("Enter a message under 5,000 characters.");
    return {reply:localTutorReply(message),mode:"demo"};
  }
  throw new Error("This feature is unavailable in browser-only mode.");
}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function iconFor(name){return ({code:"</>",palette:"◈",braces:"{ }",terminal:"⌘"})[name]||"✦"}
function setPage(page){
  state.page=page;
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  $("#pageLabel").textContent=({overview:"Overview",roadmap:"My roadmap",courses:"Explore courses",course:"Course lessons",lesson:"Lesson",practice:"Practice lab",tutor:"AI tutor",projects:"Projects",analytics:"Analytics",profile:"My profile",settings:"Settings"})[page]||"Overview";
  $("#sidebar").classList.remove("open");
  render();
}
function heading(kicker,title,desc,action=""){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`}
function completedLessonIds(){return state.dashboard?.progress?.completedLessons||(state.backendAvailable===false?readLocalProgress().completedLessons:[])}
function courseLessons(courseId){return state.lessons.filter(lesson=>lesson.course===courseId)}
function courseProgress(courseId){
 const lessons=courseLessons(courseId);
 if(!lessons.length)return 0;
 const completed=completedLessonIds();
 return Math.round(lessons.filter(lesson=>completed.includes(lesson.id)).length/lessons.length*100);
}
function courseCard(course){
 const lessons=courseLessons(course.id);
 const progress=courseProgress(course.id);
 return `<article class="course-card"><div class="course-card-top"><div class="course-thumb ${course.color}">${iconFor(course.icon)}</div><span class="pill">${course.level}</span></div><h3>${course.title}</h3><p>${course.description}</p><div class="course-meta">${course.category} · ${lessons.length} lessons · ${course.duration}</div><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div><div class="course-card-bottom"><span>${progress}% complete</span><button data-course="${course.id}">View lessons →</button></div></article>`
}
function renderOverview(){
 const d=state.dashboard||{stats:{learningHours:18.5,lessonsCompleted:0,currentStreak:4,skillsInProgress:4},courses:state.courses,activity:[]};
 const s=d.stats;
 return `${heading("TUESDAY, YOUR LEARNING SPACE","Good morning, Alex <span style='color:#a693ff'>✦</span>","Ready to make today count? A little progress goes a long way.",`<button class="primary-btn" data-page="roadmap">View learning plan ↗</button>`)}
 <section class="hero"><div class="hero-copy"><div class="eyebrow">YOUR JOURNEY STARTS HERE</div><h2>Turn your goals into <span style="color:#b7a8ff">real skills.</span></h2><p>Your personal learning path is ready. Keep building, keep exploring, and let your progress speak for itself.</p><button class="primary-btn" data-page="roadmap">Explore my roadmap <span>→</span></button></div><div class="hero-art">✳</div></section>
 <section class="stats-grid">
 <div class="stat-card"><div class="stat-top">Learning hours <span class="stat-icon">◷</span></div><div class="stat-value">${s.learningHours}<small style="font-size:12px;color:#8f97aa">h</small></div><div class="stat-foot"><span class="positive">↗ 12%</span> vs. last week</div></div>
 <div class="stat-card"><div class="stat-top">Lessons completed <span class="stat-icon">✓</span></div><div class="stat-value">${s.lessonsCompleted}</div><div class="stat-foot">You're building momentum</div></div>
 <div class="stat-card"><div class="stat-top">Day streak <span class="stat-icon">♨</span></div><div class="stat-value">${s.currentStreak}<small style="font-size:12px;color:#8f97aa"> days</small></div><div class="stat-foot"><span class="positive">Great consistency!</span></div></div>
 <div class="stat-card"><div class="stat-top">Skills in progress <span class="stat-icon">✧</span></div><div class="stat-value">${s.skillsInProgress}</div><div class="stat-foot">One step at a time</div></div></section>
 <section class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Continue learning</h3><button data-page="courses">All courses →</button></div><div class="continue-card"><div class="course-thumb mint">‹/›</div><div class="continue-info"><small>FRONTEND DEVELOPMENT</small><strong>HTML Foundations</strong><small>Lesson 9 of 12 · 18 min left</small><div class="progress-track"><div class="progress-fill" style="width:75%"></div></div></div><span class="progress-number">75%</span></div><div style="margin-top:19px"><button class="primary-btn" data-page="courses">Continue course →</button></div></div>
 <div class="panel"><div class="panel-head"><h3>Up next</h3><button data-page="roadmap">Full plan →</button></div><div class="lesson-list">${(state.lessons.slice(0,3).length?state.lessons.slice(0,3):[]).map((l,i)=>`<div class="lesson-row"><span class="lesson-dot">${i+1}</span><div><strong>${l.title}</strong><small>${l.duration}</small></div><button data-lesson="${l.id}">Start →</button></div>`).join("")}</div></div>
 <div class="panel"><div class="panel-head"><h3>Skills overview</h3><button data-page="analytics">Details →</button></div>${[["HTML & Semantics",82],["CSS & Layout",56],["JavaScript",24],["Problem solving",35]].map(([n,v])=>`<div class="skill-row"><div class="skill-label"><span>${n}</span><span>${v}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${v}%"></div></div></div>`).join("")}</div>
 <div class="panel"><div class="panel-head"><h3>Recent activity</h3><span class="muted" style="font-size:10px">Your journey</span></div><div class="activity-list"><div class="activity-item"><span class="activity-icon">✓</span><div><strong>Completed HTML: Forms & inputs</strong><small>Today · 25 minutes</small></div></div><div class="activity-item"><span class="activity-icon">✦</span><div><strong>Reached a 4-day learning streak</strong><small>Yesterday</small></div></div><div class="activity-item"><span class="activity-icon">⌘</span><div><strong>Practiced CSS selectors</strong><small>2 days ago · 15 minutes</small></div></div></div></div></section>`;
}
function renderCourses(){return `${heading("LEARNING LIBRARY","Explore courses","Choose a course to open its lessons, examples, and practice activities.")}<div class="course-grid">${state.courses.map(courseCard).join("")}</div>`}
function renderCourse(){
 const course=state.courses.find(item=>item.id===state.selectedCourseId);
 if(!course)return renderCourses();
 const lessons=courseLessons(course.id);
 const completed=completedLessonIds();
 return `${heading(course.category.toUpperCase(),course.title,course.description,`<button class="secondary-btn" data-page="courses">← All courses</button>`)}
 <div class="lesson-course-summary"><div><strong>${lessons.length} short lessons</strong><span>Read an explanation, study an example, then try it yourself.</span></div><div class="lesson-course-progress">${lessons.filter(lesson=>completed.includes(lesson.id)).length} of ${lessons.length} complete</div></div>
 <div class="lesson-catalog">${lessons.map((lesson,index)=>`<article class="lesson-catalog-item"><span class="lesson-catalog-number">${completed.includes(lesson.id)?"✓":String(index+1).padStart(2,"0")}</span><div class="lesson-catalog-copy"><h2>${lesson.title}</h2><p>${lesson.summary}</p><small>${lesson.duration}</small></div><button class="primary-btn" data-lesson="${lesson.id}">${completed.includes(lesson.id)?"Review lesson":"Start lesson"} →</button></article>`).join("")}</div>`
}
function renderLesson(){
 const course=state.courses.find(item=>item.id===state.selectedCourseId);
 const lessons=courseLessons(state.selectedCourseId);
 const lesson=lessons.find(item=>item.id===state.selectedLessonId);
 if(!course||!lesson)return renderCourse();
 const lessonIndex=lessons.indexOf(lesson);
 const completed=completedLessonIds().includes(lesson.id);
 const sectionMarkup=lesson.sections.map(section=>`<section class="lesson-section"><h2>${section.heading}</h2><p>${escapeHTML(section.text)}</p>${section.example?`<pre class="lesson-code"><code>${escapeHTML(section.example)}</code></pre>`:""}</section>`).join("");
 return `${heading(course.title.toUpperCase(),lesson.title,lesson.summary,`<button class="secondary-btn" data-page="course">← Lesson list</button>`)}
 <div class="lesson-reader-layout"><article class="lesson-reader">
  <div class="lesson-reading-meta"><span>${lesson.duration} read</span><span>Lesson ${lessonIndex+1} of ${lessons.length}</span></div>
  ${sectionMarkup}
  <section class="lesson-practice"><span class="eyebrow">YOUR TURN</span><h2>Practice this idea</h2><p>${escapeHTML(lesson.task)}</p></section>
  <div class="lesson-completion">${completed?'<span class="pill">Completed ✓</span>':`<button class="primary-btn" id="completeLesson">Mark lesson complete ✓</button>`}<div class="lesson-pager">${lessonIndex>0?`<button class="secondary-btn" data-lesson="${lessons[lessonIndex-1].id}">← Previous</button>`:""}${lessonIndex<lessons.length-1?`<button class="primary-btn" data-lesson="${lessons[lessonIndex+1].id}">Next lesson →</button>`:`<button class="primary-btn" data-page="courses">Finish course →</button>`}</div></div>
 </article><aside class="lesson-toc"><h2>In this course</h2>${lessons.map((item,index)=>`<button class="lesson-toc-item ${item.id===lesson.id?"active":""}" data-lesson="${item.id}"><span>${completedLessonIds().includes(item.id)?"✓":String(index+1).padStart(2,"0")}</span>${item.title}</button>`).join("")}</aside></div>`
}
function renderRoadmap(){const steps=[["01","Web foundations","Understand how the web works, HTML structure and semantic elements.","HTML · 2 weeks",true],["02","Modern CSS","Build responsive layouts with Flexbox, Grid and design systems.","CSS · 3 weeks",false],["03","JavaScript fundamentals","Learn logic, functions, arrays, objects and browser events.","JavaScript · 4 weeks",false],["04","Frontend projects","Build real interfaces and connect to public APIs.","Projects · 3 weeks",false],["05","Backend development","Learn Node.js, APIs, databases and authentication.","Backend · 5 weeks",false],["06","Full stack portfolio","Ship a complete project and prepare for interviews.","Career prep · 3 weeks",false]];
 return `${heading("YOUR PERSONAL PLAN","Full Stack Developer roadmap","A guided path from fundamentals to building and shipping real applications.")}<div class="roadmap"><div class="roadmap-list">${steps.map(([n,t,d,m,done])=>`<article class="roadmap-step ${done?"done":""}"><div class="step-number">${done?"✓":n}</div><div><h3>${t}</h3><p>${d}</p><small>${m} · ${done?"IN PROGRESS":"UPCOMING"}</small></div></article>`).join("")}</div><aside class="side-note"><div class="eyebrow">YOUR GOAL</div><h3>Become a Full Stack Developer</h3><p>This roadmap is a suggested learning sequence. Adjust the pace to fit your schedule and practice each concept by building something small.</p><div class="progress-track"><div class="progress-fill" style="width:18%"></div></div><p><strong style="color:#dcd7ff">18% journey progress</strong></p><button class="primary-btn" data-page="tutor">Ask AI to personalize ↗</button></aside></div>`}
function renderPractice(){const q=quiz[state.quizIndex];return `${heading("TEST YOUR KNOWLEDGE","Practice lab","Quick challenges help turn concepts into skills.")}<div class="panel" style="max-width:720px"><div class="panel-head"><h3>Web development fundamentals</h3><span class="pill">Question ${state.quizIndex+1} of ${quiz.length}</span></div><div class="progress-track"><div class="progress-fill" style="width:${(state.quizIndex+1)/quiz.length*100}%"></div></div><h2 style="font:700 19px Manrope;margin:24px 0 8px">${q.q}</h2><div class="quiz-options">${q.options.map((o,i)=>`<button class="quiz-option" data-answer="${i}">${String.fromCharCode(65+i)}. &nbsp;${o.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</button>`).join("")}</div><div id="quizFeedback"></div><div style="display:flex;justify-content:space-between;margin-top:18px"><button class="secondary-btn" data-quiz="reset">Restart quiz</button><button class="primary-btn" id="nextQuestion" disabled>Next question →</button></div></div>`}
function renderTutor(){return `${heading("YOUR AI LEARNING COMPANION","Meet your AI tutor","Ask questions, get clear explanations, and practice at your own pace.",`<span class="pill">✦ ${window.aiConfigured?"AI connected":"Demo tutor mode"}</span>`)}<div class="panel chat-panel"><div class="chat-messages" id="chatMessages">${state.chat.length?state.chat.map(m=>`<div class="message ${m.role}">${escapeHTML(m.content)}</div>`).join(""):`<div class="message assistant">Hi Alex! 👋 I'm your SkillPath tutor. What are you learning today? Ask me about HTML, CSS, JavaScript, Python, projects or your learning roadmap.</div>`}</div><div class="chat-composer"><textarea id="chatInput" placeholder="Ask me anything about your learning..." rows="1"></textarea><button class="primary-btn" id="sendChat">Send ↑</button></div></div>`}
function isProjectCompleted(projectId){
 const completed=state.dashboard?.progress?.completedProjects||(state.backendAvailable===false?readLocalProgress().completedProjects:[]);
 return completed.includes(projectId);
}
function renderProjects(){return `${heading("LEARN BY BUILDING","Project studio","Apply what you learn. Build a portfolio of real work.")}<div class="project-grid">${[{id:"p1",title:"Personal portfolio",track:"HTML + CSS",difficulty:"Beginner",description:"Build a responsive portfolio with an about section, projects and contact form."},{id:"p2",title:"Interactive quiz app",track:"JavaScript",difficulty:"Intermediate",description:"Create a quiz with scoring, feedback and a restart flow."},{id:"p3",title:"Weather dashboard",track:"JavaScript + APIs",difficulty:"Intermediate",description:"Fetch and display weather data with loading and error states."}].map((p,i)=>`<article class="project-card"><div class="course-card-top"><span class="course-thumb ${["mint","violet","blue"][i]}">${["▧","⌘","◉"][i]}</span><span class="pill">${p.difficulty}</span></div><h3>${p.title}</h3><p>${p.description}</p><div class="course-meta">${p.track}</div><button class="secondary-btn" data-project="${p.id}" ${isProjectCompleted(p.id)?"disabled":""}>${isProjectCompleted(p.id)?"Completed ✓":"Mark as completed ✓"}</button></article>`).join("")}</div>`}
function renderAnalytics(){return `${heading("YOUR GROWTH","Learning analytics","A snapshot of your consistency, focus and learning progress.")}<div class="stats-grid"><div class="stat-card"><div class="stat-top">Total study time</div><div class="stat-value">18.5h</div><div class="stat-foot">Across all courses</div></div><div class="stat-card"><div class="stat-top">Lessons completed</div><div class="stat-value">${state.dashboard?.stats?.lessonsCompleted||0}</div><div class="stat-foot">Keep the momentum</div></div><div class="stat-card"><div class="stat-top">Current streak</div><div class="stat-value">${state.dashboard?.stats?.currentStreak||0} days</div><div class="stat-foot">Consistency matters</div></div><div class="stat-card"><div class="stat-top">Projects</div><div class="stat-value">${state.dashboard?.progress?.completedProjects?.length||0}/3</div><div class="stat-foot">Build your portfolio</div></div></div><div class="panel"><div class="panel-head"><h3>Weekly learning activity</h3><span class="pill">This week</span></div><div style="height:180px;display:flex;align-items:end;gap:14px;padding:15px 10px 0">${[42,70,55,88,64,95,35].map((v,i)=>`<div style="flex:1;text-align:center;height:100%;display:flex;flex-direction:column;justify-content:end;gap:8px"><div style="height:${v}%;background:linear-gradient(180deg,#a28dff,#5b4ca8);border-radius:7px 7px 2px 2px"></div><small class="muted">${["M","T","W","T","F","S","S"][i]}</small></div>`).join("")}</div></div>`}
function renderProfile(){return `${heading("YOUR ACCOUNT","My profile","Your learning identity and personal goals.")}<div class="profile-layout"><div class="panel profile-card"><div class="profile-big">AM</div><h3>Alex Morgan</h3><p>Curious learner · Joined recently</p><span class="pill">Beginner level</span></div><div class="panel"><div class="panel-head"><h3>Learning preferences</h3></div><div class="form-grid"><div class="field"><label>Display name</label><input value="Alex Morgan"></div><div class="field"><label>Email</label><input value="alex@example.com"></div><div class="field full"><label>Learning goal</label><input value="Become a Full Stack Developer"></div><div class="field"><label>Experience level</label><select><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div><div class="field"><label>Daily study target</label><select><option>30 minutes</option><option>1 hour</option><option>2 hours</option></select></div></div><button class="primary-btn" style="margin-top:18px" id="saveProfile">Save changes</button></div></div>`}
function renderSettings(){return `${heading("MAKE IT YOURS","Settings","Control your learning experience and app preferences.")}<div class="panel" style="max-width:760px"><div class="setting-row"><div><strong>Daily learning reminder</strong><small>Get a gentle reminder to keep your streak going.</small></div><input class="toggle" type="checkbox" checked></div><div class="setting-row"><div><strong>Weekly progress summary</strong><small>Review your learning activity every week.</small></div><input class="toggle" type="checkbox" checked></div><div class="setting-row"><div><strong>AI tutor suggestions</strong><small>Show contextual prompts while learning.</small></div><input class="toggle" type="checkbox" checked></div><div class="setting-row"><div><strong>Offline mode</strong><small>Cache the app shell for use without a connection.</small></div><span class="pill" style="color:#7ce0be">Enabled</span></div><div class="setting-row"><div><strong>Data and privacy</strong><small>Your demo learning data is stored locally on this server.</small></div><button class="secondary-btn" id="privacyInfo">Learn more</button></div></div>`}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){const pages={overview:renderOverview,roadmap:renderRoadmap,courses:renderCourses,course:renderCourse,lesson:renderLesson,practice:renderPractice,tutor:renderTutor,projects:renderProjects,analytics:renderAnalytics,profile:renderProfile,settings:renderSettings};$("#content").innerHTML=(pages[state.page]||renderOverview)();bindPageEvents()}
function bindPageEvents(){
 $$("[data-page]").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.page)));
 $$("[data-course]").forEach(b=>b.addEventListener("click",()=>{state.selectedCourseId=b.dataset.course;setPage("course")}));
 $$("[data-lesson]").forEach(b=>b.addEventListener("click",()=>{state.selectedLessonId=b.dataset.lesson;setPage("lesson")}));
 $("#completeLesson")?.addEventListener("click",async()=>{
  const button=$("#completeLesson");
  button.disabled=true;
  try{
   const result=await api("/api/progress/lesson",{method:"POST",body:JSON.stringify({lessonId:state.selectedLessonId})});
   state.dashboard.progress=result.progress;
   state.dashboard.stats.lessonsCompleted=result.progress.completedLessons.length;
   render();
   toast("Lesson completed. Your progress is saved.");
  }catch(error){button.disabled=false;toast(error.message)}
 });
 $$("[data-answer]").forEach(b=>b.addEventListener("click",()=>{if(state.quizAnswered)return;const selected=Number(b.dataset.answer),q=quiz[state.quizIndex];state.quizAnswered=true;$$("[data-answer]").forEach(x=>x.classList.toggle("selected",Number(x.dataset.answer)===selected));$("#quizFeedback").innerHTML=`<div class="feedback">${selected===q.answer?"Correct! ✓":"Not quite — let's learn from it."} ${q.explain}</div>`;$("#nextQuestion").disabled=false}));
 $("#nextQuestion")?.addEventListener("click",()=>{state.quizIndex=(state.quizIndex+1)%quiz.length;state.quizAnswered=false;render()});
 $$("[data-quiz='reset']").forEach(b=>b.addEventListener("click",()=>{state.quizIndex=0;state.quizAnswered=false;render()}));
 $$("[data-project]").forEach(b=>b.addEventListener("click",async()=>{try{const result=await api("/api/progress/project",{method:"POST",body:JSON.stringify({projectId:b.dataset.project})});state.dashboard.progress=result.progress;b.textContent="Completed ✓";b.disabled=true;toast("Project progress saved.")}catch(e){toast(e.message)}}));
 $("#sendChat")?.addEventListener("click",sendChat);
 $("#chatInput")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat()}});
 $("#saveProfile")?.addEventListener("click",()=>toast("Profile preferences saved for this demo."));
 $("#privacyInfo")?.addEventListener("click",()=>toast(state.backendAvailable===false?"Demo progress is stored in this browser on this device.":"Progress is stored by the app server."));
}
async function sendChat(){const input=$("#chatInput"),message=input.value.trim();if(!message)return;state.chat.push({role:"user",content:message});input.value="";render();const messages=$("#chatMessages");messages.scrollTop=messages.scrollHeight;try{const data=await api("/api/ai/tutor",{method:"POST",body:JSON.stringify({message,history:state.chat.slice(-8)})});state.chat.push({role:"assistant",content:data.reply});render();$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight}catch(e){state.chat.push({role:"assistant",content:e.message});render()}}
async function init(){
  try{
    const health=await api("/api/health");
    if(health.ok!==true)throw new Error("Node API is unavailable.");
    state.backendAvailable=true;
    const [dashboard,courseData]=await Promise.all([api("/api/dashboard"),api("/api/courses")]);
    state.dashboard=dashboard;
    state.courses=courseData.courses;
    const availableLessonIds=new Set(courseData.lessons.map(lesson=>lesson.id));
    state.lessons=window.skillPathLessons.filter(lesson=>availableLessonIds.has(lesson.id));
    window.aiConfigured=health.aiConfigured;
  }catch(error){
    state.backendAvailable=false;
    window.aiConfigured=false;
    const [dashboard,courseData]=await Promise.all([api("/api/dashboard"),api("/api/courses")]);
    state.dashboard=dashboard;
    state.courses=courseData.courses;
    const availableLessonIds=new Set(courseData.lessons.map(lesson=>lesson.id));
    state.lessons=window.skillPathLessons.filter(lesson=>availableLessonIds.has(lesson.id));
    console.info("Running in browser-only mode; progress is saved on this device.");
  }
  render();
}
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
const installButton=$("#installButton");
function isInstalled(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true}
function installHelp(){
  const isApple=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  toast(isApple?"In Safari, tap Share, then Add to Home Screen.":"Open your browser menu and choose Install app or Add to Home Screen.");
}
if(isInstalled())installButton.hidden=true;
installButton.addEventListener("click",async()=>{
  if(!state.installPrompt){installHelp();return}
  const promptEvent=state.installPrompt;
  state.installPrompt=null;
  try{
    await promptEvent.prompt();
    const choice=await promptEvent.userChoice;
    if(choice.outcome==="accepted")toast("SkillPath AI is being installed.");
  }catch(error){
    console.error("App installation prompt failed:",error);
    installHelp();
  }
});
window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  state.installPrompt=event;
  installButton.hidden=false;
});
window.addEventListener("appinstalled",()=>{
  state.installPrompt=null;
  installButton.hidden=true;
  toast("SkillPath AI installed successfully.");
});
$("#notifyButton").addEventListener("click",()=>toast("You're all caught up!"));
$("#globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){const q=e.target.value.toLowerCase();const found=state.courses.find(c=>c.title.toLowerCase().includes(q));if(found)setPage("courses");else if(q.includes("quiz")||q.includes("practice"))setPage("practice");else if(q.includes("ai")||q.includes("tutor"))setPage("tutor");else toast("Try searching for a course, quiz or AI tutor.");}});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register(new URL("sw.js",document.baseURI)).catch(error=>console.error("Offline support could not start:",error)));
init();
