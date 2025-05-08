import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const FlyTo = ({ coords, zoom = 15 }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom, { duration: 2 });
    }
  }, [coords, zoom, map]);
  return null;
};

const App = () => {
  const [location, setLocation] = useState(null);
  const [searchedCoords, setSearchedCoords] = useState(null);
  const [locationInfo, setLocationInfo] = useState({});
  const [showLabel, setShowLabel] = useState(true);
  const [showPrompt, setShowPrompt] = useState(true);
  const [mapStyle, setMapStyle] = useState("normal");
  const [searchQuery, setSearchQuery] = useState("");

  const defaultCenter = [20, 0];

  const handleEnter = (e) => {
    if (e.key === "Enter" && showPrompt) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setLocation(coords);
          fetchLocationDetails(coords);
          setShowPrompt(false);
        },
        (err) => console.error("Geolocation failed", err)
      );
    }
  };

  const fetchLocationDetails = async ([lat, lon]) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      const addr = data.address || {};
      setLocationInfo({
        area: addr.suburb || addr.city || "",
        district: addr.state_district || "",
        state: addr.state || "",
        country: addr.country || "",
      });
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setSearchedCoords([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Place not found.");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [showPrompt]);

  const getTileURL = () =>
    mapStyle === "normal"
      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      : "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={defaultCenter} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer url={getTileURL()} />
        {location && (
          <>
            <Marker position={location} />
            <FlyTo coords={location} />
          </>
        )}
        {searchedCoords && <FlyTo coords={searchedCoords} />}
      </MapContainer>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search Place"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Map View Toggle */}
      <div className="map-toggle">
        <label>
          <input
            type="radio"
            name="mapStyle"
            value="normal"
            checked={mapStyle === "normal"}
            onChange={(e) => setMapStyle(e.target.value)}
          />
          Normal
        </label>
        <label>
          <input
            type="radio"
            name="mapStyle"
            value="satellite"
            checked={mapStyle === "satellite"}
            onChange={(e) => setMapStyle(e.target.value)}
          />
          Satellite
        </label>
      </div>

      {/* Prompt box */}
      {showPrompt && (
        <div className="prompt-box">
          Press Enter to Go to Your Location
        </div>
      )}

      {/* Closable Label */}
      {/* {location && showLabel && (
        <div className="label-box" style={{ top: "50%", left: "50%" }}>
          <span>Your Location</span>
          <button onClick={() => setShowLabel(false)}>✕</button>
        </div>
      )} */}

      {/* Coordinate Box */}
      {location && (
        <div className="info-box left">
          <strong>GPS Coordinates</strong>
          <div><strong>Lat:</strong> {location[0].toFixed(5)}</div>
          <div><strong>Lon:</strong> {location[1].toFixed(5)}</div>
        </div>
      )}

      {/* Location Info Box */}
      {location && (
        <div className="info-box right">
          <strong>Location Details</strong>
          <div><strong>Area:</strong> {locationInfo.area || "N/A"}</div>
          <div><strong>District:</strong> {locationInfo.district || "N/A"}</div>
          <div><strong>State:</strong> {locationInfo.state || "N/A"}</div>
          <div><strong>Country:</strong> {locationInfo.country || "N/A"}</div>
        </div>
      )}
    </div>
  );
};

export default App;
