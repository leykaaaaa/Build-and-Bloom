
/*
|--------------------------------------------------------------------------
| WEATHER ADVISORY SERVICE
|--------------------------------------------------------------------------
|
| Generates plant care advisories using current weather
| and forecast data from OpenWeatherMap.
|
*/

function generateCurrentAdvisories(weather) {

    const advisories = [];

    if (!weather) {
        return advisories;
    }

    const temperature = Number(weather.temperature);
    const feelsLike = Number(weather.feels_like);
    const humidity = Number(weather.humidity);
    const rainfall = Number(weather.rainfall);

    /*
     * RAINFALL ADVISORY
     */

    if (Number.isFinite(rainfall) && rainfall > 0) {

        advisories.push({
            type: "watering",
            priority: "info",
            title: "Check Soil Moisture",
            message:
                "Rainfall has been recorded in your location. Check the soil moisture before watering your plants to avoid overwatering."
        });

    }

    /*
     * HIGH TEMPERATURE ADVISORY
     */

    if (
        Number.isFinite(temperature) &&
        temperature >= 35
    ) {

        advisories.push({
            type: "temperature",
            priority: "high",
            title: "High Temperature Alert",
            message:
                "High temperatures are currently recorded. Monitor your plants for signs of heat stress and check soil moisture regularly."
        });

    } else if (
        Number.isFinite(temperature) &&
        temperature >= 32
    ) {

        advisories.push({
            type: "temperature",
            priority: "warning",
            title: "Warm Weather Advisory",
            message:
                "Warm conditions are present. Monitor your plants and check whether the soil needs additional moisture."
        });

    }

    /*
     * HIGH HUMIDITY ADVISORY
     */

    if (
        Number.isFinite(humidity) &&
        humidity >= 85
    ) {

        advisories.push({
            type: "humidity",
            priority: "warning",
            title: "High Humidity Advisory",
            message:
                "Humidity is high. Monitor your plants for signs of fungal growth and avoid unnecessary overhead watering."
        });

    }

    /*
     * HIGH FEELS-LIKE TEMPERATURE
     */

    if (
        Number.isFinite(feelsLike) &&
        feelsLike >= 38
    ) {

        advisories.push({
            type: "heat",
            priority: "warning",
            title: "Heat Stress Monitoring",
            message:
                "The apparent temperature is elevated. Observe plants for wilting or heat stress, especially during the hottest hours."
        });

    }

    /*
     * GENERAL WEATHER MESSAGE
     */

    if (advisories.length === 0) {

        advisories.push({
            type: "general",
            priority: "info",
            title: "No Immediate Weather Alert",
            message:
                "No weather-related alert was triggered by the current readings. Continue monitoring your plants and checking soil moisture."
        });

    }

    return advisories;

}


/*
|--------------------------------------------------------------------------
| FORECAST ADVISORIES
|--------------------------------------------------------------------------
*/

function generateForecastAdvisories(forecast) {

    const advisories = [];

    if (!Array.isArray(forecast) || forecast.length === 0) {
        return advisories;
    }

    const rainyForecasts = forecast.filter((item) => {

        const rainfall = Number(item.rainfall);

        return (
            Number.isFinite(rainfall) &&
            rainfall >= 1
        );

    });

    if (rainyForecasts.length > 0) {

        advisories.push({
            type: "rain",
            priority: "warning",
            title: "Rain Expected",
            message:
                "Rainfall is forecast in the coming days. Check soil moisture before watering and ensure your growing area has adequate drainage.",
            occurrences: rainyForecasts.length
        });

    }

    const hotForecasts = forecast.filter((item) => {

        const temperature = Number(item.temperature);

        return (
            Number.isFinite(temperature) &&
            temperature >= 35
        );

    });

    if (hotForecasts.length > 0) {

        advisories.push({
            type: "temperature",
            priority: "high",
            title: "High Temperature Expected",
            message:
                "High temperatures are forecast. Monitor plants for heat stress and check soil moisture more frequently.",
            occurrences: hotForecasts.length
        });

    }

    if (advisories.length === 0) {

        advisories.push({
            type: "general",
            priority: "info",
            title: "No Major Forecast Alert",
            message:
                "No major rainfall or high-temperature alert was detected in the available forecast."
        });

    }

    return advisories;

}


module.exports = {
    generateCurrentAdvisories,
    generateForecastAdvisories
};