// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker зарегистрирован'))
    .catch(err => console.error('Ошибка регистрации Service Worker:', err));
}

// Запрос разрешения на уведомления
document.getElementById('notify-btn').addEventListener('click', () => {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      scheduleNotification();
    } else {
      alert('Уведомления заблокированы пользователем.');
    }
  });
});

setInterval(() => {
  getAllMessages().then(messages => {
    messages.forEach(msg => alert(msg.body))
  });
  clearMessages()
}, 1000);

// Планирование уведомления
function scheduleNotification() {
  navigator.serviceWorker.ready.then(registration => {
    setTimeout(() => {
      registration.showNotification('Привет!', {
        body: 'Это пуш-уведомление через 3 секунды!',
        icon: 'icon.png',
        vibrate: [200, 100, 200]
      });
    }, 3000);
    storeMessage({ body: 'Альтернативное уведомление' })
  });
}

async function storeMessage(data) {
  const db = await openMessagesDB();
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  store.add(data);
  return tx.complete;
}

function openMessagesDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('myMessagesDB', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Create a store if it doesn’t exist
      if (!db.objectStoreNames.contains('messages')) {
        db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllMessages() {
  const db = await openMessagesDB();
  const tx = db.transaction('messages', 'readonly');
  const store = tx.objectStore('messages');

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (err) => reject(err);
  });
}

async function clearMessages() {
  const db = await openMessagesDB();
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  store.clear();
  return tx.complete;
}
