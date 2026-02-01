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

// Скрываем логотип через 2 секунды
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => splash.style.visibility = 'hidden', 500);
    }, 2000);
});

function updateApp() {
    const now = new Date();
    const curH = now.getHours();
    const curM = now.getMinutes();
    const curTotal = curH * 60 + curM;
    
    // Часы в формате 00:00
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.innerText = `${String(curH).padStart(2, '0')}:${String(curM).padStart(2, '0')}`;
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
            const timeLeft = e - curTotal;
            statusText = `До конца урока: ${timeLeft} мин`;
        }

        html += `
            <div class="lesson-item ${isActive ? 'active' : ''}">
                <div>
                    <b>${l.name}</b><br>
                    <small>${l.start} - ${l.end}</small>
                </div>
                ${isActive ? '<span>🔥</span>' : ''}
            </div>`;
    });
    
    document.getElementById('status').innerText = statusText;
    document.getElementById('schedule-list').innerHTML = html;
}

function renderEditor() {
    const editList = document.getElementById('edit-list');
    if (!editList) return;
    editList.innerHTML = mySchedule.map((l, i) => `
        <div class="setting-item" style="flex-direction: column; align-items: stretch; gap: 10px;">
            <input type="text" value="${l.name}" onchange="editLesson(${i}, 'name', this.value)" style="padding: 8px; border-radius: 8px; border: 1px solid #ddd;">
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="time" value="${l.start}" onchange="editLesson(${i}, 'start', this.value)" style="flex: 1; padding: 5px;">
                <input type="time" value="${l.end}" onchange="editLesson(${i}, 'end', this.value)" style="flex: 1; padding: 5px;">
                <button onclick="removeLesson(${i})" style="background:none; border:none; cursor:pointer; font-size: 18px;">🗑️</button>
            </div>
        </div>`).join('');
}

function editLesson(i, field, val) { mySchedule[i][field] = val; saveData(); }
function addLesson() { mySchedule.push({name: "Новый урок", start: "12:00", end: "12:45"}); saveData(); renderEditor(); }
function removeLesson(i) { mySchedule.splice(i, 1); saveData(); renderEditor(); }
function saveData() { localStorage.setItem('nextbell_data', JSON.stringify(mySchedule)); updateApp(); }

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

