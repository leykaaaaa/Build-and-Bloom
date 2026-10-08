"use client";

import { useEffect, useState } from "react";

import {
    getCurrentWeather,
    getWeatherForecast,
    getWeatherAdvisory
} from "../../services/weatherService";



function getWeatherIcon(condition) {

    const weather = condition?.toLowerCase() || "";

    if (weather.includes("rain")) {
        return "️";
    }

    if (weather.includes("cloud")) {
        return "️";
    }

    if (weather.includes("thunder")) {
        return "️";
    }

    if (weather.includes("snow")) {
        return "️";
    }

    if (weather.includes("clear")) {
        return "️";
    }

    return "️";
}



function formatForecastDate(datetime) {

    const date = new Date(
        datetime.replace(" ", "T")
    );

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric"
        }
    );

}


function formatForecastTime(datetime) {

    const date = new Date(
        datetime.replace(" ", "T")
    );

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


export default function WeatherPage() {

    const [location, setLocation] =
        useState("Dagupan");

    const [currentWeather, setCurrentWeather] =
        useState(null);

    const [forecast, setForecast] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

        const [currentAdvisories, setCurrentAdvisories] =
    useState([]);

const [forecastAdvisories, setForecastAdvisories] =
    useState([]);

const [advisoryError, setAdvisoryError] =
    useState("");

    const [locations, setLocations] = useState([]);

    // =========================================================
// LOAD PANGASINAN LOCATIONS
// =========================================================

useEffect(() => {

    async function loadLocations() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/locations"
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to load locations."
                );
            }

            setLocations(result.data || []);

        } catch (error) {

            console.error(
                "Failed to load locations:",
                error
            );

        }

    }

    loadLocations();

}, []);


    // =========================================================
    // AUTH CHECK
    // =========================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "buildAndBloomUser"
            );

        if (!storedUser) {

            window.location.href = "/login";

            return;

        }

        try {

            const parsedUser =
                JSON.parse(storedUser);

            if (!parsedUser?.user_id) {

                localStorage.removeItem(
                    "buildAndBloomUser"
                );

                window.location.href = "/login";

            }

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem(
                "buildAndBloomUser"
            );

            window.location.href = "/login";

        }

    }, []);


    // =========================================================
    // LOAD WEATHER
    // =========================================================

async function loadWeather(selectedLocation) {

    setLoading(true);
    setError("");
    setAdvisoryError("");

    setCurrentAdvisories([]);
    setForecastAdvisories([]);

    try {

        // =========================================
        // LOAD CURRENT WEATHER AND FORECAST
        // =========================================

        const [
            current,
            forecastData
        ] = await Promise.all([
            getCurrentWeather(selectedLocation),
            getWeatherForecast(selectedLocation)
        ]);

        setCurrentWeather(current);

        setForecast(
            forecastData.forecast || []
        );


        // =========================================
        // LOAD WEATHER-BASED CARE ADVISORIES
        // =========================================

        try {

            const advisoryData =
                await getWeatherAdvisory(selectedLocation);

            setCurrentAdvisories(
                advisoryData.currentAdvisories || []
            );

            setForecastAdvisories(
                advisoryData.forecastAdvisories || []
            );

        } catch (advisoryErr) {

            console.error(
                "Weather advisory error:",
                advisoryErr
            );

            setAdvisoryError(
                advisoryErr.message ||
                "Unable to load plant care advisories."
            );

        }

    } catch (err) {

        console.error(err);

        setError(
            err.message ||
            "Unable to load weather information."
        );

        setCurrentWeather(null);
        setForecast([]);

        setCurrentAdvisories([]);
        setForecastAdvisories([]);

    } finally {

        setLoading(false);

    }

}

    function handleLocationChange(event) {

        const selectedLocation =
            event.target.value;

        setLocation(selectedLocation);

        loadWeather(selectedLocation);

    }


    return (

        <section className="weather-page">

            <div className="weather-container">


                {/* HEADER */}

                <div className="weather-header">

                    <span className="section-badge">
                        ️ Build & Bloom
                    </span>

                    <h1>
                        Weather
                    </h1>

                    <p>
                        Check current weather and upcoming
                        conditions to help you make better
                        planting and care decisions.
                    </p>

                </div>


                {/* LOCATION */}

                <div className="weather-location">

                    <div>

                        <span>
                             Growing Location
                        </span>

                        <strong>
                            {location}, Pangasinan
                        </strong>

                    </div>


                <select
    value={location}
    onChange={handleLocationChange}
    disabled={locations.length === 0}
>

    {locations.map((item) => (

        <option
            key={item.location_id}
            value={item.location_name}
        >
            {item.location_name}
        </option>

    ))}

</select>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="weather-error">

                        <span>
                            ️
                        </span>

                        <div>

                            <strong>
                                Unable to load weather
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* LOADING */}

                {loading && (

                    <div className="weather-loading">

                        <span>
                            ️
                        </span>

                        <p>
                            Loading weather information...
                        </p>

                    </div>

                )}


                {/* WEATHER CONTENT */}

                {!loading &&
                    !error &&
                    currentWeather && (

                    <>

                        {/* CURRENT WEATHER */}

                        <section className="current-weather-section">

                            <div className="weather-section-title">

                                <div>

                                    <span className="section-badge">
                                        Current Conditions
                                    </span>

                                    <h2>
                                        Weather in {location}
                                    </h2>

                                </div>

                            </div>


                            <div className="current-weather-card">

                                <div className="main-weather">

                                    <div className="weather-icon-large">

                                        {getWeatherIcon(
                                            currentWeather.weather_condition
                                        )}

                                    </div>


                                    <div>

                                        <strong className="current-temperature">

                                            {Math.round(
                                                currentWeather.temperature
                                            )}

                                            °C

                                        </strong>

                                        <p className="weather-description">

                                            {currentWeather.weather_description}

                                        </p>

                                        <span>

                                            Feels like{" "}

                                            {Math.round(
                                                currentWeather.feels_like
                                            )}

                                            °C

                                        </span>

                                    </div>

                                </div>


                                <div className="weather-stats">

                                    <div className="weather-stat">

                                        <span>
                                            
                                        </span>

                                        <div>

                                            <small>
                                                Humidity
                                            </small>

                                            <strong>
                                                {currentWeather.humidity}%
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="weather-stat">

                                        <span>
                                            ️
                                        </span>

                                        <div>

                                            <small>
                                                Rainfall
                                            </small>

                                            <strong>
                                                {currentWeather.rainfall} mm
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="weather-stat">

                                        <span>
                                            
                                        </span>

                                        <div>

                                            <small>
                                                Wind
                                            </small>

                                            <strong>
                                                {currentWeather.wind_speed} m/s
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>


                       
{/* =========================================================
    CURRENT WEATHER-BASED CARE ADVISORIES
========================================================= */}

<section className="weather-advisories-section">

    <div className="weather-section-title">

        <div>

            <span className="section-badge">
                Smart Plant Care
            </span>

            <h2>
                Current Care Advisories
            </h2>

        </div>

    </div>


    {currentAdvisories.length > 0 ? (

        <div className="weather-advisory-list">

            {currentAdvisories.map(
                (advisory, index) => (

                    <article
                        className={`weather-advisory priority-${advisory.priority}`}
                        key={`${advisory.type}-${index}`}
                    >

                        <div className="advisory-icon">
                            {advisory.priority === "high"
                                ? "️"
                                : advisory.priority === "warning"
                                    ? "️"
                                    : ""}
                        </div>

                        <div>

                            <span>
                                {advisory.priority.toUpperCase()}
                            </span>

                            <h3>
                                {advisory.title}
                            </h3>

                            <p>
                                {advisory.message}
                            </p>

                        </div>

                    </article>

                )
            )}

        </div>

    ) : (

        <p>
            No current care advisories available.
        </p>

    )}

</section>


{/* =========================================================
    FORECAST-BASED CARE ADVISORIES
========================================================= */}

<section className="weather-advisories-section">

    <div className="weather-section-title">

        <div>

            <span className="section-badge">
                Weather Preparation
            </span>

            <h2>
                Upcoming Care Advisories
            </h2>

        </div>

    </div>


    {forecastAdvisories.length > 0 ? (

        <div className="weather-advisory-list">

            {forecastAdvisories.map(
                (advisory, index) => (

                    <article
                        className={`weather-advisory priority-${advisory.priority}`}
                        key={`${advisory.type}-${index}`}
                    >

                        <div className="advisory-icon">
                            {advisory.priority === "high"
                                ? "️"
                                : advisory.priority === "warning"
                                    ? "️"
                                    : ""}
                        </div>

                        <div>

                            <span>
                                {advisory.priority.toUpperCase()}
                            </span>

                            <h3>
                                {advisory.title}
                            </h3>

                            <p>
                                {advisory.message}
                            </p>

                            {advisory.occurrences !== undefined && (

                                <small>
                                    Detected in {advisory.occurrences} forecast entries.
                                </small>

                            )}

                        </div>

                    </article>

                )
            )}

        </div>

    ) : (

        <p>
            No upcoming care advisories available.
        </p>

    )}


    {advisoryError && (

        <div className="weather-error">

            <strong>
                Unable to load care advisories
            </strong>

            <p>
                {advisoryError}
            </p>

        </div>

    )}

</section>


                        {/* FORECAST */}

                        <section className="forecast-section">

                            <div className="weather-section-title">

                                <div>

                                    <span className="section-badge">
                                        Extended Forecast
                                    </span>

                                    <h2>
                                        Upcoming Weather
                                    </h2>

                                </div>

                                <p>
                                    Weather forecast provided
                                    through OpenWeatherMap.
                                </p>

                            </div>


                            <div className="forecast-grid">

                                {forecast.map(
                                    (item, index) => (

                                        <article
                                            className="forecast-card"
                                            key={`${item.datetime}-${index}`}
                                        >

                                            <span className="forecast-date">

                                                {formatForecastDate(
                                                    item.datetime
                                                )}

                                            </span>


                                            <span className="forecast-time">

                                                {formatForecastTime(
                                                    item.datetime
                                                )}

                                            </span>


                                            <div className="forecast-icon">

                                                {getWeatherIcon(
                                                    item.weather_condition
                                                )}

                                            </div>


                                            <strong className="forecast-temperature">

                                                {Math.round(
                                                    item.temperature
                                                )}

                                                °C

                                            </strong>


                                            <span className="forecast-condition">

                                                {item.weather_description}

                                            </span>


                                            <div className="forecast-details">

                                                <span>
                                                     {item.humidity}%
                                                </span>

                                                <span>
                                                    ️ {item.rainfall} mm
                                                </span>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        </section>

                    </>

                )}

            </div>

        </section>

    );

}