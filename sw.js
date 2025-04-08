// Service Worker Activation
self.addEventListener('install', event => {
  console.log('Service Worker установлен');
  self.skipWaiting();
});

// Уведомления можно обрабатывать здесь (опционально)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// self.addEventListener('message', (event) => {
//   if (event.data === 'POLL_MESSAGES') {
//     console.log('[SW] Got POLL_MESSAGES');

//     getAllMessages().then(messages => {
//       event.source.postMessage({ type: 'MESSAGES', payload: messages });
//     });
//   }
// });
