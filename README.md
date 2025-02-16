# Project Name: Weather App

## Overview
This project is a weather application developed using modern web technologies to provide weather updates based on a user's location or a manually entered city name. The application supports offline usage, local notifications, and responsive design.

### Technologies Used:
- **HTML**: To structure the web pages.
- **CSS**: For styling and layout.
- **JavaScript**: For dynamic functionalities and API integration.
- **Service Workers**: For offline support and caching.
- **OpenWeatherMap API**: To fetch weather data.
- **Push Notifications**: To notify users with weather updates.

## Project Features

### 1. **Progressive Web App (PWA)**
- **Manifest File**: Defines the application metadata, such as name, theme color, icons, and start URL.
- **Service Worker**: Provides offline functionality and caches weather data for future use.

### 2. **Local Device Capabilities**
- **Geolocation**: Retrieves the user's current location to fetch weather data.
- **Push Notifications**: Notifies users with weather updates based on their input or location.

### 3. **Offline Support**
- Uses Service Workers to cache API responses and allow the application to function without an internet connection.
- Notifies users when offline data is displayed.

### 4. **Responsive Design**
- Optimized for various screen sizes using CSS media queries (partially implemented).

### 5. **Multi-View Navigation**
- Includes multiple HTML pages for different functionalities:
  - **index.html**: Main weather page.
  - **forecast.html**: Detailed weather forecast.
  - **offline.html**: Offline information page.

### 6. **Performance**
- Ensures fast loading and smooth interactions.
- Can be evaluated using Lighthouse or similar tools.

### 7. **Documentation**
- Comprehensive README file explaining project structure, technologies, and usage.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ardaataarslan/weather-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd weather-app
   ```
3. Open `index.html` in a browser or serve the project using a local web server.

## Live Project Link
The application is live and accessible at:
[Weather App](https://ardaataarslan.pl/index.html)

## Project Structure

```
weather-app/
|-- index.html
|-- forecast.html
|-- offline.html
|-- app.js
|-- style.css
|-- sw.js
|-- manifest.json
|-- icons/
    |-- icon-192x192.png
    |-- icon-512x512.png
```

## Student Information
- **Name**: Arda Ata Arslan
- **Student ID**: 35817

## Usage Instructions
- Open the application in a browser.
- Allow location access to fetch weather for your current location.
- Enter a city name manually to fetch its weather.
- The application works offline with cached weather data.

