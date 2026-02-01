let mySchedule = JSON.parse(localStorage.getItem('nextbell_data')) || [
    { name: "Математика", start: "08:40", end: "09:35" },
    { name: "Физика", start: "09:40", end: "10:25" }
];

function showScreen(name) {
    document.querySelectorAll('.app-screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(`screen-${name}`);
    if (target) target.style.display = 'flex';
}

function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Логика Splash Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.transition = 'opacity 0.5s ease';
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
    }, 2000); // 2 секунды показа
});

let mySchedule = JSON.parse(localStorage.getItem('nextbell_data')) || [
    { name: "Математика", start: "08:40", end: "09:35" },
    { name: "Физика", start: "09:40", end: "10:25" }
];

function updateApp() {
    const now = new Date();
    const curH = now.getHours();
    const curM = now.getMinutes();
    const curTotal = curH * 60 + curM;
    
    document.getElementById('clock').innerText = 
        `${String(curH).padStart(2, '0')}:${String(curM).padStart(2, '0')}`;

    let html = "";
    let status = "Уроков нет";

    mySchedule.forEach(l => {
        const [h1, m1] = l.start.split(':').map(Number);
        const [h2, m2] = l.end.split(':').map(Number);
        const s = h1 * 60 + m1;
        const e = h2 * 60 + m2;

        const isActive = curTotal >= s && curTotal < e;
        if (isActive) status = `До конца урока: ${e - curTotal} мин`;

        html += `<div class="lesson-item ${isActive ? 'active' : ''}">
            <span><b>${l.name}</b><br><small>${l.start}-${l.end}</small></span>
            ${isActive ? '<span>🔥</span>' : ''}
        </div>`;
    });

    document.getElementById('status').innerText = status;
    document.getElementById('schedule-list').innerHTML = html;
}

function showScreen(name) {
    document.querySelectorAll('.app-screen').forEach(s => s.style.display = 'none');
    document.getElementById(`screen-${name}`).style.display = 'flex';
}

function toggleTheme() {
    const body = document.body;
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Инициализация темы
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

setInterval(updateApp, 1000);
updateApp();

function renderEditor() {
    const list = document.getElementById('edit-list');
    if(!list) return;
    list.innerHTML = mySchedule.map((l, i) => `
        <div class="setting-item" style="display:flex; flex-direction:column; gap:5px; padding:10px;">
            <input type="text" value="${l.name}" onchange="editLesson(${i}, 'name', this.value)">
            <div style="display:flex; gap:10px;">
                <input type="time" value="${l.start}" onchange="editLesson(${i}, 'start', this.value)">
                <input type="time" value="${l.end}" onchange="editLesson(${i}, 'end', this.value)">
                <button onclick="removeLesson(${i})">🗑️</button>
            </div>
        </div>`).join('');
}

function editLesson(i, f, v) { mySchedule[i][f] = v; saveData(); }
function addLesson() { mySchedule.push({name: "Урок", start: "08:00", end: "08:45"}); saveData(); renderEditor(); }
function removeLesson(i) { mySchedule.splice(i, 1); saveData(); renderEditor(); }
function saveData() { localStorage.setItem('nextbell_data', JSON.stringify(mySchedule)); updateApp(); }
renderEditor();

// Запуск
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
if(document.getElementById('theme-toggle')) {
    document.getElementById('theme-toggle').checked = (savedTheme === 'dark');
}

setInterval(updateApp, 1000);
updateApp();
renderEditor();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log(err));
}


