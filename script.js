let mySchedule = JSON.parse(localStorage.getItem('nextbell_data')) || [
    { name: "Математика", start: "08:40", end: "09:35" },
    { name: "Физика", start: "09:40", end: "10:25" }
];

function showScreen(name) {
    // Прячем все экраны по новому классу
    document.querySelectorAll('.app-screen').forEach(s => s.style.display = 'none');
    // Показываем нужный
    const target = document.getElementById(`screen-${name}`);
    if (target) target.style.display = 'flex'; 
}

function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function updateApp() {
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    let html = "";
    mySchedule.forEach(l => {
        const [h1, m1] = l.start.split(':').map(Number);
        const [h2, m2] = l.end.split(':').map(Number);
        const s = h1 * 60 + m1;
        const e = h2 * 60 + m2;
        const isActive = cur >= s && cur < e;

        html += `<div class="lesson-item ${isActive ? 'active' : ''}">
                    <span>${l.name}</span>
                    <span>${l.start} - ${l.end}</span>
                 </div>`;
        
        if (isActive) {
            document.getElementById('status').innerText = `Сейчас: ${l.name}`;
        }
    });
    
    const listEl = document.getElementById('schedule-list');
    if (listEl) listEl.innerHTML = html;
}

function renderEditor() {
    const editList = document.getElementById('edit-list');
    if (!editList) return;
    editList.innerHTML = "";
    mySchedule.forEach((l, i) => {
        editList.innerHTML += `
            <div class="setting-item" style="flex-direction: column; align-items: stretch; gap: 10px;">
                <input type="text" value="${l.name}" onchange="editLesson(${i}, 'name', this.value)" style="padding: 8px; border-radius: 8px; border: 1px solid #ddd;">
                <div style="display: flex; gap: 10px;">
                    <input type="time" value="${l.start}" onchange="editLesson(${i}, 'start', this.value)" style="flex: 1; padding: 5px;">
                    <input type="time" value="${l.end}" onchange="editLesson(${i}, 'end', this.value)" style="flex: 1; padding: 5px;">
                    <button onclick="removeLesson(${i})" style="background: none; border: none; font-size: 20px; cursor: pointer;">🗑️</button>
                </div>
            </div>`;
    });
}

function editLesson(i, field, val) { mySchedule[i][field] = val; saveData(); }
function addLesson() { mySchedule.push({name: "Новый урок", start: "12:00", end: "12:45"}); saveData(); renderEditor(); }
function removeLesson(i) { mySchedule.splice(i, 1); saveData(); renderEditor(); }
function saveData() { localStorage.setItem('nextbell_data', JSON.stringify(mySchedule)); updateApp(); }

// Инициализация
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
document.getElementById('theme-toggle').checked = savedTheme === 'dark';

setInterval(updateApp, 1000);
updateApp();
renderEditor();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log(err));
}
