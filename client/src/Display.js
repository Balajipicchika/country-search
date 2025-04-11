import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaMoon, FaSun } from "react-icons/fa";
import ChatBot from "./components/ChatBot"

const Display = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("");
  const [region, setRegion] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [allCountries, setAllCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const errorShownRef = useRef(false);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    try {
      let url = "https://restcountries.com/v3.1/all";

      if (query.trim() !== "") {
        url = `https://restcountries.com/v3.1/name/${query.trim()}`;
      }

      const response = await axios.get(url);
      let data = response.data;

      if (continent) {
        data = data.filter((c) => c.continents?.includes(continent));
      }

      if (region) {
        data = data.filter((c) => c.region === region);
      }

      if (!data.length) {
        if (!errorShownRef.current) {
          toast.warn("No countries found!");
          errorShownRef.current = true;
        }
      } else {
        errorShownRef.current = false; // reset when valid data is found
      }

      setCountries(data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (!errorShownRef.current) {
        toast.error("Country not found. Please check your spelling.");
        errorShownRef.current = true;
      }
      setCountries([]);
    } finally {
      setLoading(false);
    }
  }, [query, continent, region]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  useEffect(() => {
    const loadAllCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setAllCountries(response.data); // Existing countries state
      } catch (err) {
        console.error("Failed to fetch all countries");
      }
    };

    loadAllCountries();
  }, []);

  const uniqueContinents = [
    ...new Set(
      allCountries
        .filter((c) => (region ? c.region === region : true))
        .flatMap((c) => c.continents || [])
    ),
  ];

  const uniqueRegions = [
    ...new Set(
      allCountries
        .filter((c) => (continent ? c.continents?.includes(continent) : true))
        .map((c) => c.region)
        .filter(Boolean)
    ),
  ];

  const containerStyle = {
    // padding: "10px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: darkMode ? "#1e1e1e" : "#f2f2f2",
    color: darkMode ? "#ffffff" : "#000000",
    minHeight: "100vh",
  };

  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "15px",
    maxWidth: "450px",
    backgroundColor: darkMode ? "#2e2e2e" : "#ffffff",
    color: darkMode ? "#ffffff" : "#000000",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flex: "1 1 300px",
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          padding: "15px 20px",
          backgroundColor: darkMode ? "#222" : "#f0f0f0",
          color: darkMode ? "#fff" : "#000",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", margin: 0 }}>🌍 Country Explorer</h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={query}
            placeholder="Search by country name"
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "220px",
            }}
          />

          <button
            onClick={() => {
              if (query.trim() === "") {
                toast.warn("Please enter a country name");
                return;
              }
              fetchCountries();
            }}
            style={{
              padding: "10px 15px",
              backgroundColor: darkMode ? "#555" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              margin: "auto",
            }}
          >
            Search
          </button>

          <select
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Filter by Continent</option>
            {uniqueContinents.map((cont, i) => (
              <option key={i} value={cont}>
                {cont}
              </option>
            ))}
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Filter by Region</option>
            {uniqueRegions.map((reg, i) => (
              <option key={i} value={reg}>
                {reg}
              </option>
            ))}
          </select>

          <div
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark Mode"
            style={{
              fontSize: "1.5rem",
              cursor: "pointer",
              marginLeft: "10px",
              color: darkMode ? "#fff" : "#333",
            }}
          >
            {darkMode ? <FaMoon /> : <FaSun />}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p>Loading countries...</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            padding: "10px",
            justifyContent: "center",
          }}
        >
          {countries.map((country) => (
            <div key={country.name.common} style={cardStyle}>
              <h2>{country.name.common}</h2>
              <table style={{ width: "100%", fontSize: "14px" }}>
                <tbody>
                  <tr>
                    <td>
                      <b>Official Name:</b>
                    </td>
                    <td>{country.name.official}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Capital:</b>
                    </td>
                    <td>{country.capital?.[0]}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Region:</b>
                    </td>
                    <td>{country.region}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Sub-Region:</b>
                    </td>
                    <td>{country.subregion}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Continent:</b>
                    </td>
                    <td>{country.continents?.join(", ")}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Population:</b>
                    </td>
                    <td>{country.population.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Area:</b>
                    </td>
                    <td>{country.area.toLocaleString()} km²</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Borders:</b>
                    </td>
                    <td>{country.borders?.join(", ") || "None"}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Time Zones:</b>
                    </td>
                    <td>{country.timezones?.join(", ")}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Start Of Week:</b>
                    </td>
                    <td>{country.startOfWeek}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Currency:</b>
                    </td>
                    <td>
                      {country.currencies &&
                        Object.values(country.currencies).map((cur, idx) => (
                          <span key={idx}>
                            {cur.name} ({cur.symbol})
                            {idx < Object.values(country.currencies).length - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Languages:</b>
                    </td>
                    <td>
                      {country.languages &&
                        Object.values(country.languages).join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>UN Member:</b>
                    </td>
                    <td>{country.unMember ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Status:</b>
                    </td>
                    <td>{country.status}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Google Maps:</b>
                    </td>
                    <td>
                      <a
                        href={country.maps?.googleMaps}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>OpenStreetMap:</b>
                    </td>
                    <td>
                      <a
                        href={country.maps?.openStreetMaps}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <img
                src={country.flags?.png}
                alt={`Flag of ${country.name.common}`}
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  objectFit: "cover",
                }}
              />
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: darkMode ? "#ccc" : "#555",
                }}
              >
                {country.flags?.alt}
              </p>
              {country.coatOfArms?.png && (
                <>
                  <h4>Coat of Arms:</h4>
                  <img
                    src={country.coatOfArms.png}
                    alt={`Coat of arms of ${country.name.common}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "5px",
                      objectFit: "contain",
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <ChatBot darkMode={darkMode} />
    </div>
  );
};

export default Display;
