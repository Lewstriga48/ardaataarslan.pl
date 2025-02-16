const apiKey = "4e66138d3798fbabe3c2a8eadad36085"; // OpenWeatherMap API key
const CACHE_NAME = "weatherapp-cache-v1";

// Log to verify the script is loaded
console.log("app.js loaded and running!");

// Request notification permission on page load
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            } else {
                console.log("Notification permission denied.");
            }
        });
    } else {
        console.log("Browser does not support notifications.");
    }
}

// Call notification permission request on load
requestNotificationPermission();

// Function to show a notification
function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: body,
            icon: "icons/icon-192x192.png" // Optional icon
        });
    } else {
        console.log("Notification permission not granted, cannot show notification.");
    }
}

// Event listener for "Use My Location" button
document.getElementById("useLocation").addEventListener("click", () => {
    console.log("Use My Location button clicked.");
    getUserLocation();
});

// Event listener for "Get Weather" button
document.getElementById("getWeather").addEventListener("click", () => {
    console.log("Get Weather button clicked!");
    const city = document.getElementById("cityInput").value.trim(); // Get city name from input
    if (!city) {
        alert("Please enter a valid city name!");
        return;
    }
    console.log(`Entered city: ${city}`);
    getWeatherByCity(city); // Fetch weather by city name
});

// Get user's location and fetch weather data
function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(`Location retrieved: Latitude ${lat}, Longitude ${lon}`);
                getWeatherByCoords(lat, lon);
            },
            (error) => {
                alert("Location access denied. Please enter city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Fetch weather by city name (with cache support)
async function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        console.log("Data returned from API:", data);
        updateUI(data);

        // Show a notification with weather details
        showNotification(
            "Weather Update",
            `Current weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`
        );

        const cache = await caches.open(CACHE_NAME);
        cache.put(`weather-${city}`, new Response(JSON.stringify(data)));

        // Redirect to detailed forecast page
        window.location.href = `forecast.html?city=${city}`;

    } catch (error) {
        console.warn("API request failed, checking cache...");

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(`weather-${city}`);

        if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            console.log("Data returned from cache:", cachedData);
            updateUI(cachedData);
            alert("No internet connection. Showing previously cached weather data.");
        } else {
            alert("City not found and no cached data available.");
        }
    }
}

// Fetch weather by coordinates (with cache support)
async function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather data not found");

        const data = await response.json();
        console.log("Data returned from API by coordinates:", data);
        updateUI(data);

        // Show a notification with weather details
        showNotification(
            "Weather Update",
            `Your location's weather: ${data.main.temp}°C, ${data.weather[0].description}`
        );

        const cache = await caches.open(CACHE_NAME);
        cache.put("weather-location", new Response(JSON.stringify(data)));

    } catch (error) {
        console.warn("API request failed, checking cache...");

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match("weather-location");

        if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            console.log("Data returned from cache:", cachedData);
            updateUI(cachedData);
            alert("No internet connection. Showing previously cached weather data.");
        } else {
            alert("No internet connection and no cached weather data found.");
        }
    }
}

// Update UI with weather data
function updateUI(data) {
    document.getElementById("location").textContent = `City: ${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById("condition").textContent = `Condition: ${data.weather[0].description}`;
    console.log("UI updated.");
}
