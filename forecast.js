const apiKey = "4e66138d3798fbabe3c2a8eadad36085"; // OpenWeatherMap API anahtarı

// URL'den şehir parametresini al
const urlParams = new URLSearchParams(window.location.search);
const city = urlParams.get("city");

document.getElementById("forecastCity").textContent = `City: ${city}`;

// Haftalık tahmin verilerini al
async function getWeeklyForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        console.log("Haftalık tahmin verisi:", data);
        updateForecastUI(data);

        // Cache'e kaydet
        const cache = await caches.open(CACHE_NAME);
        cache.put(`forecast-${city}`, new Response(JSON.stringify(data)));
    } catch (error) {
        console.error("Tahmin verisi alınamadı:", error);

        // Eğer offline moddaysak cache'deki son veriyi döndür
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(`forecast-${city}`);
        if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            updateForecastUI(cachedData);
        } else {
            document.getElementById("forecastContainer").innerHTML = `
                <p>Unable to load forecast data. Please try again later.</p>
            `;
        }
    }
}

// UI'yi güncelle
function updateForecastUI(data) {
    const container = document.getElementById("forecastContainer");
    container.innerHTML = ""; // Eski içeriği temizle

    // API'den dönen 5 günlük tahmin verilerini filtrele
    const forecasts = data.list.filter((item) => item.dt_txt.includes("12:00:00")); // Sadece saat 12:00'yi seç
    forecasts.forEach((forecast) => {
        const forecastElement = document.createElement("div");
        forecastElement.classList.add("forecast-item");

        forecastElement.innerHTML = `
            <p><strong>${new Date(forecast.dt_txt).toDateString()}</strong></p>
            <p>Temperature: ${forecast.main.temp}°C</p>
            <p>Condition: ${forecast.weather[0].description}</p>
        `;

        container.appendChild(forecastElement);
    });

    // Eğer hiçbir tahmin verisi yoksa
    if (forecasts.length === 0) {
        container.innerHTML = `<p>No forecast data available.</p>`;
    }
}

// Tahmin verilerini yükle
getWeeklyForecast(city);
