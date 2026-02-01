let mySchedule = JSON.parse(localStorage.getItem('nextbell_data')) || [
    { name: "Математика", start: "08:40", end: "09:35" },
    { name: "Физика", start: "09:40", end: "10:25" }
];

window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.transition = 'opacity 0.6s ease';
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 600);
        }
    }, 1500);
});

function updateApp() {
    const now = new Date();
    const curTotal = now.getHours() * 60 + now.getMinutes();
    
    const clock = document.getElementById('clock');
    if (clock) clock.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let html = "";
    let status = "Перемена";

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
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
if(document.getElementById('theme-toggle')) document.getElementById('theme-toggle').checked = (savedTheme === 'dark');

setInterval(updateApp, 1000);
updateApp();

function renderEditor() {
    const list = document.getElementById('edit-list');
    if(!list) return;
    list.innerHTML = mySchedule.map((l, i) => `
        <div class="setting-item" style="padding:15px; border-bottom:1px solid rgba(128,128,128,0.2);">
            <input type="text" value="${l.name}" onchange="editLesson(${i}, 'name', this.value)" style="width:100%; margin-bottom:10px;">
            <div style="display:flex; gap:10px; align-items:center;">
                <input type="time" value="${l.start}" onchange="editLesson(${i}, 'start', this.value)">
                <input type="time" value="${l.end}" onchange="editLesson(${i}, 'end', this.value)">
                <button onclick="removeLesson(${i})" style="background:none; border:none; font-size:18px;">🗑️</button>
            </div>
        </div>`).join('');
}

function editLesson(i, f, v) { mySchedule[i][f] = v; saveData(); }
function addLesson() { mySchedule.push({name: "Новый урок", start: "08:00", end: "08:45"}); saveData(); renderEditor(); }
function removeLesson(i) { mySchedule.splice(i, 1); saveData(); renderEditor(); }
function saveData() { localStorage.setItem('nextbell_data', JSON.stringify(mySchedule)); updateApp(); }

renderEditor();
