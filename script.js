// 1. ДАННЫЕ (Один раз!)
let mySchedule = JSON.parse(localStorage.getItem('nextbell_data')) || [
    { name: "Математика", start: "08:40", end: "09:35" },
    { name: "Физика", start: "09:40", end: "10:25" }
];

// 2. SPLASH SCREEN
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 500);
        }
    }, 2000);
});

// 3. ОБНОВЛЕНИЕ ПРИЛОЖЕНИЯ
function updateApp() {
    const now = new Date();
    const curTotal = now.getHours() * 60 + now.getMinutes();
    
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    let html = "";
    let statusText = "Уроков нет";

    mySchedule.forEach(l => {
        const [h1, m1] = l.start.split(':').map(Number);
        const [h2, m2] = l.end.split(':').map(Number);
        const s = h1 * 60 + m1;
        const e = h2 * 60 + m2;

        const isActive = curTotal >= s && curTotal < e;
        if (isActive) {
            statusText = `До конца урока: ${e - curTotal} мин`;
        }

        html += `<div class="lesson-item ${isActive ? 'active' : ''}">
            <span><b>${l.name}</b><br><small>${l.start}-${l.end}</small></span>
            ${isActive ? '<span>🔥</span>' : ''}
        </div>`;
    });

    if (document.getElementById('status')) document.getElementById('status').innerText = statusText;
    if (document.getElementById('schedule-list')) document.getElementById('schedule-list').innerHTML = html;
}

// 4. НАВИГАЦИЯ И ТЕМА
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

// 5. ИНИЦИАЛИЗАЦИЯ
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
if(document.getElementById('theme-toggle')) {
    document.getElementById('theme-toggle').checked = (savedTheme === 'dark');
}

setInterval(updateApp, 1000);
updateApp();

// 6. РЕДАКТОР
function renderEditor() {
    const list = document.getElementById('edit-list');
    if(!list) return;
    list.innerHTML = mySchedule.map((l, i) => `
        <div class="setting-item" style="display:flex; flex-direction:column; gap:8px; padding:15px; border-bottom: 1px solid rgba(128,128,128,0.2);">
            <input type="text" value="${l.name}" onchange="editLesson(${i}, 'name', this.value)" placeholder="Название">
            <div style="display:flex; gap:10px;">
                <input type="time" value="${l.start}" onchange="editLesson(${i}, 'start', this.value)">
                <input type="time" value="${l.end}" onchange="editLesson(${i}, 'end', this.value)">
                <button onclick="removeLesson(${i})" style="background:none; border:none; cursor:pointer;">🗑️</button>
            </div>
        </div>`).join('');
}

function editLesson(i, f, v) { mySchedule[i][f] = v; saveData(); }
function addLesson() { mySchedule.push({name: "Новый урок", start: "08:00", end: "08:45"}); saveData(); renderEditor(); }
function removeLesson(i) { mySchedule.splice(i, 1); saveData(); renderEditor(); }
function saveData() { localStorage.setItem('nextbell_data', JSON.stringify(mySchedule)); updateApp(); }

renderEditor();
showScreen('main'); // Показываем главный экран при старте

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log(err));
}
