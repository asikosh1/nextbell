const CACHE_NAME = 'nextbell-v1';

// Установка воркера
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Активация
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Обработка запросов (пустой обработчик нужен для PWA)
self.addEventListener('fetch', (event) => {
    // Просто пропускаем запросы в сеть
});
