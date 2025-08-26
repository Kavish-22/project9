// import area
import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { BASE_URL } from "./helper/Healper";

function App() {
  // hooks area
  const [Business_c, setBusiness_c] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [recentLocations, setRecentLocations] = useState(
    JSON.parse(localStorage.getItem("recentLocations")) || []
  );

  // Fetch business categories
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/api/business-categories?populate=*&sort=order:asc&filters[is_featured][$eq]=true`
      )
      .then((response) => {
        setBusiness_c(response?.data?.data || []);
      })
      .catch((error) => console.log(error));
  }, []);

  // Fetch cities
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/cities?populate=*`)
      .then((response) => {
        setCities(response?.data?.data || []);
      })
      .catch((error) => console.log(error));
  }, []);

  // Save recent locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("recentLocations", JSON.stringify(recentLocations));
  }, [recentLocations]);

  // Filter cities dynamically
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  // Detect Location Handler
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          try {
            // Call OpenStreetMap Reverse Geocoding API
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );

            const city =
              res.data.address.city ||
              res.data.address.town ||
              res.data.address.village ||
              res.data.address.state;

            setDetectedLocation(city);
            if (city) {
              setRecentLocations((prev) => [
                ...new Set([city, ...prev.slice(0, 4)]), // keep max 5
              ]);
            }
          } catch (err) {
            console.log(err);
            alert("Unable to detect location");
          }
        },
        (err) => {
          alert("Location permission denied: " + err.message);
        }
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  return (
    <>
      <div className="row mt-5 justify-content-center g-2">
        {/* Location Dropdown */}
        <div className="col-md-3 col-12">
          <div className="dropdown w-100">
            <button
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-between"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-geo-alt me-2"></i>{" "}
              {detectedLocation ? detectedLocation : "Select Location"}
            </button>

            <ul
              className="dropdown-menu p-3 w-100"
              style={{ maxHeight: "350px", overflowY: "auto" }}
            >
              {/* Detect Location */}
              <li className="mb-2">
                <button
                  className="btn btn-link p-0 text-primary fw-bold"
                  onClick={handleDetectLocation}
                >
                  <i className="bi bi-crosshair2 me-1"></i> Detect Location
                </button>
              </li>

              <hr />

              {/* Recent Locations */}
              <li className="fw-bold small text-muted">RECENT LOCATIONS</li>
              {recentLocations.length > 0 ? (
                recentLocations.map((loc, i) => (
                  <li key={i}>
                    <a href="#" className="dropdown-item">
                      {loc}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-muted small">No recent locations</li>
              )}
              {recentLocations.length > 0 && (
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => setRecentLocations([])}
                  >
                    Clear All
                  </button>
                </div>
              )}

              <hr />

              {/* Trending Areas */}
              <li className="fw-bold small text-muted">TRENDING AREAS</li>
              {[
                "Vijay Nagar, Indore",
                "Khajrana, Indore",
                "Sudama Nagar, Indore",
                "Mhow, Indore",
              ].map((area, i) => (
                <li key={i}>
                  <a href="#" className="dropdown-item">
                    {area}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Search Box */}
        <div className="col-md-5 col-12">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search for Spa & Salons"
            />
            <button className="btn btn-danger">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      <hr />

      {/* Business Categories */}
      <ul className="row">
        {Business_c.length > 0 &&
          Business_c.map((cv, index) => (
            <li className="col-3 col-md-2 text-center mb-4" key={index}>
              <a
                href="#"
                className="d-block p-3 border rounded-3 text-decoration-none text-dark shadow-sm category-card"
              >
                <div className="mb-2">
                  <img
                    src={cv.icon_url} // Icon from backend
                    alt={cv.name}
                    width="60"
                    height="50"
                    className="mb-2"
                  />
                  <p>{cv.name}</p>
                </div>
              </a>
            </li>
          ))}
      </ul>
    </>
  );
}

export default App;
