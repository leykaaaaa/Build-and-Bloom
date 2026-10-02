"use client";

import { useEffect, useState } from "react";

import {
    getCurrentWeather,
    getWeatherForecast
} from "../../services/weatherService";


const locations = [
    "Dagupan",
    "Lingayen",
    "Urdaneta",
    "Santa Barbara",
    "San Carlos"
];


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


function getAdvisory(weather) {

    if (!weather) {
        return null;
    }

    const temperature =
        Number(weather.temperature);

    const humidity =
        Number(weather.humidity);

    const rainfall =
        Number(weather.rainfall);


    if (
        weather.weather_condition
            ?.toLowerCase()
            .includes("rain") ||
        rainfall > 0
    ) {

        return {
            icon: "️",
            title: "Rainy Weather",
            message:
                "Rainfall is currently present. Consider reducing or postponing watering to avoid overwatering your plants."
        };

    }


    if (temperature >= 33) {

        return {
            icon: "️",
            title: "Hot Weather",
            message:
                "High temperatures may increase water loss. Monitor soil moisture and provide adequate water when needed."
        };

    }


    if (humidity >= 85) {

        return {
            icon: "",
            title: "High Humidity",
            message:
                "Humidity is high. Monitor your plants and avoid unnecessary watering to help prevent excessive moisture."
        };

    }


    return {
        icon: "",
        title: "Favorable Conditions",
        message:
            "Current weather conditions do not indicate a major weather-related concern. Continue monitoring your plants and soil."
    };

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

        try {

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

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to load weather information."
            );

            setCurrentWeather(null);

            setForecast([]);

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadWeather(location);

    }, []);


    function handleLocationChange(event) {

        const selectedLocation =
            event.target.value;

        setLocation(selectedLocation);

        loadWeather(selectedLocation);

    }


    const advisory =
        getAdvisory(currentWeather);


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
                    >

                        {locations.map(
                            (item) => (

                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>

                            )
                        )}

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


                        {/* ADVISORY */}

                        {advisory && (

                            <section className="weather-advisory">

                                <div className="advisory-icon">

                                    {advisory.icon}

                                </div>

                                <div>

                                    <span>
                                        Smart Care Advisory
                                    </span>

                                    <h3>
                                        {advisory.title}
                                    </h3>

                                    <p>
                                        {advisory.message}
                                    </p>

                                </div>

                            </section>

                        )}


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