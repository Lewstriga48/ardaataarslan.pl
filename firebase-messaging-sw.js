importScripts("https://www.gstatic.com/firebasejs/11.3.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.3.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyA-RmgwT5vdIfZlv9o7lNB2Nyj89N1yu1Y",
    authDomain: "weatherapp-f38ca.firebaseapp.com",
    projectId: "weatherapp-f38ca",
    storageBucket: "weatherapp-f38ca.firebasestorage.app",
    messagingSenderId: "870667297007",
    appId: "1:870667297007:web:fccbfc6aef7a0ff4043b1a"
});

const messaging = firebase.messaging();
const CACHE_NAME = "weatherapp-cache-v1";
const OFFLINE_URL = "/offline.html";

// **Service Worker Yüklenirken Cache’e Statik Dosyaları Al**
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching static assets...");
            return cache.addAll([
                "/",
                "/index.html",
                "/style.css",
                "/app.js",
                "/icons/icon-192x192.png",
                "/icons/icon-512x512.png",
                OFFLINE_URL
            ]);
        })
    );
    self.skipWaiting();
});

// **Service Worker Activate - Eski Cache'leri Temizle**
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// **Fetch Event - Cache’i Kullanarak Offline Desteği Sağla**
self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// **Arka planda gelen mesajları dinle ve bildirim göster**
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/icons/icon-192x192.png"
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// **Push Notification Listener**
self.addEventListener("push", (event) => {
    const data = event.data.json();
    console.log("Push Notification Received:", data);
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icons/icon-192x192.png"
    });
});
