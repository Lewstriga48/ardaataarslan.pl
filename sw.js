const CACHE_NAME = "weather-app-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/forecast.html", // Forecast sayfasını ekledik
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/offline.html" // Offline sayfa
];

// Service Worker'ı yükleme ve önbelleğe alma
self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Caching static assets...");
                return cache.addAll(urlsToCache);
            })
    );
});

// Eski önbelleği temizleme
self.addEventListener("activate", (event) => {
    console.log("Service Worker activated.");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cache) => cache !== CACHE_NAME)
                    .map((cache) => caches.delete(cache))
            );
        })
    );
});

// Fetch olayını yönet
self.addEventListener("fetch", (event) => {
    console.log("Fetching:", event.request.url);

    if (event.request.url.includes("weather")) {
        // Hava durumu API çağrıları için
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        return caches.match("/offline.html"); // Cache yoksa offline.html göster
                    });
                })
        );
    } else if (event.request.url.includes("forecast.html")) {
        // Forecast sayfası için
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return caches.match("/offline.html");
            })
        );
    } else {
        // Diğer istekler
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(event.request))
        );
    }
});
