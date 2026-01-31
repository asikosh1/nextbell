// 1. Загружаем данные или ставим дефолт
let mySchedule = JSON.parse(localStorage.getItem('nextbell_data')) || [
    { name: "Математика", start: "08:40", end: "09:35" },
    { name: "Физика", start: "09:40", end: "10:25" }
];

// 2. Управление экранами (Главный / Настройки)
function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(`screen-${name}`).style.display = 'block';
}

// 3. Переключение темы
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 4. Главная логика таймера и списка уроков
function updateApp() {
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    
    // Обновляем часы
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    let html = "";
    let activeFound = false;

    mySchedule.forEach(l => {
        const [h1, m1] = l.start.split(':').map(Number);
        const [h2, m2] = l.end.split(':').map(Number);
        const s = h1 * 60 + m1;
        const e = h2 * 60 + m2;

        const isActive = cur >= s && cur < e;
        if (isActive) {
            html += `<div class="lesson-item active">
                        <span><b>${l.name}</b><br>${l.start}-${l.end}</span> 
                        <span>Сейчас</span>
                     </div>`;
            document.getElementById('status').innerText = `${e - cur} мин до звонка`;
            activeFound = true;
        } else {
            html += `<div class="lesson-item"><span><b>${l.name}</b><br>${l.start}-${l.end}</span></div>`;
        }
    });

    if(!activeFound) document.getElementById('status').innerText = "Перемена / Уроки окончены";
    const listEl = document.getElementById('schedule-list');
    if (listEl) listEl.innerHTML = html;
}

// 5. Логика редактора в настройках
function renderEditor() {
    const container = document.getElementById('edit-list');
    if (!container) return;
    container.innerHTML = '';
    
    mySchedule.forEach((l, i) => {
        container.innerHTML += `
            <div class="lesson-input" style="background: var(--card); margin: 10px 20px; padding: 15px; border-radius: 15px; display: flex; flex-direction: column; gap: 10px; border: 1px solid #ddd;">
                <input type="text" value="${l.name}" placeholder="Предмет" onchange="editLesson(${i}, 'name', this.value)" style="font-weight: bold;">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="time" value="${l.start}" onchange="editLesson(${i}, 'start', this.value)">
                    <span>—</span>
                    <input type="time" value="${l.end}" onchange="editLesson(${i}, 'end', this.value)">
                    <button onclick="removeLesson(${i})" style="background: #ff4d4d; color: white; border: none; border-radius: 8px; padding: 5px 10px;">🗑️</button>
                </div>
            </div>
        `;
    });
}

function editLesson(index, field, value) {
    mySchedule[index][field] = value;
    saveData();
}

function addLesson() {
    mySchedule.push({name: "Новый урок", start: "12:00", end: "12:45"});
    saveData();
    renderEditor();
}

function removeLesson(index) {
    mySchedule.splice(index, 1);
    saveData();
    renderEditor();
}

function saveData() {
    localStorage.setItem('nextbell_data', JSON.stringify(mySchedule));
    updateApp();
}

// 6. Запуск при загрузке
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
const toggleEl = document.getElementById('theme-toggle');
if (toggleEl) toggleEl.checked = (savedTheme === 'dark');

setInterval(updateApp, 1000);
updateApp();
renderEditor();