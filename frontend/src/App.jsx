// import area
import { useEffect, useState } from 'react';
import './App.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';
import { BASE_URL } from './helper/Healper';

function App() {

  // hooks area
  const [Business_c, setBusiness_c] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState("");

  // Fetch business categories 
  useEffect(() => {
    axios.get(`${BASE_URL}/api/business-categories?populate=*&sort=order:asc&filters[is_featured][$eq]=true`)
      .then((response) => {
        setBusiness_c(response?.data?.data || []);
      })
      .catch((error) => console.log(error));
  }, []);

  // Fetch cities 
  useEffect(() => {
    axios.get(`${BASE_URL}/api/cities?populate=*`)
      .then((response) => {
        setCities(response?.data?.data || []);
      })
      .catch((error) => console.log(error));
  }, []);

  // Filter cities dynamically
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <>
      <div className="row mt-5 justify-content-center g-2">
        <div className="col-md-3 col-12">
          <div className="dropdown w-100">
            <button
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-between"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-geo-alt me-2"></i> Search Location
            </button>

            <ul
              className="dropdown-menu p-3 w-100"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              <li className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search city..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </li>

              <hr />

              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <li key={index}>
                    <a href="#" className="dropdown-item">
                      {city.name}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-muted text-center small">No city found</li>
              )}
            </ul>
          </div>
        </div>

        <div className="col-md-5 col-12">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search for Spa & Salons" />
            <button className="btn btn-danger">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      <hr />

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
