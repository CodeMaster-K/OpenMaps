# 🌍 React OpenStreetMap Location App

This project is a responsive React app that integrates **OpenStreetMap** using **React Leaflet**. It allows users to:

- 🔍 Search for a place (area, city, district, state)
- 📍 Press Enter to auto-locate themselves using GPS
- 📌 See location details (area, district, state, country)
- 🧭 View coordinates in a floating info box
- 🗺️ Toggle between Normal and Satellite map views using radio buttons
- 📱 Fully responsive for mobile and desktop

---

## 🛠️ Features

- **Leaflet Map with OpenStreetMap tiles**
- **Smooth zoom transition** to your location or search result
- **Search box** with placeholder "Search Place" and zoom-to-location
- **Enter key** triggers GPS location
- **Floating info boxes**:
  - Bottom-left: GPS coordinates
  - Bottom-right: location info
- **Top-right radio toggle** to switch map views
- **No Google Maps or paid APIs**

---

## 📦 Tech Stack

- React
- React Leaflet
- OpenStreetMap
- Nominatim API (for location & reverse geocoding)
- CSS for styling
