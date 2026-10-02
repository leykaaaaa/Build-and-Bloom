const API_URL = "http://localhost:5000";

export async function getCurrentWeather(location) {
    const response = await fetch(
        `${API_URL}/api/weather/current?location=${encodeURIComponent(location)}`
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to retrieve current weather."
        );
    }

    return result.data;
}


export async function getWeatherForecast(location) {
    const response = await fetch(
        `${API_URL}/api/weather/forecast?location=${encodeURIComponent(location)}`
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to retrieve weather forecast."
        );
    }

    return result.data;
}