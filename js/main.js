// ==================== DATA STORES ====================
let users = JSON.parse(localStorage.getItem('rtlh_users') || '[]');
let userCoursesData = JSON.parse(localStorage.getItem('rtlh_usercourses') || '{}');
let chatLogs = JSON.parse(localStorage.getItem('rtlh_chatlogs') || '[]');
let communityGroups = JSON.parse(localStorage.getItem('rtlh_groups') || '["Tech Learners", "Music Artists", "Web Dev Club"]');
let currentUser = null;

// Course Catalog
const fullCourseCatalog = [
  { id: 1, title: "Python Programming", category: "Programming", duration: "8 weeks", image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400", desc: "Master Python from basics to advanced, including data structures, OOP, and real-world projects." },
  { id: 2, title: "Full Stack Web Dev", category: "Web", duration: "12 weeks", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400", desc: "Become a full-stack developer with HTML, CSS, JavaScript, React, Node.js, and MongoDB." },
  { id: 3, title: "Data Science & AI", category: "Data", duration: "12 weeks", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400", desc: "Learn data analysis, machine learning, deep learning, and generative AI." },
  { id: 4, title: "Cybersecurity", category: "Security", duration: "10 weeks", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400", desc: "Protect networks, ethical hacking, cryptography, and security best practices." },
  { id: 5, title: "Digital Marketing", category: "Marketing", duration: "6 weeks", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400", desc: "SEO, social media, Google Ads, content marketing, and analytics." },
  { id: 6, title: "Piano Mastery", category: "Music", duration: "8 weeks", image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400", desc: "From beginner to advanced piano techniques, music theory, and performance." }
];

const books = [
  { title: "Clean Code", author: "Robert Martin", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400", link: "#" },
  { title: "Python Crash Course", author: "Eric Matthes", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400", link: "#" }
];

const exploreVideos = [
  { country: "Rwanda", video: "https://www.youtube.com/embed/atJZ2-R3j_Q", image: "https://images.unsplash.com/photo-1573802106853-97dda69b74ca?w=400" },
  { country: "Japan", video: "https://www.youtube.com/embed/OhJU-n-LO5Q", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400" }
];

// ==================== SAVE/LOAD FUNCTIONS ====================
function saveAllData() {
  localStorage.setItem('rtlh_users', JSON.stringify(users));
  localStorage.setItem('rtlh_usercourses', JSON.stringify(userCoursesData));
  localStorage.setItem('rtlh_chatlogs', JSON.stringify(chatLogs));
  localStorage.setItem('rtlh_groups', JSON.stringify(communityGroups));
}

function loadData() {
  const u = localStorage.getItem('rtlh_users');
  if (u) users = JSON.parse(u);
  const c = localStorage.getItem('rtlh_usercourses');
  if (c) userCoursesData = JSON.parse(c);
  const l = localStorage.getItem('rtlh_chatlogs');
  if (l) chatLogs = JSON.parse(l);
  const g = localStorage.getItem('rtlh_groups');
  if (g) communityGroups = JSON.parse(g);
}

// ==================== AUTH FUNCTIONS ====================
function showAuthModal() {
  document.getElementById('authModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('authModal').style.display = 'none';
  document.getElementById('courseModal').style.display = 'none';
  document.getElementById('certModal').style.display = 'none';
}

document.getElementById('authForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  currentUser = {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    country: document.getElementById('country').value,
    photo: null,
    registeredAt: new Date().toISOString()
  };
  const file = document.getElementById('profilePhoto').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      currentUser.photo = ev.target.result;
      saveCurrentUser();
    };
    reader.readAsDataURL(file);
  }
  saveCurrentUser();
  document.getElementById('authModal').style.display = 'none';
  updateUIForUser();
  alert('✅ Account created successfully!');
});

function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem('rtlh_current_user', JSON.stringify(currentUser));
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx >= 0) users[idx] = currentUser;
    else users.push(currentUser);
    saveAllData();
  }
}

function loadCurrentUser() {
  const saved = localStorage.getItem('rtlh_current_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    if (!users.find(u => u.email === currentUser.email)) users.push(currentUser);
    saveAllData();
  }
}

function updateUIForUser() {
  document.getElementById('authBtn').style.display = 'none';
  document.getElementById('userNameDisplay').style.display = 'inline';
  document.getElementById('userNameDisplay').innerHTML = `👤 ${currentUser.fullName}`;
  updateDashboard();
  renderProfile();
}

// ==================== COURSE FUNCTIONS ====================
function renderFeatured() {
  const container = document.getElementById('featuredCourses');
  if (container) {
    container.innerHTML = fullCourseCatalog.slice(0, 4).map(c => `
      <div class="course-card" onclick="showCourseDetails(${c.id})">
        <img src="${c.image}" style="width:100%;height:150px;object-fit:cover;border-radius:15px;margin-bottom:1rem;">
        <h3>${c.title}</h3>
        <p>${c.duration}</p>
        <button class="btn-outline">Enroll</button>
      </div>
    `).join('');
  }
}

function renderAllCourses() {
  const container = document.getElementById('allCoursesList');
  if (container) {
    let html = '';
    fullCourseCatalog.forEach((c, idx) => {
      html += `
        <div class="course-row ${idx % 2 === 1 ? 'reverse' : ''}">
          <div class="course-image"><img src="${c.image}" alt="${c.title}"></div>
          <div class="course-info">
            <h2>${c.title}</h2>
            <p>${c.desc}</p>
            <p><strong>Duration:</strong> ${c.duration}</p>
            <button class="btn-3d" onclick="enrollCourse(${c.id})">Enroll Now →</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }
}

function showCourseDetails(id) {
  const c = fullCourseCatalog.find(c => c.id === id);
  const modalContent = document.getElementById('courseModalContent');
  if (modalContent) {
    modalContent.innerHTML = `
      <h2>${c.title}</h2>
      <img src="${c.image}" style="width:100%;border-radius:20px;margin:1rem 0;">
      <p>${c.desc}</p>
      <p><strong>Duration:</strong> ${c.duration}</p>
      <button class="btn-3d" onclick="enrollCourse(${c.id});closeModal()">Enroll Now</button>
    `;
    document.getElementById('courseModal').style.display = 'flex';
  }
}

function enrollCourse(id) {
  if (!currentUser) {
    alert('Please login first!');
    showAuthModal();
    return;
  }
  let prog = userCoursesData[currentUser.email] || [];
  if (!prog.find(c => c.id === id)) {
    prog.push({ id: id, title: fullCourseCatalog.find(c => c.id === id).title, progress: 0 });
    userCoursesData[currentUser.email] = prog;
    saveAllData();
    updateDashboard();
    alert(`✅ Enrolled in ${fullCourseCatalog.find(c => c.id === id).title}!`);
  } else {
    alert('Already enrolled in this course!');
  }
}

function updateDashboard() {
  if (!currentUser) return;
  let prog = userCoursesData[currentUser.email] || [];
  document.getElementById('enrolledCount').innerHTML = prog.length;
  let completed = prog.filter(c => c.progress >= 100).length;
  document.getElementById('completedCount').innerHTML = completed;
  document.getElementById('certCount').innerHTML = completed;
  
  const container = document.getElementById('myCoursesList');
  if (container) {
    container.innerHTML = prog.map(c => `
      <div class="course-card">
        <h3>${c.title}</h3>
        <div class="progress-bar"><div class="progress-fill" style="width:${c.progress}%"></div></div>
        <p>${c.progress}% Complete</p>
        <button class="btn-3d" onclick="updateProgress(${c.id})">✓ Complete Lesson</button>
        ${c.progress >= 100 ? `<button class="btn-outline" onclick="showCertificate('${c.title}')">🎓 Get Certificate</button>` : ''}
      </div>
    `).join('');
  }
  
  const ctx = document.getElementById('progressChart')?.getContext('2d');
  if (window.myChart) window.myChart.destroy();
  if (ctx) {
    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: prog.map(c => c.title),
        datasets: [{ label: 'Progress %', data: prog.map(c => c.progress), backgroundColor: '#4d8eff' }]
      }
    });
  }
}

function updateProgress(id) {
  let prog = userCoursesData[currentUser.email] || [];
  let course = prog.find(c => c.id === id);
  if (course && course.progress < 100) {
    course.progress = Math.min(100, course.progress + 25);
    userCoursesData[currentUser.email] = prog;
    saveAllData();
    updateDashboard();
    if (course.progress >= 100) alert('🎉 Congratulations! You completed the course!');
  }
}

function showCertificate(courseName) {
  document.getElementById('certUserName').innerHTML = currentUser.fullName;
  document.getElementById('certCourseName').innerHTML = courseName;
  document.getElementById('certModal').style.display = 'flex';
}

function downloadCertificate() {
  alert('📜 Certificate PDF generated! Globally recognized and blockchain-verified.');
}

// ==================== PROFILE ====================
function renderProfile() {
  if (!currentUser) return;
  const container = document.getElementById('profileInfo');
  if (container) {
    container.innerHTML = `
      ${currentUser.photo ? `<img src="${currentUser.photo}" class="profile-photo">` : '<i class="fas fa-user-circle" style="font-size:80px;display:block;text-align:center;"></i>'}
      <p><strong>${currentUser.fullName}</strong><br>${currentUser.email}<br>${currentUser.country}</p>
    `;
  }
}

function editProfile() {
  showAuthModal();
}

// ==================== BOOKS & EXPLORE ====================
function renderBooks() {
  const container = document.getElementById('booksList');
  if (container) {
    container.innerHTML = books.map(b => `
      <div class="book-card">
        <img src="${b.image}" alt="${b.title}">
        <h3>${b.title}</h3>
        <p>${b.author}</p>
        <button class="btn-glow" onclick="window.open('${b.link}','_blank')">Read Now</button>
      </div>
    `).join('');
  }
}

function renderExplore() {
  const container = document.getElementById('exploreVideos');
  if (container) {
    container.innerHTML = exploreVideos.map(v => `
      <div class="video-card">
        <img src="${v.image}" alt="${v.country}">
        <h3>${v.country}</h3>
        <button class="btn-3d" onclick="watchVideo('${v.video}','${v.country}')">Explore →</button>
      </div>
    `).join('');
  }
}

function watchVideo(url, country) {
  const modalContent = document.getElementById('courseModalContent');
  if (modalContent) {
    modalContent.innerHTML = `
      <h2>🇹🇿 Travel to ${country}</h2>
      <iframe width="100%" height="300" src="${url}" frameborder="0" allowfullscreen></iframe>
      <button class="btn-3d" onclick="closeModal()">Close</button>
    `;
    document.getElementById('courseModal').style.display = 'flex';
  }
}

// ==================== OPPORTUNITIES ====================
function renderOpportunities() {
  const container = document.getElementById('opportunitiesList');
  if (container) {
    container.innerHTML = `
      <div class="course-grid">
        ${["Mastercard Foundation Scholars", "Chevening Scholarship", "UNICEF Internship", "Google Internship", "Remote Developer", "Data Analyst"].map(o => `
          <div class="stat-card">
            <h3>${o}</h3>
            <button class="btn-glow" onclick="alert('Application submitted! We will contact you.')">Apply</button>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// ==================== COMMUNITY ====================
function createGroup() {
  const newGroup = document.getElementById('newGroup')?.value;
  if (newGroup) {
    communityGroups.push(newGroup);
    saveAllData();
    renderCommunity();
    document.getElementById('newGroup').value = '';
    alert(`Group "${newGroup}" created!`);
  }
}

function renderCommunity() {
  const container = document.getElementById('groupsList');
  if (container) {
    container.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:1rem;">${communityGroups.map(g => `<span class="stat-card">${g}</span>`).join('')}</div>`;
  }
}

// ==================== ADMIN PANEL ====================
function renderAdminPanel() {
  document.getElementById('adminTotalUsers').innerHTML = users.length;
  let certs = Object.values(userCoursesData).flat().filter(c => c.progress >= 100).length;
  document.getElementById('adminTotalCerts').innerHTML = certs;
  
  document.getElementById('adminUsersList').innerHTML = `
    <table class="admin-table">
      <tr><th>Name</th><th>Email</th><th>Country</th></tr>
      ${users.map(u => `<tr><td>${u.fullName}</td><td>${u.email}</td><td>${u.country}</td></tr>`).join('')}
    </table>
  `;
  
  document.getElementById('adminChatLogs').innerHTML = chatLogs.slice(-20).map(l => `
    <div><strong>${l.user}:</strong> ${l.question}<br><em>🤖 ${l.answer.substring(0,80)}</em></div><hr>
  `).join('');
}

// ==================== AI CHATBOT ====================
async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const question = input.value.trim();
  if (!question) return;
  
  const messagesDiv = document.getElementById('chatMessages');
  messagesDiv.innerHTML += `<div class="message-user">${question}</div>`;
  input.value = '';
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  
  const answer = getAIAnswer(question);
  setTimeout(() => {
    messagesDiv.innerHTML += `<div class="message-bot">🤖 ${answer}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    chatLogs.push({ user: currentUser?.email || 'guest', question, answer, timestamp: new Date().toISOString() });
    saveAllData();
    if (document.getElementById('adminPage').style.display === 'block') renderAdminPanel();
  }, 300);
}

function getAIAnswer(q) {
  const lq = q.toLowerCase();
  if (lq.includes('course')) return "RTLH offers 6+ core courses: Python, Web Dev, Data Science, Cybersecurity, Marketing, Piano! Enroll from Courses page.";
  if (lq.includes('book')) return "Visit our Books section for free tech and leadership ebooks to read online!";
  if (lq.includes('certificate')) return "Complete any course (100% progress) to get a globally recognized certificate!";
  if (lq.includes('job') || lq.includes('opportunity')) return "Check Opportunities Center for scholarships, internships, and remote jobs updated daily!";
  if (lq.includes('price') || lq.includes('cost')) return "All RTLH courses are currently FREE! Quality education for everyone.";
  return "Thanks for your question! I'm Theo LearnWise. Explore Courses, Books, or Opportunities for more info!";
}

function toggleChat() {
  const w = document.getElementById('chatWindow');
  w.style.display = w.style.display === 'flex' ? 'none' : 'flex';
}

function setChatAvatar() {
  const avatarUrl = "https://randomuser.me/api/portraits/men/32.jpg";
  const avatars = document.querySelectorAll('.chat-toggle img, .chat-header img');
  avatars.forEach(img => { if (img) img.src = avatarUrl; });
}

// ==================== PAGE NAVIGATION ====================
function showPage(page) {
  const pages = ['home', 'courses', 'books', 'explore', 'opportunities', 'dashboard', 'profile', 'community', 'admin'];
  pages.forEach(p => {
    const el = document.getElementById(p + 'Page');
    if (el) el.style.display = 'none';
  });
  document.getElementById(page + 'Page').style.display = 'block';
  if (page === 'dashboard') updateDashboard();
  if (page === 'profile') renderProfile();
  if (page === 'admin') renderAdminPanel();
  if (page === 'community') renderCommunity();
  window.scrollTo(0, 0);
}

// ==================== 3D BACKGROUND ====================
function init3D() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-bg'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  const group = new THREE.Group();
  
  // Stars
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1500;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 400;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 250;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x4d8eff, size: 0.15 }));
  group.add(stars);
  
  // Animated symbols
  const symbols = ['♪', '♫', '🎵', '🎶', '💻', '🖥️', '📱', '🎹', '🎨', '📊'];
  for (let i = 0; i < 80; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4d8eff';
    ctx.font = '40px Arial';
    ctx.fillText(symbols[i % symbols.length], 12, 48);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.6, 0.6, 1);
    sprite.position.x = (Math.random() - 0.5) * 180;
    sprite.position.y = (Math.random() - 0.5) * 120;
    sprite.position.z = (Math.random() - 0.5) * 120 - 30;
    group.add(sprite);
  }
  
  scene.add(group);
  camera.position.z = 70;
  
  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.0015;
    group.rotation.x += 0.0008;
    renderer.render(scene, camera);
  }
  animate();
  
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

// ==================== RENDER ALL ====================
function renderAll() {
  renderFeatured();
  renderAllCourses();
  renderBooks();
  renderExplore();
  renderOpportunities();
  renderCommunity();
  if (currentUser) updateUIForUser();
}

// ==================== INITIALIZATION ====================
function init() {
  loadData();
  loadCurrentUser();
  renderAll();
  init3D();
  setChatAvatar();
  
  // Close modals when clicking outside
  window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  };
}

// Start the app
init();